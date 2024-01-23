package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"server/utils"

	"github.com/gin-gonic/gin"
)

//----------------------------------------------------------------------------------

// STRUCTS

type Recipe struct {
	ID            int                        `json:"ID"`
	UserID        int                        `json:"userID"`
	Username      string                     `json:"username"`
	Title         string                     `json:"title"`
	Image         string                     `json:"image"`
	Description   string                     `json:"description"`
	Ingredients   string                     `json:"Ingredients"`
	Instructions  string                     `json:"Instructions"`
	IsPublic      bool                       `json:"isPublic"`
	PostTime      int64                      `json:"postTime"`
	Likes         float64                    `json:"likes"`
	TotalCost     float64                    `json:"totalCost"`
	Tags          []string                   `json:"tags"`
	Appliances    map[string]bool            `json:"Appliances"`
	Nutrients     map[string]float64         `json:"nutrients"`
	CostBreakdown []map[string]interface{}   `json:"CostBreakdown"`
}

//----------------------------------------------------------------------------------

// HELPER FUNCTIONS

// StoreRecipeInDB is a helper function that stores a recipe in the database
func StoreRecipeInDB(recipe Recipe) error {
	ingredientsJSONB, err := json.Marshal(recipe.Ingredients)
	if err != nil {
		return err
	}
	instructionsJSONB, err := json.Marshal(recipe.Instructions)
	if err != nil {
		return err
	}
	tagsJSONB, err := json.Marshal(recipe.Tags)
	if err != nil {
		return err
	}
	appliancesJSONB, err := json.Marshal(recipe.Appliances)
	if err != nil {
		return err
	}
	nutrientsJSONB, err := json.Marshal(recipe.Nutrients)
	if err != nil {
		return err
	}
	costBreakdownJSONB, err := json.Marshal(recipe.CostBreakdown)
	if err != nil {
		return err
	}

	_, err = utils.PrepareAndExecute(db, `
		INSERT INTO recipes (
			user_id, username, title, image, description, ingredients, instructions,
			is_public, post_time, likes, total_cost, tags, appliances, nutrients, cost_breakdown
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15
		)`,
		recipe.UserID, recipe.Username, recipe.Title, recipe.Image, recipe.Description,
		ingredientsJSONB, instructionsJSONB, recipe.IsPublic, recipe.PostTime,
		recipe.Likes, recipe.TotalCost, tagsJSONB, appliancesJSONB,
		nutrientsJSONB, costBreakdownJSONB,
	)
	return err
}

