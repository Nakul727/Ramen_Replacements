package api

import (
	"database/sql"
	"errors"
	"net/http"

	"server/utils"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// STRUCTS

// Account is a struct that represents a user account
type Account struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	PFP      string `json:"pfp"`
}

// LoginStruct is a struct that represents a user login
type LoginStruct struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// HELPER FUNCTIONS

// jsonProfile is a helper function that returns a user profile in JSON format
func jsonProfile(c *gin.Context, res *sql.Rows) error {
	var profiles []gin.H
	found := false

	for res.Next() {
		found = true
		var u, e, p string
		var i int
		if err := res.Scan(&i, &u, &e, &p); err != nil {
			return err
		}
		profiles = append(profiles, gin.H{
			"name":  u,
			"pfp":   p,
			"email": e,
			"id":    i,
		})
	}

	// return error if no user is found
	if !found {
		return errors.New("no user found")
	}

	c.JSON(http.StatusOK, profiles)
	return nil
}

// prepareAndExecute is a helper function that prepares and executes a SQL query
// preparing before querying prevents SQL injections
func prepareAndExecute(query string, args ...interface{}) (*sql.Rows, error) {
    stmt, err := db.Prepare(query)
    if err != nil {
        return nil, err
    }
    res, err := stmt.Query(args...)
    if err != nil {
        return nil, err
    }
    return res, nil
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// HANDLER FUNCTIONS

// Endpoint: /acc/user (GET)
// Returns a user profile given a username
func GetUserByName(c *gin.Context) {
	name := c.Query("name")

	// return error if no account name is provided
	if name == "" {
		utils.RespondWithError(c, http.StatusBadRequest, "No username provided")
		return
	}

	// prepare and execute the query
	res, err := prepareAndExecute("SELECT * FROM Users WHERE name=$1", name)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// return found user data
	err = jsonProfile(c, res)
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, err.Error())
	}
}

// Endpoint: /acc/users (GET)
// Returns all user profiles
func GetAllUsers(c *gin.Context) {
	res, err := prepareAndExecute("SELECT * FROM Users")
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	var accounts []Account
	for res.Next() {
		var u, p, e, pw string
		var i int
		if err := res.Scan(&i, &u, &e, &pw, &p); err != nil {
			utils.RespondWithError(c, http.StatusBadGateway, err.Error())
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
// Endpoint: /acc/create (POST)
// Creates a new user profile
func CreateAccount(c *gin.Context) {
	var acc Account
	err := c.BindJSON(&acc)
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Check if username or email already exists
	res, err := prepareAndExecute("SELECT * FROM Users WHERE username=$1 OR email=$2", acc.Username, acc.Email)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if res.Next() {
		utils.RespondWithError(c, http.StatusBadRequest, "Username or email already exists")
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(acc.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	acc.Password = string(hashedPassword)

	// Insert the new account into the database
	_, err = prepareAndExecute("INSERT INTO Users (username, email, password, pfp) VALUES ($1, $2, $3, $4)", acc.Username, acc.Email, acc.Password, acc.PFP)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Account created successfully"})
}

// Endpoint: /acc/login (POST)
// Logs in and authenticates a user
func LoginUser(c *gin.Context) {
	var loginInfo LoginStruct

	if err := c.BindJSON(&loginInfo); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Error with input")
		return
	}

	row, err := prepareAndExecute("SELECT id, name, pass, pfp FROM Users WHERE name = $1", loginInfo.Username)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if !row.Next() {
		utils.RespondWithError(c, http.StatusUnauthorized, "Authentication failed. User not found.")
		return
	}

	// Get the hashed password from the database
	var userID int
	var pfp, username, hashedPassword string
	err = row.Scan(&userID, &username, &hashedPassword, &pfp)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Compare the stored hashed password, with the hashed version of the password that was received
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(loginInfo.Password))
	if err != nil {
		utils.RespondWithError(c, http.StatusUnauthorized, "Authentication failed. Invalid password.")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(userID, username, pfp)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, "Token generation failed")
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~