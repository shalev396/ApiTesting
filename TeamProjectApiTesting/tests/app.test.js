//use "node test" to run
const request = require("supertest");
//const express = require('express');//not in use
const app = require("../server.js"); // Adjust this path to point to your Express app
//integration test
describe("GET /data/auth", () => {
  it("should respond with status code 200", async () => {
    const response = await request(app).get("/data/auth");
    expect(response.statusCode).toBe(200);
  });
});

//unit test
describe("unitTest", () => {
  test("checks if 1 + 2 is equal to 3", () => {
    expect(1 + 2).toBe(3);
  });
});
