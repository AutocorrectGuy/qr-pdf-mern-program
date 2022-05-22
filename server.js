require("dotenv").config();
const path = require("path");
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const linkRouter = require("./routes/link.routes");
const pdfRouter = require("./routes/pdf.routes");
const authRouter = require("./routes/authorization.routes");


const app = express();
const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000', `http://localhost:${PORT}`,  'https://qrkodi.herokuapp.com']
const corsConfig = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
     else callback(new Error('Not allowed by CORS. This is the error'))
  },
  credentials: true,
  exposedHeaders: "Authorization"
}

app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfig));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Expose-Headers','Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use("/api/links", linkRouter);
app.use("/api/pdfs", pdfRouter);
app.use("/auth", authRouter);

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