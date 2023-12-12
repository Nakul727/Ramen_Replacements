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
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Successfully connected to PostgreSQL server")
	return db, nil
}

// prepareAndExecute is a helper function that prepares and executes a SQL query
// preparing before querying prevents SQL injections
func PrepareAndExecute(db *sql.DB, query string, args ...interface{}) (*sql.Rows, error) {
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