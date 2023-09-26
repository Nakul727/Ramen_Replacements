## Local Development

#### Backend

To launch the Go backend server, run the following command in the **server** directory:
``` go run .```
This will run the server and listen to the port 8080.


The server also requires the existence of a MySQL database on the localhost. To create one run the following commands:
```
mysql -u root -p                       

mysql> create database ramen_replacements;
mysql> USE ramen_replacements;
mysql> CREATE TABLE Users( id INT unsigned NOT NULL AUTO_INCREMENT , name VARCHAR(25) NOT NULL, pfp VARCHAR(150), PRIMARY KEY(ID) );
mysql> GRANT SELECT on *.* TO 'test'@'localhost' WITH GRANT OPTION;
mysql> GRANT INSERT on *.* TO 'test'@'localhost' WITH GRANT OPTION;
```

This will create the following table:

```sql
CREATE TABLE Users (
    id      INT unsigned    NOT NULL AUTO_INCREMENT,
    name    VARCHAR(25)     NOT NULL,
    pfp     VARCHAR(150),   
    PRIMARY KEY(ID) 
);
```


