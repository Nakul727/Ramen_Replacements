package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// set up account struct with username, profile picture, id number, and password
// password is never returned to the frontend
type Account struct {
	ID       int    `json:"id"`
	Username string `json:"Username"`
	Email    string `json:"Email"`
	Password string `json:"Password"`
	PFP      string `json:"PFP"`
}

var maxUsernameLen = 25
var minUsernameLen = 3
var maxPasswordLen = 8
var minPasswordLen = 1

// HELPER FUNCTION
func jsonProfile(c *gin.Context, res *sql.Rows) error {
	found := false
	for res.Next() {
		found = true
		var u, e, p, pw string
		var i int
		if err := res.Scan(&i, &u, &e, &p, &pw); err != nil {
			return err
		}
		c.JSON(http.StatusOK, gin.H{
			"name":     u,
			"pfp":      p,
			"email":    e,
			"id":       i,
			"password": pw,
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
	res, err := db.Query("SELECT * FROM Users WHERE name=$1", name)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
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
		var u, p, e, pw string
		var i int
		if err := res.Scan(&i, &u, &e, &pw, &p); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		var account Account
		account.Username = u
		account.PFP = p
		account.Email = e
		account.ID = i
		account.Password = pw
		accounts = append(accounts, account)
	}
	c.JSON(http.StatusOK, accounts)
}

func CreateAccount(c *gin.Context) {
	var acc Account
	err := c.BindJSON(&acc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error with input"})
		return
	}

	fmt.Println(acc.Username)
	fmt.Println(acc.Password)

	/*
		The following is a set of hard-imposed rules for restricting correct input for account creation.
		No authentication method is required for creation.
	*/

	// ensure user has not created a username or password that is too long/short
	if len(acc.Username) > maxUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username too long"})
		return
	} else if len(acc.Password) > maxPasswordLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password too long"})
		return
	} else if len(acc.Username) < minUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error:": "Username too short"})
		return
	} else if len(acc.Password) < minPasswordLen {
		c.JSON(http.StatusBadRequest, gin.H{"error:": "Password too short"})
		return
	}

	// check if username already exists
	res, err := db.Query("SELECT * FROM Users WHERE name=$1", acc.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error: error querying database"})
		return
	}

	// if the user already exists in the database, prompt user to pick a different name
	for res.Next() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with name already exists"})
		return
	}

	// check if account with associated email already exists
	res, err = db.Query("SELECT * FROM Users WHERE email=$1", acc.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error: error querying database"})
		return
	}

	for res.Next() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with associated email already exists"})
		return
	}

	// otherwise insert it into database as a new user
	_, err = db.Exec("INSERT INTO Users (name, email, pass, pfp) VALUES ($1, $2, $3, $4)", acc.Username, acc.Email, acc.Password, acc.PFP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error inserting into database"})
		return
	}
	c.String(http.StatusAccepted, "Profile created")
}

func LoginAuth(c *gin.Context) {
	var acc Account

	// final error check during binding process.
	// If so, JSON data is invalid and it will respond with a JSON error and a sever error of HTTP 400 (bad request)

	if err := c.ShouldBindJSON(&acc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	/*
		INSERT JWT AUTHENTICATION HERE (TO BE COMPLETED)
		By default, we will set the success of the authentication to be true temporarily to allow login retrieval
	*/
	authSuccess := true

	// following code retrieves the successful token (profile) if correct, or displays HTTP 400 (bad request) otherwise

	if authSuccess {
		c.JSON(http.StatusOK, gin.H{
			"token": acc.ID, // this is temporary, do not use acc ID as the token
		})
		c.String(http.StatusOK, "profile successfully retrieved")
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid credentials"})
	}
}
