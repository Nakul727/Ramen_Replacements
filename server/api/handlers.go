package api

import (
	"database/sql"
	"github.com/gin-gonic/gin"
)

var db *sql.DB

func LoadDatabase(database *sql.DB) {
	db = database
}

func RunAPI(r *gin.Engine) {
	RunAccounts(r)
	RunRecipes(r)
}

// handler for user account functions
func RunAccounts(r *gin.Engine) {
	r.GET("/acc/user", GetUserByName)
	r.GET("/acc/users", GetAllUsers)
	r.POST("acc/create", CreateAccount)
	r.POST("acc/login", LoginUser)
}

// handler for recipe functions
func RunRecipes(r *gin.Engine) {
	r.POST("/recipe/post", PostRecipe)
	r.GET("/recipe/explore", ExploreRecipes)
	r.GET("/recipe/:id/dashboard", GetRecipeByUser)
	r.GET("/recipe/:id", GetRecipeByID)
	r.PUT("/recipe/:id/likes", UpdateLikes)
	r.GET("/recipe/most_liked", MostLikedRecipe)
}
