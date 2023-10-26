package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"server/api"
	"server/utils"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// connect to the database
	db, err := utils.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Enable CORS - allowing all ports
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	r.Use(cors.New(config))

	// run handlers
	api.LoadDatabase(db)
	api.RunAccounts(r)
	api.RunRecipes(r)

	// runs backend on port 8080
	// development environemt
	r.Run(":8080")
}
