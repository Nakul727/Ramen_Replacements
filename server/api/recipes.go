package api

import (
	"bufio"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// Recipe struct - contains all data for recipe cards
type Recipe struct {
	UserID      int    `json:"UserID"`      // ID of poster - recipe id is incremented automatically
	Rating      int    `json:"Rating"`      // Rating from 0-50 of recipe
	Title       string `json:"Title"`       // Title of recipe, i.e. "butter chicken" or "breakfast sandwich with bacon"
	Description string `json:"Description"` // Description of recipe
	Steps       string `json:"Steps"`       // Steps required to replicate recipe
	Ingredients string `json:"Ingredients"` // Ingredients used in recipe
	Picture     string `json:"Picture"`     // Picture of finished product
	Appliances  int16  `json:"Appliances"`  // Appliances needed : oven? stove? microwave? etc.
	Date        int    `json:"Date"`        // Date and time of posting. Represented as # of seconds since 01/01/1970 (unix time)
}

// struct for storing a recipe and its id for searching in second hand API
type Ingredient struct {
	Name string
	ID   int
}

// for keeping track of max length when putting new data in db
var maxTitleLen = 100
var maxDescLen = 1000
var maxStepsLen = 5000
var maxIngredientsLen = 500
var maxPictureLen = 250

// HELPER FUNCTIONS
func contextToRecipe(row *sql.Rows) (*Recipe, error) {
	var rec Recipe
	var temp int
	err := row.Scan(
		&temp, &rec.UserID, &rec.Rating, &rec.Title, &rec.Description,
		&rec.Steps, &rec.Ingredients, &rec.Picture, &rec.Appliances, &rec.Date)
	if err != nil {
		return nil, err
	} else {
		return &rec, nil
	}
}

// returns an ingredient if the ingredient is found in the top 1000 ingredients
func searchInCsv(ingredient string) *Ingredient {
	file, err := os.Open("top-1k-ingredients.csv")
	if err != nil {
		return nil
	}

	line := bufio.NewScanner(file)
	ingredient = strings.ToLower(ingredient)

	for line.Scan() {
		curLine := strings.ToLower(line.Text())
		var res Ingredient
		var listElem string
		index := 0
		for index < len(curLine) {
			if curLine[index] == ';' {
				break
			}
			listElem += string(curLine[index])
			index++
		}
		if listElem == ingredient {
			res.ID, _ = strconv.Atoi(curLine[index+1:])
			res.Name = ingredient
			fmt.Println(res.ID)
			fmt.Println(res.Name)
			return &res
		}
	}
	return nil
}

// parses the ingredients string and separates its ingredients into
func parseIngredients(ingredients string) ([]Ingredient, error) {
	var results []string
	index := 0
	dollarCount := 0
	resultCount := 0
	var curIngredient string
	for index < len(ingredients) {
		if dollarCount < 4 {
			if ingredients[index] == '$' {
				dollarCount++
			}
			if dollarCount == 4 {
				index++
			}
		} else {
			if ingredients[index] == '$' {
				dollarCount = 1
				if curIngredient != "" {
					results = append(results, curIngredient)
					resultCount++
					curIngredient = ""
				}
				continue
			}
			curIngredient += string(ingredients[index])
		}
		index++
	}
	if curIngredient != "" {
		results = append(results, curIngredient)
		resultCount++
	}
	if resultCount == 0 {
		return nil, errors.New("no ingredient found")
	}
	index = 0

	var ingredientList []Ingredient
	for index < resultCount {
		var curIngredient = searchInCsv(results[index])
		if curIngredient == nil {
			return nil, errors.New("Ingredient not found in list")
		}
		ingredientList = append(ingredientList, *curIngredient)
		index++
	}
	return ingredientList, nil
}

// HANDLER FUNCTIONS
func PostRecipe(c *gin.Context) {
	var rec Recipe
	if err := c.BindJSON(&rec); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// check lengths of input
	inputTooLong := (len(rec.Description) > maxDescLen ||
		len(rec.Ingredients) > maxIngredientsLen ||
		len(rec.Steps) > maxStepsLen ||
		len(rec.Title) > maxTitleLen ||
		len(rec.Picture) > maxPictureLen)

	// ensure length of input fits in db
	if inputTooLong {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input too long for one or more fields"})
		return
	}

	_, err := parseIngredients(rec.Ingredients)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unrecognized ingredient in recipe"})
	}

	// get time of posting
	currentTime := int32(time.Now().Unix())

	// insert recipe to database
	_, err = db.Exec("INSERT INTO Recipes (userID, rating, title, description, steps, ingredients, picture, appliances, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);",
		rec.UserID, rec.Rating, rec.Title, rec.Description, rec.Steps, rec.Ingredients, rec.Picture, rec.Appliances, currentTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.Status(http.StatusAccepted)
}

// queries database: finds post recipe with given id
func GetRecipe(c *gin.Context) {
	id_string := c.DefaultQuery("id", "??NULL??")
	if id_string == "??NULL??" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no id provided for search query"})
		return
	}
	id, _ := strconv.Atoi(id_string)

	resp, err := db.Query("SELECT * FROM Recipes WHERE id = $1;", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// return json data for recipe
	found := false
	for resp.Next() {
		rec, err := contextToRecipe(resp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		c.JSON(http.StatusOK, rec)
		found = true
	}

	// querying by id should always yield a result
	if !found {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no entry found"})
	}
}

// gets the most recently posted recipes - returns first n recipes or 100 by default
func GetRecipesByDate(c *gin.Context) {
	// n is number of recipes to query
	n, err := strconv.Atoi(c.DefaultQuery("num", "100"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	resp, err := db.Query("SELECT * FROM Recipes ORDER BY date DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	}

	i := 0
	var recipes []Recipe
	for resp.Next() && i < n {
		curRec, err := contextToRecipe(resp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		recipes = append(recipes, *curRec)
		i++
	}

	c.JSON(http.StatusOK, recipes)
}

// gets all recipes posted in specified time range, sorted by rating
func GetTopRecent(c *gin.Context) {
	// period is the time frame to get
	period := c.DefaultQuery("range", "day")
	// by default period is 1 day
	postRange := 60 * 60 * 24
	if period == "year" {
		postRange *= 365
	} else if period == "month" {
		postRange *= 30
	} else if period == "week" {
		postRange *= 7
	} else if period == "hour" {
		postRange /= 24
	}

	// set time to current time - time period i.e. - current time minus one week if applicable
	postRange = int(time.Now().Unix()) - postRange

	// get the first 1000 posts that fit in this time period
	resp, err := db.Query("SELECT * FROM Recipes WHERE date>$1 ORDER BY rating DESC", postRange)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// query recipes from db
	i := 0
	var recipes []Recipe
	for resp.Next() && i < 1000 {
		rec, err := contextToRecipe(resp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		recipes = append(recipes, *rec)
	}

	c.JSON(http.StatusOK, recipes)
}
