require("dotenv").config();
const path = require("path");
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const linkRouter = require("./routes/link.routes");
const pdfRouter = require("./routes/pdf.routes");

const app = express();
const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000', 'http://localhost:3001', `http://localhost:${PORT}`,  'https://qrkodi.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) 
      callback(null, true)
     else 
      callback(new Error('Not allowed by CORS'))
  }
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({ extended: true }));

app.use("/api/links", linkRouter);
app.use('/api/pdfs', pdfRouter);

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