require("dotenv").config();
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const buildPath = process.env.DEPLOY ? "./dist" : "./frontend/build";
const catalogueRouter = require("./routes/catalogue.routes");

const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3001', 'http://localhost:5000', 'https://qrkodi.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(express.static(buildPath));
app.use(express.static(buildPath + "static/"));
app.use(cors());
app.use(express.json());

/**
 * Connection to DB
 */
const uri = "mongodb+srv://autocorrectGuy:autocorrectGuy@cluster0.r7mty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {console.log("connected to mongodb succesfully")})

/** 
 * Routes
 */
app.use("/catalogues", catalogueRouter);
app.get('/', function (req, res) {
  res.sendFile(`${buildPath}/index.html`, (err) => {
    res.json({"error": err})
  });
})

if(process.env.NODE_ENV === "production") {
  // server any static files
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"))
  })
}

app.listen(PORT, console.log("Listening to port", PORT));