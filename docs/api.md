# Backend API Docs

## Accounts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /acc/user | Returns account JSON data with queried name. |
| GET    | /acc/users | Returns an array of JSON data of every profile on record. |
| POST   | /acc/create | Posts new account data to Users table. |
| POST   | /acc/login | Authenticates a user and returns a session token if successful. |

## Recipes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /recipe/post | Posts new recipe to Recipes table in database. |
| GET    | /recipe/explore | Returns an array of JSON data of all recipes. |
| GET    | /recipe/:id/dashboard | Returns a dashboard view of a specific recipe by ID. |
| GET    | /recipe/:id | Returns JSON data of recipe with given ID. |
| PUT    | /recipe/:id/likes | Updates the likes count of a specific recipe by ID. |
| GET    | /recipe/most_liked | Returns the most liked recipe. |