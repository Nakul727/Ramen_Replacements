## Local Development

### Frontend
`cd client`
Run `npm install` to install dependencies and node_modules.\
Run `npm start` to serve the website on http://localhost:3000.
</br>

### Backend

To launch the Go backend server, run the following command in the **server** directory:
`go run .`
This will run the server and listen to the port 8080.


The server also requires the existence of a PostgreSQL database on the localhost. To create a test user and database for ramen_replacements at local host, run the following commands:
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
    name        VARCHAR(25) NOT NULL,
    email       VARCHAR(50) NOT NULL,
    pass        VARCHAR(8) NOT NULL,
    pfp         VARCHAR(150)
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