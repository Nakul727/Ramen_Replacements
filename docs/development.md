## Local Development

### Frontend
```
cd client
npm install     # install frontend dependencies
npm start       # serves the frontend at localhost:3000
```

You also need a `.env` file in the client root directory with the following variables defined:

```
REACT_APP_BACKEND = "http://localhost:8080"
REACT_APP_SPOONACULAR_API_KEY = "xyz"
```

---

### Backend

To launch the Go backend server, run the following command in the **server** directory:
`go run .`
This will automatically run the server and listen on port 8080.




The server also requires the existence of a PostgreSQL database on the localhost. If you have psql (command line manager for postgres; you can use GUI tools like EDB), to create a test user and database for ramen_replacements, run the following commands:
```
psql postgres

CREATE ROLE test WITH LOGIN PASSWORD ’test_p’;

postgres=# CREATE DATABASE ramen_replacements;
postgres=# CREATE ROLE test WITH LOGIN PASSWORD ’test_p’;
postgres=# ALTER ROLE test WITH SUPERUSER;
postgres=# GRANT ALL PRIVILEGES ON SCHEMA public TO test;

postgres=# \c ramen_replacements test;

ramen_replacements=# ...
```

Then paste the following to create the required tables:

```sql
CREATE TABLE Users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(60) NOT NULL,
    email       VARCHAR(60) NOT NULL,
    pass        VARCHAR(60) NOT NULL,
    pfp         VARCHAR(300)
);
```

```sql
CREATE TABLE Recipes (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL,
    username        VARCHAR(255) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    image           VARCHAR(255),
    description     TEXT,
    ingredients     JSONB,
    instructions    JSONB,
    is_public       BOOLEAN,
    post_time       BIGINT,
    likes           DOUBLE PRECISION,
    total_cost      DOUBLE PRECISION,
    tags            JSONB,
    appliances      JSONB,
    nutrients       JSONB,
    cost_breakdown  JSONB
);
```
Use `\q` to exit server and `psql ramen_replacements test` in terminal to reopen server.



You also need a `.env` file in the server root directory with the following variables defined:

```
DB_INFO="user=test password=test_p host=localhost dbname=ramen_replacements port=5432 sslmode=disable"
API_SECRET="secret"
TOKEN_HOUR_LIFESPAN=1
```

---
