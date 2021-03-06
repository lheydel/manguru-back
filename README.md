# Manguru Backend
[![Build Status](https://travis-ci.org/lheydel/manguru-back.svg?branch=master)](https://travis-ci.org/lheydel/manguru-back) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lheydel_manguru-back&metric=alert_status)](https://sonarcloud.io/dashboard?id=lheydel_manguru-back)

This repository handles the backend of the web platform [Manguru](TODO) ([Github](https://github.com/lheydel/manguru)).\
It provides a RESTful API using NodeJS and Express.

# Table of contents
 - [Pre-reqs](#pre-reqs)
 - [Getting started](#getting-started)
    - [Running in near prod environment](##running-in-near-prod-environment)
    - [Running in dev mode](##running-in-dev-mode)
- [Tools](#tools)
    - [Language and framework](##language-and-framework)
    - [Database management](##database-management)
    - [Tests](##tests)
    - [Continuous integration](##continuous-integration)
    - [Code analysis](##code-analysis)
 - [Development rules](#development-rules)
    - [Basic rules](##basic-rules)
    - [Database migrations](##database-migrations)

# Pre-reqs
To build and run this app locally, you will need a few things:
 - Install [Node.js](https://nodejs.org/en/)
 - Install [Docker](https://docs.docker.com/install/)

> **/!\ Important /!\\** - Be sure to read the [Development rules](#development-rules) part before doing any update on the project resources!

# Getting started
> **Note** - To run the tests, please refer to the [associated](##tests) part.

Please ensure that Docker is running on your computer before doing anything.
 
## Running in dev mode
 - Clone the repository
```
git clone --depth=1 https://github.com/lheydel/manguru-back.git manguru-back
```
 - Install dependencies
```
cd manguru-back
npm install
```
 - Build and run the project
```
docker-compose up -d --build
```
 - Stop the project
```
docker-compose down
```

---
When the app is running, you can try making requests to `http://localhost:8080` with tools like [Postman](https://www.getpostman.com/), or directly using the [Frontend](https://github.com/lheydel/manguru-front) part of the app.

You can also access your local database via http://localhost:29018 with tools like [Robo 3T](https://robomongo.org/download) for example.

> **Note** - In dev mode, the app is refreshing itself each time a typescript source file is updated, so you don't need to go through those steps again and again.

# Tools
This part is mainly informative and quickly describes the main tools and technologies used in this project.

## Language and framework
As the goal of manguru-back is to provide a server-side stateless RESTful API, it uses [NodeJS](https://nodejs.org/en/about/), with the [Express](https://expressjs.com/fr/) framework to simplify the management of the coming HTTP requests.

Also, for a better code structure and development efficiency, [Typescript](https://www.typescriptlang.org/) is installed and configured for all the parts of the project.

## Database management
This project connects to a document oriented database managed by [MongoDB](https://www.mongodb.com/fr), known for its high flexibility and adaptability.

Also, to facilitate the interaction with this database, [MikroORM](https://b4nan.github.io/mikro-orm/) is used as a middleware between NodeJS and MongoDB. It provides an API to interact with the data within the database based on the definition of the entities of the project.

> **Note** - When the app is running on your machine, you can access the associated MongoDB instance on `http://localhost:27018`.

## Tests
The test runner used in this project is called [Jest](https://jestjs.io/). It manages unit, integration and end-to-end tests and works well with asynchroneous operations.

> /!\ Important - The tests use your local database at http://localhost:27017. Make sure to have a MongoDB instance running.

## Code analysis
To improve and maintain the global quality of the source code, this project uses a static code analysis tool named [Sonarqube](https://www.sonarqube.org/), which scan the project and detect code smells and security issues. It also get the test coverage stats from Jest.

## Continuous integration
This project is configured to trigger a build on [Travis CI](https://travis-ci.org/) each time a push is done on this Github repository. 

Each Travis build runs the test suite with Jest and scan the project with Sonarqube.

Also, for some branches, it builds a Docker image and push it on a private Docker repository. This image will then be used as part of the deployment of the entire platform.

# Development rules
Here are the rules you must follow if you want to make any code change on this project. Any modification that does not respect those rules will be rejected.

## Basic rules
In order to maintain a good overall quality, every update must be supported by relevant tests and have a good evaluation on Sonarqube.\
Also, please respect the general structure of the project to avoid any confusion.

## Database migrations
[As said before](##database-management), the link between NodeJS and MongoDB is done by the middleware called MikroORM. It provides an API to access the database. Both the API and the database are built and updated from the project entities declarations.

MikroORM make managing and accessing the data much easier, but has an important drawback which must be taken care of before starting a project. Indeed, whenever you want to change the structure of the database, you have to manage the migration of the data all by yourself, either by doing it manually, or by including a dedicated service in your code base. MikroORM does not provide any script management for this task (at least at the time this was written).

As it is annoying to do it manually, a solution has been setup in the project to make our life easier. This solution is based on the concept of **Version Struct**.

> **Note** - To illustrate the concepts described below, you can check the migration of the entity `User` from VS 1 to VS 2. The migration in itself doesn't have much interest since it was used as an example during the reflection behind this solution. You can see the details of the changes at `/src/user/user.migrations.ts > _fromVs1To2()`

> **Give to Caesar what belongs to Caesar** - I did not come up with this solution all by myself. It is inspired from a similar situation I encountered in an internship at [Atheris Services](https://atheris.eu/) in 2018.

### Version Struct
A Version Struct (or VS) merely designate the version of the structure of an entity. Each and every entity stored in the database must have a property called `vs`, which indicate its version number.

To update and access the latest VS available for an entity, refer to the enum `VersionStruct` in the file `/src/common/properties.ts`.

> **Example** - If you want to change the structure of the entity User for the first time, you will update the value of `VersionStruct.USER` from `1` to `2`.

### Entity and Datamodel
First things first, if you want to update an entity in the database, you will have to update the entity model.

There are roughly three case scenarios when updating an entity. You can either **add**, **remove** or **edit** one or more properties.

#### Adding a new property
To create a new property, there is no special action to do beside adding it to the model with the annotation `@Property()`. 

Example:
```Typescript
@Property()
username: string;
```

If the new property depends on other data of the entity, please refer to [Data migrations](###data-migrations).

#### Removing a property
Removing a property is a delicate operation, as it causes a loss of data, which can't be migrated afterwards to another location since they don't exist anymore. As such, removing a property is prohibited.

Instead, you can use the `@deprecated` annotation to signal the deprecation of a property. This annotation can be used in the JSdoc of the property in the entity model. Also, dont forget to make this property optional.

> **Note** - When you deprecate an attribute, please indicate the date (with the format `YYYY/MM/DD`) and VS of deprecation.

> **Example** - Let's say you have an entity `User` and you want to remove its `name` property:
>```Typescript
>/** @deprecated 2019/07/05 - vs2 */
>name?: string; 
>```
> With this annotation, we can know that `name` has been deprecated since the VS 2, at the date 2019/07/05.

#### Editing a property
Editing a property can mean many things. You can rename it, split it in multiple other properties, assemble several properties into one, etc..

However, all thoses operations are just a succession of adding and removing properties. Thus, you can do it by following the two previous parts. Just remember to write the details of the updates in the comments of the `@deprecated` annotations and to [migrate](###data-migrations) your data.

> **Example** - Let's say you have an entity `User` and you want to rename its `name` property into `username`.\
>Entity model:
>```Typescript
>/** @deprecated 2019/07/05 - vs2 - use [username] property instead */
>name?: string; 
>```

### Data migrations
Changing the data structure obviously doesn't mean the data will adapt themselves by using some weird magic. We need some **migrator** services to upgrade them to the new strucure.

#### Migrator
A migrator is a service dedicated to the migrations of a single entity. It implements the interface `BaseMigrator` which provides a set of standard functions.

For each new VS, a function `_fromVsXToY()` must be created. This function gives the actual instructions to migrate the data of an entity type from the VS X to the VS Y (with Y = X + 1). This function is then called in `upgradeVersionStruct()` which take an entity as parameter.

> **Note** - Each migrator must have the mention `// tslint:disable: deprecation no-switch-case-fall-through` on top of the file to be able to use the deprecated properties and perform smooth migrations.

The migrators are then used by the `MigrationManager` defined in `/src/migrations.ts`, which is called at the start of the application.
