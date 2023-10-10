package api

import (
	"database/sql"
	"github.com/gin-gonic/gin"
)

var db *sql.DB


// handler for recipe functions
func RunRecipes(r *gin.Engine, database *sql.DB) {
	r.POST("recipe/post", postRecipe)
	r.GET("recipe/get", getRecipe)
	r.GET("recipe/latest", getRecipesByDate)
	r.GET("recipe/top", getTopRecent)
	db = database
}

// Accounts accepts an argument for a default router
// Pass the used router into the function argument to gain access to all functions below
func RunAccounts(r *gin.Engine, database *sql.DB) {
	r.GET("/acc/user", getUserByName)
	r.GET("/acc/users", getAllUsers)
	r.POST("acc/create", createAccount)
	db = database
}
