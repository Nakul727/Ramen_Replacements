package middlewares

import (
	"net/http"

	"server/utils"

	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := utils.TokenValid(c)
		if err != nil {
			c.String(http.StatusUnauthorized, "Unauthorized access")
			c.Abort()
			return
		}
		c.Next()
	}
}