// GetRecipesFromDB is a helper function that retrieves recipes from the database
func GetRecipesFromDB(query string, args ...interface{}) ([]Recipe, error) {
    rows, err := utils.PrepareAndExecute(db, query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

	// Scan the rows and store the data in a slice of recipes
    var recipes []Recipe
    for rows.Next() {
        var recipe Recipe
        var tagsJSON, nutrientsJSON, costBreakdownJSON []byte

        err := rows.Scan(
            &recipe.ID, &recipe.UserID, &recipe.Username, &recipe.Title, &recipe.Image, &recipe.Description,
            &recipe.IsPublic, &recipe.PostTime, &recipe.Likes, &recipe.TotalCost,
            &tagsJSON, &nutrientsJSON, &costBreakdownJSON,
        )
        if err != nil {
            return nil, err
        }

        err = json.Unmarshal(tagsJSON, &recipe.Tags)
        if err != nil {
            return nil, err
        }
        err = json.Unmarshal(nutrientsJSON, &recipe.Nutrients)
        if err != nil {
            return nil, err
        }
        err = json.Unmarshal(costBreakdownJSON, &recipe.CostBreakdown)
        if err != nil {
            return nil, err
        }

        recipes = append(recipes, recipe)
    }

	// Check for errors after iterating through the rows
    if err := rows.Err(); err != nil {
        return nil, err
    }

    return recipes, nil
}

//----------------------------------------------------------------------------------

// HANDLER FUNCTIONS

// Endpoint: /recipe/post (POST)
// Inserts recipe into database
func PostRecipe(c *gin.Context) {
    var recipe Recipe

    if err := c.BindJSON(&recipe); err != nil {
        utils.RespondWithError(c, http.StatusBadRequest, err.Error())
        return
    }

    recipe.PostTime = time.Now().Unix()
    err := StoreRecipeInDB(recipe)
    if err != nil {
        utils.RespondWithError(c, http.StatusInternalServerError, "Failed to store the recipe in the database")
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Recipe successfully posted"})
}

// Endpoint: /recipe/explore (GET)
// Retrieves all public recipes from the database
func ExploreRecipes(c *gin.Context) {
    recipes, err := GetRecipesFromDB(`
        SELECT id, user_id, username, title, image, description, is_public, post_time, likes, total_cost, tags, nutrients, cost_breakdown
        FROM recipes
        WHERE is_public = true
    `)
    if err != nil {
        utils.RespondWithError(c, http.StatusInternalServerError, "Failed to retrieve recipes from the database")
        return
    }

    c.JSON(http.StatusOK, recipes)
}

// Endpoint: /recipe/:id/dashboard (GET)
// Retrieves all recipes from the database that belong to a user
func GetRecipeByUser(c *gin.Context) {
    userIDStr := c.Param("id")
    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    recipes, err := GetRecipesFromDB(`
        SELECT id, user_id, username, title, image, description, is_public, post_time, likes, total_cost, tags, nutrients, cost_breakdown
        FROM recipes
        WHERE user_id = $1
    `, userID)
    if err != nil {
        utils.RespondWithError(c, http.StatusInternalServerError, "Failed to retrieve dashboard recipes from the database")
        return
    }

    c.JSON(http.StatusOK, recipes)
}

// Endpoint: /recipe/:id (GET)
// Retrieves a recipe from the database given a recipe ID
func GetRecipeByID(c *gin.Context) {
    recipeIDStr := c.Param("id")
    recipeID, err := strconv.Atoi(recipeIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid recipe ID"})
        return
    }

    row := db.QueryRow(`
        SELECT id, user_id, username, title, image, description, ingredients, instructions,
            is_public, post_time, likes, total_cost, tags, appliances, nutrients, cost_breakdown
        FROM recipes
        WHERE id = $1
    `, recipeID)

    var recipe Recipe
    var tagsJSON, nutrientsJSON, costBreakdownJSON, appliancesJSON []byte

    err = row.Scan(
        &recipe.ID, &recipe.UserID, &recipe.Username,
        &recipe.Title, &recipe.Image, &recipe.Description,
        &recipe.Ingredients, &recipe.Instructions, &recipe.IsPublic, &recipe.PostTime,
        &recipe.Likes, &recipe.TotalCost, &tagsJSON, &appliancesJSON,
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

// Endpoint: /recipe/:id/likes (PUT)
// Updates the number of likes for a recipe
func UpdateLikes(c *gin.Context) {
	recipeIDStr := c.Param("id")
	recipeID, err := strconv.Atoi(recipeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid recipe ID"})
		return
	}

	_, err = db.Exec(`
		UPDATE recipes
		SET likes = likes + 1
		WHERE id = $1
	`, recipeID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update likes in the database"})
		return
	}

	c.Status(http.StatusOK)
}

// Endpoint: /recipe/most_liked (GET)
// Retrieves the most liked recipe from the database
func MostLikedRecipe(c *gin.Context) {
    row := db.QueryRow(`
        SELECT id, title, image
        FROM recipes
        ORDER BY likes DESC
        LIMIT 1
    `)

    var recipe Recipe

    err := row.Scan(
        &recipe.ID, &recipe.Title, &recipe.Image,
    )
    if err != nil {
        utils.RespondWithError(c, http.StatusInternalServerError, "Failed to retrieve most liked recipe from the database")
        return
    }

    c.JSON(http.StatusOK, recipe)
}

//----------------------------------------------------------------------------------