//use "npm run test:integration" to run tests
const request = require("supertest");
const app = require("../server.js");
//integration test
describe("Integration Tests for fakestoreapi.com", () => {
  it("GET /VPD/:add with valid parameters should respond with 200", async () => {
    const response = await request(app).get("/VPD/true?prodId=1&userId=1");
    expect(response.statusCode).toBe(200);
  });

  it("GET /VPD/:add with invalid product ID should return a 404", async () => {
    const response = await request(app).get("/VPD/true?prodId=999999&userId=1");
    expect(response.statusCode).toBe(404);
  });

  it("GET /VPD/:add with valid product but no add flag should return product details", async () => {
    const response = await request(app).get("/VPD/false?prodId=1&userId=1");
    expect(response.body).toHaveProperty("title");
  });

  it("GET /VPD/:add with rating should return rating details", async () => {
    const response = await request(app).get("/VPD/false?prodId=1&userId=1");
    expect(response.body).toHaveProperty("rating");
  });

  it("GET /ANP with valid data should respond with 200", async () => {
    const response = await request(app).get(
      "/ANP?title=Test%20Title&price=100&description=Great%20Product&image=https://i.pravatar.cc&category=electronics"
    );
    expect(response.statusCode).toBe(200);
  });

  it("GET /ANP without providing any query parameters should use defaults", async () => {
    const response = await request(app).get("/ANP");
    expect(response.body.title).toBe("default title");
    expect(response.body.price).toBe("0");
  });

  it("GET /ANP with invalid category should return an error (check category constraints)", async () => {
    const response = await request(app).get("/ANP?category=invalid_category");
    expect(response.statusCode).toBe(400);
  });

  it("GET /VPD/:add without product ID should use default values", async () => {
    const response = await request(app).get("/VPD/false");
    expect(response.body.title).toBeDefined();
  });

  it("GET /VPD/:add without userId should still return the product", async () => {
    const response = await request(app).get("/VPD/false?prodId=2");
    expect(response.body).toHaveProperty("title");
  });
});
