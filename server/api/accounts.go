package api

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// set up account struct with username, profile picture and id number
type Account struct {
	Username string `json:"Username" binding:"required"`
	PFP      string `json:"pfp" binding:"required"`
	ID       int    `json:"id"`
}

var maxUsernameLen = 25
var maxPFPLen = 250
var minUsernameLen = 3

// HELPER FUNCTION
func jsonProfile(c *gin.Context, res *sql.Rows) error {
	found := false
	for res.Next() {
		found = true
		var u, p string
		var i int
		if err := res.Scan(&i, &u, &p); err != nil {
			return err
		}
		c.JSON(http.StatusOK, gin.H{
			"name": u,
			"pfp":  p,
			"id":   i,
		})
	}
	// if no profiles found
	if !found {
		return errors.New("no user found")
	}
	return nil
}

// HANDLER FUNCTION
func GetUserByName(c *gin.Context) {
	name := c.DefaultQuery("name", "NULL")
	// return error if no account name is provided
	if name == "NULL" || name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "no username provided",
		})
		return
	}

	// query database for given name
	res, err := db.Query("SELECT * FROM Users WHERE name=?", name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// return found user data
	err = jsonProfile(c, res)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}
}

func GetAllUsers(c *gin.Context) {
	res, err := db.Query("SELECT * FROM Users")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var accounts []Account
	for res.Next() {
		var u, p string
		var i int
		if err := res.Scan(&i, &u, &p); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		var account Account
		account.Username = u
		account.PFP = p
		account.ID = i
		accounts = append(accounts, account)
	}
	c.JSON(http.StatusOK, accounts)
}

func CreateAccount(c *gin.Context) {
	var acc Account
	err := c.BindJSON(&acc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ensure user has not created a username that is too long
	if len(acc.Username) > maxUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username too long"})
		return
	} else if len(acc.PFP) > maxPFPLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PFP too long"})
		return
	} else if len(acc.Username) < minUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error:": "Username too short"})
		return
	}

	// check if username already exists
	res, err := db.Query("SELECT * FROM Users WHERE name=?", acc.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// if the user already exists in the database, prompt user to pick a different name
	for res.Next() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with name already exists"})
		return
	}

	// otherwise insert it into database as a new user
	_, err = db.Exec("INSERT INTO Users (name, pfp) VALUES (?, ?);", acc.Username, acc.PFP)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	c.String(http.StatusAccepted, "profile created")
}

func LoginAuth(c *gin.Context) {
	var acc Account

	// check for error during binding process. If so, JSON data is invalid and it will respond with a JSON error and a sever error of HTTP 400 (bad request)

	if err := c.ShouldBindJSON(&acc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}
