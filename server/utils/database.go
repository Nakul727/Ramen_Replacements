package utils

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {

	// Make sure environment variables can be loaded
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env variables:", err)
	}
	
	// Connect to the server
	dns := os.Getenv("DB_INFO")
	db, err := sql.Open("postgres", dns)
	if err != nil {
		return nil, err
	}

	// Ping the server to check status
	if err := db.Ping(); err != nil {
		return nil, err
	}

	// If the connection has been established successfully
	log.Println("Successfully connected to PostgreSQL server")

	// Return a pointer to the database
	return db, nil
}
