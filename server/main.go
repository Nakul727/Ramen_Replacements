package main

import (
	"net/http"
	"database/sql"
	"log"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors" 
	"github.com/joho/godotenv"

	"server/api"
	"server/initializers"
)

var db *sql.DB

func main() {
	
	// gin.Default creates a default router
	r := gin.Default()

	// enable .env files reading
	err := godotenv.Load()
	if err != nil {
	  log.Fatal("Error loading .env file")
	}

	// connect to the server
	db, err := initializers.InitDB()
	if err != nil {
        log.Fatal(err)
    }
	defer db.Close()

	// Enable CORS - allowing all ports
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	r.Use(cors.New(config))

	// r.GET gets data from the specified URL/endpoint
	// testing endpoints
	r.GET("/helloworld", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello world!")
	})

	// run handlers
	api.RunAccounts(r, db)
	api.RunRecipes(r, db)

	// r.Run runs default router r on port 8080
	// Example: open localhost:8080/helloworld for helloworld endpoint
	r.Run(":8080")
}