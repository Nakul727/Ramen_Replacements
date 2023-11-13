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
	"github.com/lib/pq"
)

//----------------------------------------------------------------------------------

type Recipe struct {
    ID              int             `json:"ID"`             // RecipeID

    UserID          int             `json:"userID"`         // UserID
    Title           string          `json:"title"`          // Title of Recipe
    Image           string          `json:"image"`          // Cover Image of Recipe
    Description     string          `json:"description"`    // Description
    PostTime        int64           `json:"postTime"`       // Time of posted (from UNIX)
    IsPublic        bool            `json:"isPublic"`       // Public/Private Recipe
    Rating          int             `json:"rating"`         // Current rating of recipe

    Tags            []string        `json:"tags"`           //
    Ingredients     string          `json:"Ingredients"`    //
    Instructions    string          `json:"Instructions"`   //
    Appliances      map[string]bool `json:"Appliances"`     //

    TotalCost       float64         `json:"totalCost"`      //
    CostBreakdown   map[string]int  `json:"CostBreakdown"`  // {"2 bananas": 20,}
    Nutrients       NutrientInfo    `json:"nutrients"`      // 
}

type NutrientInfo struct {
    ID              int         `json:"ID"`             // RecipeID
    Calories        float64     `json:"calories"`
    Carbohydrates   float64     `json:"carbohydrates"`
    Fat             float64     `json:"fat"`
    Protein         float64     `json:"protein"`
}

//----------------------------------------------------------------------------------

// for keeping track of max length when putting new data in db
var maxTitleLen = 100
var maxDescLen = 1000
var maxStepsLen = 5000
var maxIngredientsLen = 500
var maxPictureLen = 250

// HELPER FUNCTIONS
func contextToRecipe(row *sql.Rows) (*Recipe, error) {
	var rec Recipe
	err := row.Scan(
		&rec.ID, &rec.UserID, &rec.Rating, &rec.Title, &rec.Description, &rec.Steps, &rec.Ingredients, &rec.Picture,
		&rec.Appliances, &rec.Date, &rec.Nutrition, &rec.Amounts, &rec.Public, &rec.Time, &rec.Cost)
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
		if len(listElem) >= len(ingredient) && listElem[:len(ingredient)] == ingredient {
			res.ID, _ = strconv.Atoi(curLine[index+1:])
			res.Name = ingredient
			fmt.Println("found ingredient: ", curLine)
			return &res
		}
	}
	return &Ingredient{"none", 0, 0}
}

// parses the ingredients string and separates its ingredients into
func parseIngredients(ingredients string) ([]Ingredient, error) {
	var results []string
	index := 2
	resultCount := 0
	startSlice, endSlice := 2, 2
	for index < len(ingredients) {
		// if next letter is apostrophe, then comma after that, it's the end of the ingredient name
		if ingredients[index] == '\'' && (ingredients[index+1] == ',' || ingredients[index+1] == '}') {
			endSlice = index
			results = append(results, ingredients[startSlice:endSlice])
			resultCount++
			// move index and start to beginning of next ingredient
			index += 3
			startSlice = index
		} else {
			index++
		}
	}
	if resultCount == 0 {
		return nil, errors.New("no ingredient found")
	}
	index = 0

	var ingredientList []Ingredient
	for index < resultCount {
		var curIngredient = searchInCsv(results[index])
		if curIngredient == nil {
			return nil, errors.New("error opening csv")
		} else if curIngredient.Name == "none" {
			return nil, errors.New("no ingredient found in list")
		}
		ingredientList = append(ingredientList, *curIngredient)
		index++
	}
	return ingredientList, nil
}

// HANDLER FUNCTIONS
func PostRecipe(c *gin.Context) {
	var rec RecipeIn
	if err := c.BindJSON(&rec); err != nil {
		fmt.Println("error binding json")
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// make sure input was provided for each field
	missingInput := (len(rec.Description) == 0 ||
		len(rec.Ingredients) == 0 ||
		len(rec.Steps) == 0 ||
		len(rec.Title) == 0 ||
		len(rec.Picture) == 0)

	if missingInput {
		c.JSON(http.StatusBadRequest, gin.H{"error": "please provide input for each field"})
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

	ingredients, err := parseIngredients(rec.Ingredients)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "unrecognized ingredient in recipe"})
		return
	}

	// calculate nutrition facts for each ingredient
	nutritionFacts, cost, err := calculate_nutrition_facts(ingredients, rec.Amounts)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadGateway, gin.H{"error": err})
		return
	}
	cost /= 100 // since cost is returned in cents, we want it in dollars

	// get time of posting
	currentTime := int32(time.Now().Unix())

	// convert arrays to comma separated strings
	nutritionStr := pq.Array(nutritionFacts)

	var sqpublic sql.NullBool = sql.NullBool{Bool: rec.Public, Valid: true}
	var sqcost sql.NullFloat64 = sql.NullFloat64{Float64: float64(cost), Valid: true}
	var sqtime sql.NullFloat64 = sql.NullFloat64{Float64: float64(rec.Time), Valid: true}

	// insert recipe to database
	_, err = db.Exec("INSERT INTO Recipes (userID, public, rating, title, description, steps, ingredients, picture, appliances, date, nutrition, amounts, cost, time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);",
		rec.UserID, sqpublic, rec.Rating, rec.Title, rec.Description, rec.Steps, rec.Ingredients, rec.Picture, rec.Appliances, currentTime, nutritionStr, rec.Amounts, sqcost, sqtime)
	if err != nil {
		fmt.Println(err)
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

func GetRecipesByDate(c *gin.Context) {
	// n is the number of recipes to query
	n, err := strconv.Atoi(c.DefaultQuery("num", "100"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := db.Query("SELECT * FROM Recipes ORDER BY date DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	i := 0
	var recipes []Recipe
	for resp.Next() && i < n {
		curRec, err := contextToRecipe(resp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		recipes = append(recipes, *curRec)
		i++
	}

	if len(recipes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No recipes found"})
		return
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
