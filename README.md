# calendar-node

Calendar backend project for written in nodejs. Model works for an ios app.

## Scope
The project provides CRUD operation for and event (calendar) based on specs. The repository is PostgreSQL.
There are Unit tests for all endpoints. All the response are in the format:
{success: {boolean}, error: {Object}, data: {Object}}
with data having the required information.
Comments are in the calendarModel and calendarRepo files.

### TODOs
* There are no validations related to schema structure required for the APIs. If a field required to save an event
is not sent it will throw a DB error (not very descriptive). If there is an error it thows a 422 HTTP code.
* Authentication.

## Folder structure (most important folders)
-- **bin** start.js file to start the app (npm start) <br />
-- **config** configuration files <br />
-- **domain** For now only index.js used to connect to the DB <br />
-- **logger** winston logger <br />
-- **models** models/business logic <br />
-- **repository** Repo to PostgreSQL <br />
-- **routes** <br />
-- **test** <br />
-- **scripts** Scripts to set up the DB <br />
-- **www** app.js and www.js files. Set up express server, add middleware and run it.

## Integration steps

1) Execute scripts provided in /scripts folder. There might be permission issues depending on the user. Commenting this
line might help:
```
COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
```

2) Make sure the DB has the timezone set to UTC. If using Amazon RDS use this command:
```
 ALTER USER postgres SET timezone='UTC' ;
```
or check these links:
https://stackoverflow.com/questions/11779293/how-to-set-timezone-for-postgres-psql
https://stackoverflow.com/questions/6663765/postgres-default-timezone

3) Add new modules based on package.json file if needed.
4) Attach middleware. Probably the only module needed is **json-inflector**. See app.js lines 39-44.
5) Add endpoints from the routes.js.
6) Add models/calendarModel.js file and repository/calendarRepo.js file. If you have a an existing connection pool
to knex change the reference in calendarRepo.js, otherwise also include domain/index.js.

## Running the tests

```
mocha test/calendarTest.js
```
