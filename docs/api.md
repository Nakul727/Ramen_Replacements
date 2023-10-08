# Backend API Docs

# Accounts
The accounts interface is used to create and access user profile data.
### GET
#### getUserByName - returns account JSON data with queried name. 
Endpoint: /acc/user?name
Results
| Status | Result |
| --- | --- |
| 200 OK | An account has been found with the given name. Returns the JSON data of account. |
| 400 BadRequest | There is a problem with the queried data. No account was found or no name was provided. |
| 500 InternalServerError | There was a problem querying from the database. |
##### Example output: GET /acc/user?name=Simon 
```
{
    "id": 1,
    "username": "Simon",
    "profile_picture": "url/to/profile_picture.jpg"
}
```

#### getUsers - returns an array of JSON data of every profile on record
Endpoint: /acc/users/
Results
| Status | Result |
|---|---|
| 200 OK | Returns the JSON data of all accounts sorted by account ID ascending. |
| 500 InternalServerError | There was a problem querying the accounts from the database. |
#### Example output: GET /acc/users/
```
[
  {
    "Username": "Simon",
    "pfp": "https://random.dog/244ed23b-e0d8-44ce-be2c-552fc777d1ae.jpg",
    "id": 1
  },
  {
    "Username": "Alex",
    "pfp": "https://random.dog/6dcc9bd5-8b93-4a18-ac78-c5edac17622b.jpg",
    "id": 5
  },
  ...
]
```

### POST
#### createAccount - posts new account data to Users table
Endpoint: /acc/create
Results
| Status | Result |
| --- | --- |
| 202 Accepted | A new account has been successfully added to the database. |
| 400 BadRequest | There is an issue with the input - the username is too short, password too long, etc. | 
| 500 InternalServerError | There was an issue adding the new user to the database. | 

# Recipes
## GET
The recipes interface is used to access all posted recipes.
#### getRecipe - returns JSON data of recipe with given ID
Endpoint: /recipe/get?id
Results
| Status | Result |
|---|---|
| 200 OK | A recipe with given ID was found, returns JSON data associated with it |
| 400 BadRequest | No recipe was found with given ID or no ID was given |
| 500 InternalServerError | There was a problem querying the database. | 
#### Example output: GET /recipe/get?id=1
```
UserID	1
Rating	5
Title	"Protein mac and cheese"
Description	"Delicious high protein mac and cheese!"
Steps	"(steps to prepare)"
Ingredients	"1. Elbow pasta 2. Cheddar cheese 3. ..."
Picture	"https://www.google.com/url?sa=i&url=https%3A%2F%2Fsugarspunrun.com%2Feasy-macaroni-cheese-no-flour-no-roux%2F&psig=AOvVaw3QkN4KFoIGxwoe3B1_6sgn&ust=1696890613244000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIDo7qPA54EDFQAAAAAdAAAAABAE"
Appliances	1
Date	1696640408
```

#### getRecipesByDate - returns n most recent posted recipes or 100 by default
Endpoint: /recipe/latest?n
| Status | Result |
|---|---|
| 200 OK | Returned n most recent recipes in JSON array |
| 400 BadRequest | There was a problem with the input given |
| 500 InternalServerError | There was a problem querying the database. | 
#### Example output: GET /recipe/latest?n=200
```
[
  {
    UserID	1
    Rating	5
    Title	"Protein mac and cheese"
    Description	"Delicious high protein mac and cheese!"
    Steps	"(steps to prepare)"
    Ingredients	"1. Elbow pasta 2. Cheddar cheese 3. ..."
    Picture	"https://www.google.com/url?sa=i&url=https%3A%2F%2Fsugarspunrun.com%2Feasy-macaroni-cheese-no-flour-no-roux%2F&psig=AOvVaw3QkN4KFoIGxwoe3B1_6sgn&ust=1696890613244000&source=images&cd=vfe&opi=89978449&ved        =0CBEQjRxqFwoTCIDo7qPA54EDFQAAAAAdAAAAABAE"
    Appliances	1
    Date	1696640408
  },
  (next 199 recipes)
]
```

#### getTopRecent - returns JSON array of recipes with highest rating in given time range
Endpoint: /recipe/top?range
| Status | Result |
|---|---|
| 200 OK | Returned top recipes in given range |
| 400 BadRequest | There was a problem with the input given |
| 500 InternalServerError | There was a problem querying the database. | 
#### Examples:
| Ranges | Endpoint |
| --- | --- |
| Default (24 hours) | /recipe/top?range |
| 24 hours | /recipe/top?range=day | 
| 7 days | /recipe/top?range=week |
| 1 month | /recipe/top?range=month |
| 1 year | /recipe/top?range=year |

## POST 
#### postRecipe - posts new recipe to Recipes table in database
Endpoint: /recipe/post
| Status | Result |
|---|---|
| 202 Accepted | The recipe has successfully been posted. |
| 400 BadRequest | There was a problem with the recipe input. Likely a field is missing or invalid. |
| 500 InternalServerError | There was an issue internally adding the recipe to the database. |