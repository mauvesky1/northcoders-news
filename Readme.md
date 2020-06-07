# NorthCoders News

This API allows access to articles and comments posted by users and stored in a postgresql database.

## Getting Started

Start off by cloning or downloading this repo.

### Dependencies

- Knex

  Knex is an SQL query builder

- PG

  A non-blocking PostgreSQL client for Node.js.

- Express

  Express is a minimal and flexible Node.js web application framework

### For testing

To run the tests, further prerequisites are required.

- Mocha
- Chai
- Sams-chai-sorted
- Supertest

A local Knex configuration file is also required. This
sits at the top of the project and contains the information necesary for knex to make a connection. This includes whether process.env.NODE_ENV has been set to test or development, the client (pg), the directory for the migrations (./db/migrations) and a connection object containing the database you are trying to connect to, as well as your username and password if you are using linux.

### Endpoints

See the file endpoints.json for more information

#### GET /api

Serves up a json representation of all the available endpoints of the api (endpoints.json)

#### GET /api/topics

Provides a list of all topics.

#### GET /api/articles

Provides a list of all articles

#### POST /api/articles

Adds a new article to the database and serves the user with the newly added article.

#### GET api/users/:username

Returns details about an individual user based on the username given.

#### GET api/articles/:article_id

Provides an invividual article based on the article ID given.

#### PATCH api/articles/:article_id

Updates the number of votes an article has and lets the user see the updated count.

#### GET /api/articles/:article_id/comments

Provides a list of all comments for the given article.

#### POST /api/articles/:article_id/comments

Sends a new comment to the website

#### PATCH /api/comments/:comment_id

Updates the number of votes a comment has and lets the user see the updated count.

#### DELETE /api/comments/:comment_id

Deletes a comment

### Scripts

These tests test the endpoints of the api

## Hosting

The above endpoints can be added on to the url (here) to see how the back end of this project works.

## Built With

- [Visual Studio Code](https://code.visualstudio.com/)

## Authors

See the contribution [graph](https://github.com/mauvesky1/northcoders-news/graphs/contributors?from=2020-02-07&to=2020-03-25&type=c). To see my progress in building this project.

See the list of [contributors](https://github.com/mauvesky1/northcoders-news/graphs/contributors) who constructed this project.

## Acknowledgments

- Thank you to those that created the foundations of this project and also those that created the technology that allowed the addition of functionality to the project.

- Hat tip to Sam for sams-chai-sorted.

- Thank you to my Northcoders mentors, Tom and Foluso.
