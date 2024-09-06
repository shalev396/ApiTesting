//use "npm test" to run tests
const axios = require("axios");
const request = require("supertest");
const app = require("../server.js");
jest.mock("axios"); //used jest docs for any mock function https://jestjs.io/docs/mock-functions
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
    expect(response.body).toHaveProperty("name");
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
  //unfinished
  it("GET /ANP with invalid category should return an error (check category constraints)", async () => {
    const response = await request(app).get("/ANP?category=invalid_category");
    expect(response.statusCode).toBe(400);
  });

  it("GET /VPD/:add without product ID should use default values", async () => {
    const response = await request(app).get("/VPD/true");
    expect(response.body.name).toBeDefined();
  });

  it("GET /VPD/:add without userId should still return the product", async () => {
    const response = await request(app).get("/VPD/true?prodId=2");
    expect(response.body).toHaveProperty("name");
  });
});
//unit test
//used mockResolvedValue to simulate the successful resolution of that request
//used mockRejectedValue to simulate the unsuccessful resolution of that request
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

  it("GET /ANP should send POST request to add a product", async () => {
    axios.post.mockResolvedValue({
      data: {
        id: 1,
        title: "New Product",
        price: 100,
      },
    });
    const response = await request(app).get(
      "/ANP?title=New%20Product&price=100&description=Great%20Product&image=https://i.pravatar.cc&category=electronics"
    );
    expect(axios.post).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products",
      expect.any(Object),
      expect.any(Object)
    );
    expect(response.body.title).toBe("New Product");
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

  it("GET /ANP should handle default parameters", async () => {
    axios.post.mockResolvedValue({
      data: {
        title: "default title",
        price: "0",
        description: "default description",
        image: "https://i.pravatar.cc",
        category: "default category",
      },
    });
    const response = await request(app).get("/ANP");
    expect(response.body.title).toBe("default title");
  });
  //used stuck overflow for trouble shooting
  it("GET /VPD/:add should handle invalid product ID with error", async () => {
    axios.get.mockRejectedValue(new Error("Product not found"));
    const response = await request(app).get("/VPD/false?prodId=9999");
    expect(response.statusCode).toBe(500); // Assuming the server sends 500 on error
  });
  //used stuck overflow for trouble shooting
  it("GET /VPD/:add should handle API failure", async () => {
    axios.get.mockRejectedValue(new Error("Fake Store API failed"));
    const response = await request(app).get("/VPD/false?prodId=1");
    expect(response.statusCode).toBe(500);
  });
});

//the"fakestoreapi.com" crashed/stoped working mid testing so some of the tests remain unfinished
