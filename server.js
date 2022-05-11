require("dotenv").config();
const path = require("path");
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const catalogueRouter = require("./routes/catalogue.routes");
const imageRouter = require("./routes/image.routes");

const app = express();
const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3001', `http://localhost:${PORT}`,  'https://qrkodi.herokuapp.com']
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

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use("/catalogues", catalogueRouter);
app.use('/api/image', imageRouter);

if(process.env.NODE_ENV === "production") {
  app.use(express.static('frontend/build'));
  // server any static files
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build',  "index.html"))
  })
}

mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    app.listen(PORT, () => {console.log(`Server is up on port ${PORT}!`)});
  });