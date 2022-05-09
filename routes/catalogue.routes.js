const express = require("express");
const router = express.Router();
const multer = require("multer");

let Catalogue = require("../models/catalogue.model");
let Catalogue2 = require("../models/catalogue2.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../dist/uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({ 
  storage: storage 
})

/**
 * GET
 */
router.get("/", (req, res) => {
  Catalogue.find()
    .then(catalogues => res.json(catalogues))
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

// Single file
router.post("/upload", uploadStorage.single("file"), (req, res) => {
  const catalogue2 = {
    name: req.body.name,
    pdf: req.body.uploadFile,
    color1: req.body.color1,
    color2: req.body.color2
  };
  const newCatalogue2 = new Catalogue2(catalogue2);

  newCatalogue2.save()
    .then(() => res.json(`Catalogue2 "${catalogue2.name}" added succesfully!`))
    .catch(err => res.status(400).json(`Error +_+: ${err}`))

  console.log(req.file)
  return res.send("Single file")
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