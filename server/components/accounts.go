package Accounts

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// set up account struct with username, profile picture and id number
type Account struct {
	Username string `json:"Username"`
	PFP      string `json:"pfp"`
	ID       int    `json:"id"`
}

var db *sql.DB
var maxUsernameLen = 25
var maxPFPLen = 250

// helper function for returning profiles as JSON
func jsonProfile(c *gin.Context, res *sql.Rows) {
	found := false
	for res.Next() {
		found = true
		var u, p string
		var i int
		res.Scan(&i, &u, &p)
		c.JSON(http.StatusOK, gin.H{
			"name": u,
			"pfp":  p,
			"id":   i,
		})
	}
	// if no profiles found
	if !found {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no profile exists"})
	}
}

func getUserByName(c *gin.Context) {
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// return found user data
	jsonProfile(c, res)
}

func getAllUsers(c *gin.Context) {
	res, err := db.Query("SELECT * FROM Users")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	jsonProfile(c, res)
}

func createAccount(c *gin.Context) {
	var acc Account
	err := c.BindJSON(&acc)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ensure user has not created a username that is too long
	if len(acc.Username) > maxUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username too long"})
		return
	} else if len(acc.PFP) > maxPFPLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PFP too long"})
		return
	}

	// check if username already exists
	res, err := db.Query("SELECT * FROM Users WHERE name=?", acc.Username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

// Accounts accepts an argument for a default router
// Pass the used router into the function argument to gain access to all functions below
func RunAccounts(r *gin.Engine, database *sql.DB) {
	db = database
	r.GET("/acc/user", getUserByName)
	r.GET("/acc/users", getAllUsers)
	r.POST("acc/create", createAccount)
}
