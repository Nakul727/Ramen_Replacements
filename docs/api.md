### Backend API Docs

I'll write these properly later :/ -simon

| API | Function | Input/Output |
| --- | --- | --- |
| Account | /acc/user?name | Takes query from URL to determine name. Returns account with name if found in database. |
| Account | /acc/users | Returns an array of all accounts in table. |
| Account | /acc/create | Adds a new account to database if one with the same name doesn't already exist. |