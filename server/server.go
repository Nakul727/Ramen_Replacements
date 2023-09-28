package main

import (
	"database/sql"
	"net/http"

	Accounts "rr_backend/server/components"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// gin.Default creates a default router
	r := gin.Default()
	// open database
	db, err := sql.Open("mysql", "test:test_p@tcp(localhost:3306)/ramen_replacements")
	if err != nil {
		panic(err)
	}
	// r.GET gets data from the specified URL/endpoint
	r.GET("/helloworld", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello world!")
	})
	Accounts.RunAccounts(r, db)

	// r.Run runs default router r on port 8080 - open localhost:8080/helloworld
	// in web browser to test
	r.Run(":8080")
}