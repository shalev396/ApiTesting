// use "npm bonusServer.js" to run the server
const axios = require("axios");
const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

//View Product List
//use this template
///http://localhost:3000/VPL
app.get("/VPL/", async (req, res) => {
  try {
    const sort = req.query.sort || null;
    let response = await axios.get(`https://fakestoreapi.com/products`);
    //sorting
    switch (sort) {
      case "rate": {
        for (let i = 0; i < response.data.length - 1; i++) {
          for (let j = 0; j < response.data.length - 1 - i; j++) {
            if (
              response.data[j].rating.rate > response.data[j + 1].rating.rate
            ) {
              let temp = response.data[j];
              response.data[j] = response.data[j + 1];
              response.data[j + 1] = temp;
            }
          }
        }
        break;
      }
      case "popularity": {
        for (let i = 0; i < response.data.length - 1; i++) {
          for (let j = 0; j < response.data.length - 1 - i; j++) {
            if (
              response.data[j].rating.count > response.data[j + 1].rating.count
            ) {
              let temp = response.data[j];
              response.data[j] = response.data[j + 1];
              response.data[j + 1] = temp;
            }
          }
        }
        break;
      }
      case "price": {
        for (let i = 0; i < response.data.length - 1; i++) {
          for (let j = 0; j < response.data.length - 1 - i; j++) {
            if (response.data[j].price > response.data[j + 1].price) {
              let temp = response.data[j];
              response.data[j] = response.data[j + 1];
              response.data[j + 1] = temp;
            }
          }
        }
        break;
      }
      default: {
      }
    }
    //shows only relevant data
    for (let i = 0; i < response.data.length; i++) {
      response.data[i].name = response.data[i].title;
      delete response.data[i].title;
      delete response.data[i].category;
      //delete response.data[i].rating;
      response.data[
        i
      ].link = `https://fakestoreapi.com/products/${response.data[i].id}`;
      delete response.data[i].id;
    }
    res.json(response.data);
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
//Search for a Product
//use this template
//http://localhost:3000/sfp/?category=electronics&keyword=Drive
app.get("/SFP/", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    let sent = false;
    let response = await axios.get(`https://fakestoreapi.com/products`);
    if (keyword !== "") {
      for (let i = 0; i < response.data.length; i++) {
        if (!response.data[i].title.includes(keyword)) {
          response.data.splice(i, 1);
          i--;
        }
      }
    } else if (category !== "") {
      for (let i = 0; i < response.data.length; i++) {
        if (!response.data[i].category === category) {
          response.data.splice(i, 1);
          i--;
        }
      }
    } else {
      sent = true;
      res.json("no results");
    }
    if (!sent) {
      res.json(response.data);
    }
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
//Filter Products by Category and Price Range
//use this template
//http://localhost:3000/FPCP?categorys=electronics,men%27s%20clothing&min=25&max=63
app.get("/FPCP/", async (req, res) => {
  try {
    const min = req.query.min || 0;
    const max = req.query.max || 100;
    const categorys = req.query.categorys || ""; //use , between categorys
    const categoryArray = categorys.split(`,`);
    console.log(categoryArray);
    let response = await axios.get(`https://fakestoreapi.com/products`);
    let filteredArray = [];
    //filter by category
    for (let i = 0; i < response.data.length; i++) {
      for (let j = 0; j < categoryArray.length; j++) {
        if (
          response.data[i].category === categoryArray[j] &&
          response.data[i].price > min &&
          response.data[i].price < max
        ) {
          filteredArray.push(response.data[i]);
        }
      }
    }
    res.json(filteredArray);
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
//Edit Existing Product (Admin)
//use this template
//http://localhost:3000/EEP/?id=1&title=title&price=10&description=des&category=electronics&image=img
app.get("/EEP", async (req, res) => {
  try {
    const id = req.query.id || "";
    let title = req.query.title || "";
    let price = req.query.price || "";
    let description = req.query.description || "";
    let category = req.query.category || "";
    let image = req.query.image || "";
    const char = "";
    let sent = false;
    let response1 = await axios.get(`https://fakestoreapi.com/products/${id}`);
    let responseCat = await axios.get(
      `https://fakestoreapi.com/products/categories`
    );
    const old = response1.data;
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    switch (char) {
      case title: {
        title = old.title;
        break;
      }
      case price: {
        price = old.price;
        break;
      }
      case description: {
        description = old.description;
        break;
      }
      case category: {
        category = old.category;
        break;
      }
      case image: {
        image = old.image;
        break;
      }
    }
    console.log(responseCat.data);
    console.log(category);

    if (!responseCat.data.includes(category)) {
      sent = true;
      console.error("post error");
      res.status(400).send("invalid category");
    }
    const data = {
      title: title,
      price: price,
      description: description,
      image: image,
      category: category,
    };
    if (!sent) {
      const response2 = await axios.put(
        `https://fakestoreapi.com/products/${id}`,
        data,
        headers
      );
      res.json(response2.data);
    }
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
//Delete Product (Admin)
//use this template
//http://localhost:3000/DP/?id=1
app.get("/DP", async (req, res) => {
  try {
    const id = req.query.id || "";
    let sent = false;
    if (id === "") {
      sent = true;
      console.error("post error");
      res.status(400).send("invalid id");
    }
    if (!sent) {
      const response = await axios.delete(
        `https://fakestoreapi.com/products/${id}`
      );
      res.json(response.data);
    }
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
//Product Reviews and Ratings
//there is no way to interact with Reviews or Ratings in this api
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
