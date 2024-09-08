//use "npm run test:unit" to ruun the tests
const axios = require("axios");
const request = require("supertest");
const app = require("../server.js");
jest.mock("axios"); //used jest docs for any mock function https://jestjs.io/docs/mock-functions
//unit test
//used mockResolvedValue/mockRejectedValue to simulate the successful/unsuccessful resolution of that request
describe("Unit Tests for localhost:3000/", () => {
  //from https://jestjs.io/docs
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
  });

  it("GET /VPD/:add should make a call to the product API", async () => {
    axios.get.mockResolvedValue({ data: { title: "Test Product", price: 20 } });
    const response = await request(app).get("/VPD/false?prodId=1&userId=1");
    expect(axios.get).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products/1"
    );
    expect(response.body.name).toBe("Test Product");
  });

  it("GET /VPD/:add should handle 'add=true' with a PUT request", async () => {
    axios.get.mockResolvedValue({ data: { title: "Test Product" } });
    axios.put.mockResolvedValue({ data: { message: "Item added to cart" } });
    const response = await request(app).get("/VPD/true?prodId=1&userId=1");
    expect(axios.put).toHaveBeenCalledWith(
      "https://fakestoreapi.com/carts/1",
      expect.any(Object),
      expect.any(Object)
    );
    expect(response.body.message).toBe("Item added to cart");
  });

  it("GET /ANP should send POST request to get categorys", async () => {
    axios.post.mockResolvedValue({
      data: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
    const response = await request(app).get(
      "/ANP?title=New%20Product&price=100&description=Great%20Product&image=https://i.pravatar.cc&category=electronics"
    );
    expect(axios.get).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products/categories"
    );
  });

  it("GET /VPD/:add should return product details without adding to cart", async () => {
    axios.get.mockResolvedValue({
      data: { title: "Product No Cart", price: 50 },
    });
    const response = await request(app).get("/VPD/false?prodId=1");
    expect(response.body.price).toBe(50);
  });

  it("GET /VPD/:add should return rating if available", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Rated Product",
        rating: { rate: 4.5 },
      },
    });
    const response = await request(app).get("/VPD/false?prodId=1");
    expect(response.body.rating.rate).toBe(4.5);
  });

  it("GET /VPD/:add should handle missing rating gracefully", async () => {
    axios.get.mockResolvedValue({
      data: { title: "Unrated Product" },
    });
    const response = await request(app).get("/VPD/false?prodId=1");
    expect(response.body).not.toHaveProperty("rating");
  });
  //used stuck overflow for trouble shooting
  it("GET /VPD/:add should handle invalid product ID with error", async () => {
    axios.get.mockRejectedValue(new Error("Product not found"));
    const response = await request(app).get("/VPD/false?prodId=9999");
    expect(response.statusCode).toBe(500);
  });
  //used stuck overflow for trouble shooting
  it("GET /VPD/:add should handle API failure", async () => {
    axios.get.mockRejectedValue(new Error("Fake Store API failed"));
    const response = await request(app).get("/VPD/false?prodId=1");
    expect(response.statusCode).toBe(500);
  });
});
