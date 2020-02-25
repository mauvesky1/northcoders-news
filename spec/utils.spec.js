const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
  comment_count
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Returns a new empty array when given an empty array", () => {
    const test = [];
    expect(formatDates([])).to.eql(test);
  });
  it("Return a new array of objects ", () => {
    const test = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "suing for damages",
        created_at: 1163852514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: 659276514171
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      },
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ];
    expect(formatDates(test)).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1416140514171)
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171)
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "suing for damages",
        created_at: new Date(1163852514171)
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: new Date(1037708514171)
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: new Date(785420514171)
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: new Date(659276514171)
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: new Date(533132514171)
      },
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: new Date(406988514171)
      }
    ]);

    expect(test).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "suing for damages",
        created_at: 1163852514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: 659276514171
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      },
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ]);
  });
  it("Converts the created_at key into a javascript date object", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "suing for damages",
        created_at: 1163852514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      }
    ];
  });
});

describe("makeRefObj", () => {
  it("Returns an empty object when given an empty array", () => {
    const input = [];
    const output = {};
    expect(makeRefObj(input)).to.eql(output);
  });
  it("Creates a correct key/value pair in the reference object when passed a piece of data", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      }
    ];
    const expected = { "Living in the shadow of a great man": 1 };
    expect(makeRefObj(input)).to.eql(expected);
    expect(input).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      }
    ]);
  });
  it("Creates multiple key/value pairs for each object passed", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
        article_id: 1
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 2
      }
    ];
    const expected = {
      "Eight pug gifs that remind me of mitch": 1,
      "Living in the shadow of a great man": 2
    };
    expect(makeRefObj(input)).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("Returns an empty array when passed an empty array", () => {
    const input = [];
    const sampleRef = {};
    expect(formatComments(input, sampleRef)).to.eql([]);
  });
  it("Correctly formats comments data for a single comment. This involves: created_by key being renamed author, renaming the belongs_to key to article_id", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const sampleRef = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2
    };
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    expect(formatComments(input, sampleRef)).to.eql(output);
  });
});
