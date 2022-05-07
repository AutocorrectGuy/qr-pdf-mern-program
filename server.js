require("dotenv").config();
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {console.log("connected to mongodb succesfully")})



const catalogueRouter = require("./routes/catalogue.routes");
app.use("/catalogues", catalogueRouter);

app.get('/', function (req, res) {
  res.json({"hello": "world"});
})
app.post("/", function (req, res) {
  res.json({"aaa": "bbb"})
})

app.listen(PORT, () => console.log("Listening to port", PORT));