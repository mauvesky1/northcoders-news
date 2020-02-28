process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const connection = require("../db/connection");
const chaiSorted = require("sams-chai-sorted");
const app = require("../app");

chai.use(chaiSorted);

after(() => {
  connection.destroy();
});

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });

  it("Returns with a JSON describing all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200);
  });

  describe("/topics", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .delete("/api/topics")
        .expect(405);
    });
    it("GET 200: responds with 200 and all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;

          expect(topics[0]).to.have.keys("slug", "description");
        });
    });
  });
  describe("/users/:username", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .delete("/api/users/1")
        .expect(405);
    });
    it("GETs a user object by its id", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.have.keys("username", "name", "avatar_url");
        });
    });
    it("ERROR: Returns a 404 error if the user is nonexistent", () => {
      return request(app)
        .get("/api/users/doesnotexist1")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing found");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(405);
    });
    it("GETs an article by its id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.keys(
            "article_id",
            "author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("ERROR: Returns a 404 error if the article id is valid but non existent", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing found");
        });
    });
    it("ERROR: Returns a 400 error if the article id is invalid", () => {
      return request(app)
        .get("/api/articles/notanumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
    it("PATCH: updates the votes property of an article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 22 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(122);
          expect(body.article).to.have.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
        });
    });
    it("ERROR:Patches an article that does not exist", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 33 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing Found");
        });
    });
    it("ERROR: Patches an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/notanumber")
        .send({ inc_votes: 44 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("Invalid input");
        });
    });
    it("ERROR: Non-existent inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Missing votes input");
        });
    });
    it("ERROR: Invalid inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "not a number" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
    it("Ignores other keys", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 22, notrelevant: "ssf" })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 122,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .delete("/api/articles/1/comments")
        .expect(405);
    });
    it("POST a comment to the database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "rogersop", body: "This is the body" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "body",
            "created_at"
          );
        });
    });
    it("ERROR: Posts to an article that does not exist", () => {
      return request(app)
        .post("/api/articles/99/comments")
        .send({ username: "rogersop", body: "This is the body" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            "Not Found; either a parameter does not exist or the body is missing a necessary key"
          );
        });
    });
    it("ERROR: Posts to an invalid article_id", () => {
      return request(app)
        .post("/api/articles/notanumber/comments")
        .send({ username: "rogersop", body: "This is the body" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
    it("ERROR: Missing a necessary key", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "This is the body" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Missing a necessary key");
        });
    });
    it("GET: returns with all comments for a specific article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.comments).to.have.length(13);
          expect(body.comments[0]).to.have.keys(
            "author",
            "body",
            "comment_id",
            "created_at",
            "votes"
          );
        });
    });
    it("ERROR: requests comments for an article that does not exist", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article Not Found");
        });
    });
    it("Returns an empty array for an article that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(0);
        });
    });
    it("ERROR: requests comments for an article that does not exist", () => {
      return request(app)
        .get("/api/articles/notanumber/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
    it("Sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("comment_id", {
            descending: true
          });
        });
    });
    it("Order_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?order_by=desc&&sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("comment_id", {
            descending: true
          });
        });
    });
    it("ERROR: invalid sort_by param", () => {
      return request(app)
        .get("/api/articles/1/comments?order_by=desc&&sort_by=notValid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found in database");
        });
    });
    it("Defaults to desc if order_by is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?order_by=notValid")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.sortedBy("created_at", { descending: true });
        });
    });
  });
  describe("/api/articles", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .delete("/api/articles")
        .expect(405);
    });
    it("POST: the database accepts a new article", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "rogersop",
          title: "This IS the note",
          topic: "mitch",
          body: "This is the body",
          created_at: new Date(1471522072389)
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).to.equal(13);
          expect(body.article).to.have.keys(
            "article_id",
            "created_at",
            "votes",
            "topic",
            "body",
            "author",
            "title"
          );
        });
    });
    it("Ignores irrelevant keys when posting an article", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "rogersop",
          title: "This IS the note",
          topic: "mitch",
          body: "This is the body",
          created_at: new Date(1471522072389),
          anotherKey: "Ignored"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.have.keys(
            "article_id",
            "created_at",
            "votes",
            "topic",
            "body",
            "author",
            "title"
          );
        });
    });
    it("ERROR: Returns a 400 error if partial information for an article is posted", () => {
      return request(app)
        .post("/api/articles")
        .expect(400)
        .expect(({ body }) => {
          expect(body.msg).to.equal("Missing information");
        });
    });
    it("GET all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.equal("12");
          expect(body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("Accepts a limit query", () => {
      return request(app)
        .get("/api/articles?limit=3")
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.equal("12");
          expect(body.articles.length).to.equal(3);
        });
    });
    it("Accepts a p query that determines which page is brought up", () => {
      return request(app)
        .get("/api/articles?&&p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
        });
    });
    it("Defaults to page one if no p query is supplied", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).deep.includes({
            article_id: 1,
            title: "Living in the shadow of a great man",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: "13"
          });
        });
    });
    it("Defaults to page one if the p query is not a number", () => {
      return request(app)
        .get("/api/articles?p=notanumber")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(10);
        });
    });
    it("Defaults to a limit of 10 if limit is not a number", () => {
      return request(app)
        .get("/api/articles?limit=notanumber")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(10);
        });
    });
    it("Defaults to a limit of 10 if no limit query is supplied", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(10);
        });
    });
    it("Accepts a sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", { descending: true });
        });
    });

    it("ERROR: 404 not found when sorting by a query that doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=missingColumn")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found in database");
        });
    });
    it("Accepts an order_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&&order_by=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("topic", { ascending: true });
        });
    });
    it("Defaults sort_by created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("Defaults to desc order if order_by is not asc or desc", () => {
      return request(app)
        .get("/api/articles?order_by=thi1s1sn0tr1ght")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("Filters the articles by the username value specified in the query", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.author).to.equal("rogersop");
          });
        });
    });
    it("ERROR: Throws an error if the author selected in the query does not exist", () => {
      return request(app)
        .get("/api/articles?author=notanAuthor")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Nothing found");
        });
    });
    it("Returns an empty array if the author selected does not have any associated articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
    it("Filters the articles by the topics value specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
          });
        });
    });
    it("ERROR: Throws an error if the topic selected in the query does not exist", () => {
      return request(app)
        .get("/api/articles?topic=notATopic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing found");
        });
    });
    it("Returns an empty array if the topic selected does not have any associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
    it("Filters by both author and topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch&&author=rogersop")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
            expect(article.author).to.equal("rogersop");
          });
        });
    });
    it("Returns an empty array if a search is made for a topic and an author that both have no associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper&&author=lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("ERROR: returns 405 if the method is not allowed", () => {
      return request(app)
        .put("/api/comments/comment_id")
        .expect(405);
    });
    it("PATCH: updates the votes property of a comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 22 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "body",
            "created_at"
          );
          expect(body.comment.votes).to.equal(38);
        });
    });
    it("ERROR: Patches an article that does not exist", () => {
      return request(app)
        .patch("/api/comments/99")
        .send({ inc_votes: 22 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing Found");
        });
    });
    it("ERROR: Patches an invalid article_id", () => {
      return request(app)
        .patch("/api/comments/notAnId")
        .send({ inc_votes: 22 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
    it("ERROR: Non-existent inc_votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
          expect(body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "body",
            "created_at",
            "votes"
          );
        });
    });
    it("Ignores other keys in the request body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 22, author: "gg" })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.have.keys(
            "created_at",
            "votes",
            "article_id",
            "body",
            "author",
            "comment_id"
          );
          expect(body.comment.votes).to.equal(38);
        });
    });
    it("DELETE comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("ERROR: 404 comment does not exist", () => {
      return request(app)
        .delete("/api/comment/99")
        .expect(404);
    });
  });
});
