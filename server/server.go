package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// gin.Default creates a default router
	r := gin.Default()

	// r.GET gets data from the specified URL/endpoint
	r.GET("/helloworld", func(c *gin.Context){
		c.String(http.StatusOK, "Hello world!")
	})

	// r.Run runs default router r on port 8080 - open localhost:8080/helloworld 
	// in web browser to test
	r.Run(":8080")
}
