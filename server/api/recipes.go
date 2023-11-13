package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

//----------------------------------------------------------------------------------

type Recipe struct {
	ID            int                        `json:"ID"`
	UserID        int                        `json:"userID"`

	Title         string                     `json:"title"`
	Image         string                     `json:"image"`
	Description   string                     `json:"description"`
	Ingredients   string                     `json:"Ingredients"`
	Instructions  string                     `json:"Instructions"`

	IsPublic      bool                       `json:"isPublic"`
	PostTime      int64                      `json:"postTime"`
	Rating        float64                    `json:"rating"`
	TotalCost     float64                    `json:"totalCost"`

	Tags          []string                   `json:"tags"`

	Appliances    map[string]bool            `json:"Appliances"`
	Nutrients     map[string]float64         `json:"nutrients"`
	CostBreakdown []map[string]interface{}   `json:"CostBreakdown"`
}

//----------------------------------------------------------------------------------

func PostRecipe(c *gin.Context) {
	// Create a Recipe instance to hold the incoming JSON data
	var recipe Recipe

	// Bind the incoming JSON data to the Recipe struct
	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the PostTime to the current Unix timestamp
	recipe.PostTime = time.Now().Unix()

	// Store the Recipe in the database
	err := StoreRecipeInDB(recipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store the recipe in the database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Recipe successfully posted"})
	
}

func StoreRecipeInDB(recipe Recipe) error {

	// Convert JSON objects to JSONB
	ingredientsJSONB, _ := json.Marshal(recipe.Ingredients)
	instructionsJSONB, _ := json.Marshal(recipe.Instructions)
	tagsJSONB, _ := json.Marshal(recipe.Tags)
	appliancesJSONB, _ := json.Marshal(recipe.Appliances)
	nutrientsJSONB, _ := json.Marshal(recipe.Nutrients)
	costBreakdownJSONB, _ := json.Marshal(recipe.CostBreakdown)

	// Perform database insertion
	_, err := db.Exec(`
		INSERT INTO recipes (
			user_id, title, image, description, ingredients, instructions,
			is_public, post_time, rating, total_cost, tags, appliances, nutrients, cost_breakdown
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
		)`,
		recipe.UserID, recipe.Title, recipe.Image, recipe.Description,
		ingredientsJSONB, instructionsJSONB, recipe.IsPublic, recipe.PostTime,
		recipe.Rating, recipe.TotalCost, tagsJSONB, appliancesJSONB,
		nutrientsJSONB, costBreakdownJSONB,
	)
	return err
}

//----------------------------------------------------------------------------------