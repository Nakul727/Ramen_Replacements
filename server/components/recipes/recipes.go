package Recipes

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	_ "github.com/gin-contrib/cors" // enable cors package for cross-origin requests (different ports)

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
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

// for keeping track of max length when putting new data in db
var maxTitleLen = 100
var maxDescLen = 1000
var maxStepsLen = 5000
var maxIngredientsLen = 500
var maxPictureLen = 250

var db *sql.DB

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

// HANDLER FUNCTIONS
func postRecipe(c *gin.Context) {
	var rec Recipe
	if err := c.BindJSON(&rec); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error binding input"})
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

	// get time of posting
	currentTime := int32(time.Now().Unix())

	// insert recipe to database (what an ugly line -simon)
	_, err := db.Exec("INSERT INTO Recipes (userID, rating, title, description, steps, ingredients, picture, appliances, date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);",
		rec.UserID, rec.Rating, rec.Title, rec.Description, rec.Steps, rec.Ingredients, rec.Picture, rec.Appliances, currentTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.Status(http.StatusAccepted)
}

// queries database: finds post recipe with given id
func getRecipe(c *gin.Context) {
	id_string := c.DefaultQuery("id", "??NULL??")
	if id_string == "??NULL??" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no id provided for search query"})
		return
	}
	id, _ := strconv.Atoi(id_string)

	resp, err := db.Query("SELECT * FROM Recipes WHERE id = ?;", id)
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
func getRecipesByDate(c *gin.Context) {
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

// handler for recipe functions
func RunRecipes(r *gin.Engine, database *sql.DB) {
	r.POST("recipe/post", postRecipe)
	r.GET("recipe/get", getRecipe)
	r.GET("recipe/latest", getRecipesByDate)
	db = database
}
