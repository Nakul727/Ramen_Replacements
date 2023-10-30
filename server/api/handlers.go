package api

import (
	"database/sql"

	"server/api/middlewares"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func LoadDatabase(database *sql.DB) {
	db = database
}

// handler for user account functions
func RunAccounts(r *gin.Engine) {
	r.GET("/acc/user", GetUserByName)
	r.GET("/acc/users", GetAllUsers)
	r.POST("acc/create", CreateAccount)
	r.POST("acc/login", LoginAuth)
	r.Use(middlewares.JwtAuthMiddleware())
	r.GET("/acc/curruser", CurrentUser)
}

// handler for recipe functions
func RunRecipes(r *gin.Engine) {
	r.POST("recipe/post", PostRecipe)
	r.GET("recipe/get", GetRecipe)
	r.GET("recipe/latest", GetRecipesByDate)
	r.GET("recipe/top", GetTopRecent)
}
