package initializers

import (
	"log"
    "os"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func InitDB() (*sql.DB, error) {

	// connect to the server
	dns := os.Getenv("DB_INFO")
	db, err := sql.Open("mysql", dns)
	if err != nil {
		return nil, err
	}

	// ping the server to check status
	if err := db.Ping(); err != nil {
		return nil, err
	}

	// if passed, connection has been establised
	log.Println("Successfully connected to MySQL server")


	// Create the ramen_replacements database and switch to that database
	// SQL Queries used: CREATE DATABASE IF NOT EXISTS __ and USE __ 

	// var DBQuery string
	// var tableDBQuery string

	// DBQuery = "CREATE DATABASE IF NOT EXISTS ramen_replacements"
    // _, err = db.Exec(DBQuery)
    // if err != nil {
    //     return nil, err
    // }

	// DBQuery = "USE ramen_replacements"
	// _, err = db.Exec(DBQuery)
    // if err != nil {
    //     return nil, err
    // }

	// log.Println("Switching to ramen_replacements...")


 	// userCreationQuery := `
    //     CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'test_p';
    //     GRANT CREATE DATABASE ON *.* TO 'test'@'localhost';
    //     GRANT ALL PRIVILEGES ON ramen_replacements.* TO 'test'@'localhost';
    // `
    // _, err = db.Exec(userCreationQuery)
    // if err != nil {
    //     return nil, err
    // }

	// // Automatically create the tables listed in ./docs/developement
	// // make a tableDBQuery and execute it in the database

	// tableDBQuery = `
	// 	CREATE TABLE IF NOT EXISTS Users (
	// 		id      INT unsigned    NOT NULL AUTO_INCREMENT,
	// 		name    VARCHAR(25)     NOT NULL,
	// 		pfp     VARCHAR(150),
	// 		PRIMARY KEY (id)
	// 	)
	// `
	// _, err = db.Exec(tableDBQuery)
    // if err != nil {
    //     return nil, err
    // }

	// return pointer to the database
	return db, nil
}