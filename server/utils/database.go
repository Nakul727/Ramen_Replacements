package utils

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func InitDB() (*sql.DB, error) {

	// make sure environment variables can be loaded
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env variables")
	}

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

	// return pointer to the database
	return db, nil
}
