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
    describe("GET", () => {
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
  });
});
