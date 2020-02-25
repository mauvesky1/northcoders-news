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
    it("Returns a 404 error if the user enters an incorrect datatype", () => {
      return request(app)
        .get("/api/users/1")
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
        .expect(200);
    });
    it("Returns a 404 error if the article id is valid but non existent", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Nothing found");
        });
    });
    it("Returns a 400 error if the article id is invalid", () => {
      return request(app)
        .get("/api/articles/notanumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input");
        });
    });
  });
});
