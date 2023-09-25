package Accounts

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// set up account struct with username, profile picture and id number
type Account struct {
	Username	string 	`json:"Username"`
	PFP			string 	`json:"pfp`
	ID			int 	`json:"id"`
}

func getUserByName(c *gin.Context) {
	name := c.DefaultQuery("name", "NULL")
	// return error if no account name is provided
	if (name == "NULL") {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"no username provided",
		})
		return
	}
	// otherwise return user data
	c.JSON(http.StatusOK, gin.H{
		"name":name,
	})
}

// Accounts accepts an argument for a default router
// Pass the used router into the function argument to gain access to all functions below
func Accounts(r *gin.Default()) {
	r.GET("/acc/user?", getUserByName)
}