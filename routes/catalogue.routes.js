const express = require("express");
const router = express.Router();

let Catalogue = require("../models/catalogue.model");
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
  const catalogue = req.body.catalogue;
  const newCatalogue = new Catalogue({catalogue});

  newCatalogue.save()
    .then(() => res.json(`Catalogue "${catalogue}" added succesfully!`))
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