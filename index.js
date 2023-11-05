const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//middelwares
app.use(cors());
app.use(express.json());
//---------------------------
app.get("/", (req, res) => {
  res.send("Coffee making server is running");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
