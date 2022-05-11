const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');


let Catalogue = require("../models/catalogue.model");
const mongoURI = process.env.ATLAS_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images',
  });
});

/**
 * GET
 */
router.get("/", (req, res) => {
  let linksData = [], imageIds = [];

  Catalogue.find()
    .then(catalogues => {linksData = catalogues;})
    .then(() => {
      gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) imageIds = []
        else imageIds = files.map(({_id}) => _id);

        let outData = JSON.stringify({
          part1: linksData,
          part2: imageIds
        });

        return res.status(200).json(outData)
      })
    })
    .catch(err => res.status(400).json(`Error +_+: ${err}`))
})

router.get("/:id", (req, res) => {
  console.log("gettting my catalogue :)");
  Catalogue.findById(req.params.id)
    .then(catalogues => res.json(catalogues))
    .catch(err =>`Error +_+: ${err}`);
})

/**
 * POST
 */
router.post("/add", (req, res) => {
  const catalogue = {
    name: req.body.name,
    link: req.body.link,
    color1: req.body.color1,
    color2: req.body.color2
  };
  const newCatalogue = new Catalogue(catalogue);

  newCatalogue.save()
    .then(() => res.json(`Catalogue "${catalogue.name}" added succesfully!`))
    .catch(err => res.status(400).json(`Error +_+: ${err}`))
})

/**
 * DELETE
 */

router.delete("/:id", (req, res) => {
  Catalogue.findByIdAndDelete(req.params.id)
    .then(data => res.json("Catalogue deleted succesfully"))
    .catch(err =>`Error +_+: ${err}`);
})

module.exports = router; 