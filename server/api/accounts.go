package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// set up account struct with username, profile picture, id number, and password
// This is the parametres that the register function expects
type Account struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	PFP      string `json:"pfp"`
}

// This is the parameters that the login function expects
type LoginStruct struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var maxUsernameLen = 25
var minUsernameLen = 3
var maxPasswordLen = 8
var minPasswordLen = 1

var jwtSecret = []byte("your_secret_key_here")

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// HELPER FUNCTION

func CreateToken(userID int, username string, pfp string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["userID"] = userID
	claims["username"] = username
	claims["pfp"] = pfp

	claims["exp"] = time.Now().Add(time.Hour * 1).Unix() // Token expires in 1 hour

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Registeration

func CreateAccount(c *gin.Context) {
	var acc Account
	err := c.BindJSON(&acc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error with input"})
		return
	}

	if len(acc.Username) > maxUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username too long"})
		return
	} else if len(acc.Password) > maxPasswordLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password too long"})
		return
	} else if len(acc.Username) < minUsernameLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username too short"})
		return
	} else if len(acc.Password) < minPasswordLen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password too short"})
		return
	}

	// Check if username already exists
	res, err := db.Query("SELECT * FROM Users WHERE name=$1", acc.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error: error querying database"})
		return
	}

	// If the user already exists in the database, prompt the user to pick a different name
	for res.Next() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with name already exists"})
		return
	}

	// Check if an account with the associated email already exists
	res, err = db.Query("SELECT * FROM Users WHERE email=$1", acc.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error: error querying database"})
		return
	}

	for res.Next() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with associated email already exists"})
		return
	}

	// Hash the password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(acc.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing the password"})
		return
	}

	// Insert the user into the database with the hashed password
	_, err = db.Exec("INSERT INTO Users (name, email, pass, pfp) VALUES ($1, $2, $3, $4)", acc.Username, acc.Email, hashedPassword, acc.PFP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting into the database"})
		return
	}
	c.String(http.StatusAccepted, "Profile created")
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Login and Authentication
func LoginUser(c *gin.Context) {
	var loginInfo LoginStruct

	// Attempt to bind JSON request data
	if err := c.BindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error with input"})
		fmt.Printf("Error binding JSON: %v\n", err)
		return
	}

	fmt.Printf("Received loginInfo: %+v\n", loginInfo)

	// Query the database for the user, including the userID and pfp
	row := db.QueryRow("SELECT id, name, pass, pfp FROM Users WHERE name = $1", loginInfo.Username)
	var userID int
	var pfp, username, hashedPassword string
	err := row.Scan(&userID, &username, &hashedPassword, &pfp)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed. User not found."})
		fmt.Printf("User not found in the database: %v\n", err)
		return
	}

	// Compare the hashed password with the provided password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(loginInfo.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed. Invalid password."})
		fmt.Printf("Password comparison failed: %v\n", err)
		return
	}

	// Generate a JWT token with the userID
	token, err := CreateToken(userID, username, pfp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		fmt.Printf("Token generation failed: %v\n", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
