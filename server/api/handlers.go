package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

// handler for user account functions
func RunAccounts(r *gin.Engine, database *sql.DB) {
	r.GET("/acc/user", GetUserByName)
	r.GET("/acc/users", GetAllUsers)
	r.POST("acc/create", CreateAccount)
	r.POST("acc/login", LoginAuth) // NOT YET COMPLETED
	db = database
}

// handler for recipe functions
func RunRecipes(r *gin.Engine, database *sql.DB) {
	r.POST("recipe/post", PostRecipe)
	r.GET("recipe/get", GetRecipe)
	r.GET("recipe/latest", GetRecipesByDate)
	r.GET("recipe/top", GetTopRecent)
	db = database
}
