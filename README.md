# calendar-node

Calendar backend project for written in nodejs. Model works for an ios app.

## Scope
The project provides CRUD operation for and event (calendar) based on specs. The repository is a PostgreSQL.
There are Unit tests for all endpoints.

### TODOs
* There are no validations related to schema structure required for the APIs. If a field required to save an event
is not sent it will throw a DB error (not very descriptive). If there is an error it thows a 422 HTTP code.
* Authentication needs to be done when doing the integration.


## Folder structure (most important folders)
-- **bin** start.js file to start the app (npm start)
-- **config** configuration files
-- **domain** For now only index.js used to connect to the DB
-- **logger** winston logger
-- **models** models/business logic
-- **repository** Repo to PostgreSQL
-- **routes**
-- **test**
-- **scripts** Scripts to set up the DB
-- **www** app.js and www.js files. Set up express server, add middleware and run it.

## Integration steps

1) Execute scripts provided in /scripts folder
2) Add new modules based on package.json file if needed.
3) Attach middleware. Probably the only module needed is **json-inflector**. See app.js lines 39-44.
4) Add endpoints from the routes.js.
5) Add models/calendarModel.js file and repository/calendarRepo.js file. If you have a an existing connection pool
to knex change the reference in calendarRepo.js, otherwise also include domain/index.js.

## Running the tests

```
mocha test/calendarTest.js
```
