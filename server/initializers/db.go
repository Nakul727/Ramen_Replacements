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

	// return pointer to the database
	return db, nil
}