const axios = require("axios");
const express = require("express");

require("dotenv").config();

const app = express();
const port = 3000;

//use this template
///http://localhost:3000/VPD/true?prodId=3&userId=4
app.get("/VPD/:add", async (req, res) => {
  try {
    const prodId = req.query.prodId || 1; // default to 1 if not provided
    const userId = req.query.userId || 1; // default to 1 if not provided
    const add = req.params.add;
    const response = await axios.get(
      `https://fakestoreapi.com/products/${prodId}`
    );
    console.log(response);
    if (add === "true") {
      let headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const data = {
        userId: userId,
        date: Date(),
        products: [{ productId: prodId, quantity: 1 }],
      };
      const responseput = await axios.put(
        `https://fakestoreapi.com/carts/${prodId}`,
        data,
        headers
      );
      res.json(responseput.data);
    } else {
      //checks if has rating
      if (response.data.rating) {
        res.json({
          //shows only the required values
          name: response.data.title,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          image: response.data.image,
          rating: response.data.rating,
        });
      } else {
        res.json({
          //shows only the required values
          name: response.data.title,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          image: response.data.image,
        });
      }
    }
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});

//use this us a template
//http://localhost:3000/ANP?title=Test%20Title&price=100&description=Great%20Product&image=https://i.pravatar.cc&category=electronics
app.get("/ANP", async (req, res) => {
  try {
    const title = req.query.title || "default title"; // 'default title' is used if title is not provided
    const price = req.query.price || "0"; // default price of 0
    const description = req.query.description || "default description";
    const image = req.query.image || "https://i.pravatar.cc"; // Default image URL
    const category = req.query.category || "default category";

    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const data = {
      title: title,
      price: price,
      description: description,
      image: image,
      category: category,
    };
    const response = await axios.post(
      `https://fakestoreapi.com/products`,
      data,
      headers
    );
    res.json(response.data);
  } catch (err) {
    console.error("server error", err);
    res.status(500).send("Server Error");
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
