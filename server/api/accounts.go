package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"server/utils"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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

// specific struct used explicitly for login. Note that since the password in the account struct is hashed, we need a unique struct for holding login inputs

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
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
	// password hashing before insertion
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Hashing password operation failed"})
		return
	}
	acc.Password = string(hashedPassword)

	// insertion into database as a new user
	_, err = db.Exec("INSERT INTO Users (name, email, pass, pfp) VALUES ($1, $2, $3, $4)", acc.Username, acc.Email, acc.Password, acc.PFP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error inserting into database"})
		return
	}
	c.String(http.StatusAccepted, "Profile created")
}

func VerifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func LoginCheck(username string, password string) (string, error) {
	var err error

	acc := Account{}

	err = db.Model(Account{}).Where("Username = ?", username).Take(&acc).Error

	if err != nil {
		return "", err
	}

	err = VerifyPassword(password, acc.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	token, err := utils.GenerateToken(acc.ID)

	if err != nil {
		return "", err
	}

	return token, nil
}

func LoginAuth(c *gin.Context) {
	var input LoginInput

	/*
		JWT AUTHENTICATION
	*/
	// final error check during binding process.
	// If so, JSON data is invalid and it will respond with a JSON error and a sever error of HTTP 400 (bad request)
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad server request"})
		return
	}

	acc := Account{}

	acc.Username = input.Username
	acc.Password = input.Password

	token, err := LoginCheck(acc.Username, acc.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username or password is incorrect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (acc *Account) PrepareGive() {
	acc.Password = ""
}

func GetUserByID(uid uint) (Account, error) {

	var acc Account

	if err := db.First(&acc, uid).Error; err != nil {
		return acc, errors.New("User not found!")
	}

	acc.PrepareGive()

	return acc, nil

}

func CurrentAcc(c *gin.Context) {

	acc_id, err := utils.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	acc, err := GetUserByID(acc_id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": acc})
}
