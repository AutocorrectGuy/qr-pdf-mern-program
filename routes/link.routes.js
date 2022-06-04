const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const LinkModel = require("../models/catalogue.model");
const PdfModel = require("../models/pdf.model");
const { getUserData } = require("../middleware/auth.middleware");
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
  const newCatalogue = new LinkModel(catalogue);
  newCatalogue.save()
    .then(() => res.json(`Catalogue "${catalogue.name}" added succesfully!`))
    .catch(err => res.status(400).json(`Error +_+: ${err}`))
})

router.get('/json/:id', (req, res) => {
  LinkModel.findById(req.params.id)
    .then(data => res.json(data))
    .catch(err => `There is no such file in database. ${err}`);
});

router.put('/update/:id', (req, res) => {
  LinkModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    author: req.body.author,
    color1: req.body.color1,
    color2: req.body.color2
  })
    .then(data => res.json(data))
    .catch(err => `There is no such file in database. ${err}`);
});

router.delete("/delete/:id", (req, res) => {
  LinkModel.findByIdAndDelete(req.params.id)
    .then(data => res.json("Catalogue deleted succesfully"))
    .catch(err => `Error +_+: ${err}`);
})

/**
 * merges from "link.routes and pdf.routes"
 */
router.get("/get-links-and-pdfs-ids", async (req, res) => {
  
  // user validation
  const userData = process.env.NODE_ENV === "development"
    ? {}
    : await getUserData(req.cookies.jwt)
  if (Object.keys(userData).length === 0 && process.env.NODE_ENV !== "development") 
    return res.status(401).json({});

  // get data
  const countFiles = await PdfModel.countDocuments();
  const countLinks = await LinkModel.countDocuments();

  const limit = parseInt(req.query.limit);
  const skipOffest = parseInt(req.query.page) * limit;

  const filesInfo = await PdfModel.find().limit(limit).skip(skipOffest);
  const linksData = await LinkModel.find().limit(limit).skip(skipOffest);

  const mappedFilesData = (!filesInfo || filesInfo.length === 0)
    ? []
    : filesInfo.map(({ _id, metadata: { name, author, colors } }) => ({
      _id, name, author, colors
    }));

  const output = JSON.stringify({
    token: userData,
    linksData: {
      count: countLinks,
      data: linksData,
    },
    filesData: {
      count: countFiles,
      data: mappedFilesData
    },
  });
  return res.status(200).json(output);
})

router.get("/get-models", async (req, res) => {
  const filesInfo = await PdfModel.find();

  const mappedFilesData = (!filesInfo || filesInfo.length === 0)
    ? []
    : filesInfo.map(({ _id, metadata: { name, author, colors } }) => ({
      _id, name, author, colors
    }));

  const output = JSON.stringify({
    filesData: {
      data: mappedFilesData
    },
  });
  return res.status(200).json(output);
})


module.exports = router; 