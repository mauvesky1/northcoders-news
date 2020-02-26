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
  describe("/topics", () => {
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
    it("GETs an article by its id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.keys(
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
    it("PATCH updates the votes property of an article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 22 })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.keys(
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
        .patch("/api/articles/notanumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST a comment to the database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "rogersop", body: "This is the body" })
        .expect(201);
    });
    it("ERROR: Patches an article that does not exist", () => {
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
    it("ERROR: Patches an invalid article_id", () => {
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
          expect(body.msg).to.equal("Column Not Found in database");
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
    it("GET all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(body.articles[0]);
        });
    });
    it("Accepts a sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("topic", { descending: true });
        });
    });

    it("ERROR: 404 not found when sorting by a query that doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=missingColumn")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Column Not Found in database");
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
    it("Defaults to sort_by title in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("title", { descending: true });
        });
    });
    it("Defaults to desc order if order_by is not asc or desc", () => {
      return request(app)
        .get("/api/articles?order_by=thi1s1sn0tr1ght")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("title", { descending: true });
        });
    });
    it("Filter the articles by the username value specified in the query", () => {
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
  });
});
