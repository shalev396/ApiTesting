//use "npm test" to run
const request = require("supertest");
//const express = require('express');//not in use
const app = require("../server.js"); // Adjust this path to point to your Express app
//integration test
describe("GET /VPD/:add and /ANP", () => {
  it("/VPD/:add should respond with status code 200", async () => {
    const response = await request(app).get("/VPD/:add");
    expect(response.statusCode).toBe(200);
  });
  it("GET /ANP should respond with status code 200", async () => {
    const response = await request(app).get("/ANP");
    expect(response.statusCode).toBe(200);
  });
});

//unit test
describe("unitTest", () => {
  test("checks if 1 + 2 is equal to 3", () => {
    expect(1 + 2).toBe(3);
  });
});
