const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Catalogue = require("../models/catalogue.model");
const { checkUser } = require("../middleware/auth.middleware");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const mongoURI = process.env.ATLAS_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'pdfs',
  });
});

router.post("/upload", (req, res) => {
  const catalogue = {
    name: req.body.name,
    link: req.body.link,
    color1: req.body.color1,
    color2: req.body.color2,
    author: req.body.username
  };
  const newCatalogue = new Catalogue(catalogue);
  newCatalogue.save()
    .then(() => res.json(`Catalogue "${catalogue.name}" added succesfully!`))
    .catch(err => res.status(400).json(`Error +_+: ${err}`))
})

router.get('/json/:id', (req, res) => {
  Catalogue.findById(req.params.id)
    .then(data => res.json(data))
    .catch(err =>`There is no such file in database. ${err}`);
});

router.put('/update/:id', (req, res) => {
  Catalogue.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    author: req.body.author,
    color1: req.body.color1,
    color2: req.body.color2
  })
    .then(data => res.json(data))
    .catch(err =>`There is no such file in database. ${err}`);
});

router.delete("/delete/:id", (req, res) => {
  Catalogue.findByIdAndDelete(req.params.id)
    .then(data => res.json("Catalogue deleted succesfully"))
    .catch(err =>`Error +_+: ${err}`);
})

/**
 * merges from "link.routes and pdf.routes"
 */
 router.get("/get-links-and-pdfs-ids", (req, res) => {
  let token = req.cookies.jwt;
  // console.log("cookie token: ", token);
  // const authHeader = req.headers['authorization']
  // const token2 = authHeader && authHeader.split(' ')[1];
  // console.log(token2);
  console.log(req.headers);

  if (token) {
    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) token = {};
        else {
          const user = await User.findById(decodedToken.id);
          if (user) token = { status: true, username: user.username };
          else token = { status: false, username: null };
        }
      }
    );
  } else {
    token = {status: false, username: null};
  }
  // if(token.status === false) res.status(401).json({});
  // if(token.username === null) res.status(401).json({});
  
  let linksData = [], pdfFilesData = [];
  Catalogue.find()
    .then(catalogues => {linksData = catalogues})
    .then(() => {
      gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) pdfIds = []
        else pdfFilesData = files.map((pdfFile) => ({
            _id: pdfFile._id,
            name: pdfFile.metadata.name,
            author: pdfFile.metadata.author,
            colors: pdfFile.metadata.colors
          }));
        let outData = JSON.stringify({
          token: token,
          part1: linksData,
          part2: pdfFilesData
        });
        return res.status(200).json(outData)
      })
    })
    .catch(err => res.status(400).json(`Error +_+: ${err}`))
})

router.get("/asd", (req, res) => {
  res.status(200).json({"x":"1"});
})

module.exports = router; 