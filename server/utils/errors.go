package utils

import (
    "github.com/gin-gonic/gin"
)

// http.StatusOK       				// 200
// http.StatusBadRequest 			// 400
// http.StatusNotFound 				// 404
// http.StatusInternalServerError 	// 500

func RespondWithError(c *gin.Context, status int, message string) {
    c.JSON(status, gin.H{"error": message})
    c.Abort()
}