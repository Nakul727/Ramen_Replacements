package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)
// ... (import statements)

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
	var recipe Recipe

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recipe.PostTime = time.Now().Unix()

	err := StoreRecipeInDB(recipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store the recipe in the database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Recipe successfully posted"})
}

func StoreRecipeInDB(recipe Recipe) error {
	ingredientsJSONB, _ := json.Marshal(recipe.Ingredients)
	instructionsJSONB, _ := json.Marshal(recipe.Instructions)
	tagsJSONB, _ := json.Marshal(recipe.Tags)
	appliancesJSONB, _ := json.Marshal(recipe.Appliances)
	nutrientsJSONB, _ := json.Marshal(recipe.Nutrients)
	costBreakdownJSONB, _ := json.Marshal(recipe.CostBreakdown)

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

func ExploreRecipes(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, title, image, description, is_public, post_time, rating, total_cost, tags, nutrients, cost_breakdown
		FROM recipes
		WHERE is_public = true
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve recipes from the database"})
		return
	}
	defer rows.Close()

	var recipes []Recipe

	for rows.Next() {
		var recipe Recipe
		var tagsJSON, nutrientsJSON, costBreakdownJSON []byte

		err := rows.Scan(
			&recipe.ID, &recipe.Title, &recipe.Image, &recipe.Description,
			&recipe.IsPublic, &recipe.PostTime, &recipe.Rating, &recipe.TotalCost,
			&tagsJSON, &nutrientsJSON, &costBreakdownJSON,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan recipe from the database"})
			return
		}

		err = json.Unmarshal(tagsJSON, &recipe.Tags)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal tags"})
			return
		}
		err = json.Unmarshal(nutrientsJSON, &recipe.Nutrients)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal nutrients"})
			return
		}
		err = json.Unmarshal(costBreakdownJSON, &recipe.CostBreakdown)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal cost breakdown"})
			return
		}

		recipes = append(recipes, recipe)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while iterating over rows"})
		return
	}

	c.JSON(http.StatusOK, recipes)
}

//----------------------------------------------------------------------------------

func GetRecipeByID(c *gin.Context) {
	recipeIDStr := c.Param("id")
	recipeID, err := strconv.Atoi(recipeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid recipe ID"})
		return
	}

	row := db.QueryRow(`
		SELECT id, user_id, title, image, description, ingredients, instructions,
			is_public, post_time, rating, total_cost, tags, appliances, nutrients, cost_breakdown
		FROM recipes
		WHERE id = $1
	`, recipeID)

	var recipe Recipe
	var tagsJSON, nutrientsJSON, costBreakdownJSON, appliancesJSON []byte

	err = row.Scan(
		&recipe.ID, &recipe.UserID, &recipe.Title, &recipe.Image, &recipe.Description,
		&recipe.Ingredients, &recipe.Instructions, &recipe.IsPublic, &recipe.PostTime,
		&recipe.Rating, &recipe.TotalCost, &tagsJSON, &appliancesJSON,
		&nutrientsJSON, &costBreakdownJSON,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve recipe from the database"})
		return
	}

	err = json.Unmarshal(tagsJSON, &recipe.Tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal tags"})
		return
	}
	err = json.Unmarshal(nutrientsJSON, &recipe.Nutrients)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal nutrients"})
		return
	}

	var recipeAppliances map[string]bool
	err = json.Unmarshal(appliancesJSON, &recipeAppliances)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal appliances"})
		return
	}
	recipe.Appliances = recipeAppliances

	err = json.Unmarshal(costBreakdownJSON, &recipe.CostBreakdown)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal cost breakdown"})
		return
	}

	c.JSON(http.StatusOK, recipe)
}

//----------------------------------------------------------------------------------