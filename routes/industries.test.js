
const request = require("supertest");

const app = require("../app");
const { createData } = require("../test.app");
const db = require("../db");


beforeEach(createData);

afterAll(async () => {
  await db.end()
})

describe("GET /", function () {

  test("It should respond with array of industries", async function () {
    const response = await request(app).get("/industries");
    expect(response.body).toEqual({
      "industries": [
        {code: "apple", industry: "tech"},
        {code: "ibm", industry: "comp"},
      ]
    });
  })

});

describe("POST /", function () {

    test("It should add industry", async function () {
      const response = await request(app)
          .post("/industries")
          .send({code: "ret", industry: "Retail"});
  
      expect(response.body).toEqual(
          {
            "industry": {
              code: "ret",
              industry: "Retail"
            }
          }
      );
    });
});


describe("POST /", function () {

    test("It should add comp_industry", async function () {
        const response = await request(app)
            .post("/industries/comp_industries")
            .send({comp_code: "apple", ind_code: "tech"});
    
        expect(response.body).toEqual(
            {
            "company": {
                comp_code: "apple",
                ind_code: "tech"
            }
            }
        );
    });
});