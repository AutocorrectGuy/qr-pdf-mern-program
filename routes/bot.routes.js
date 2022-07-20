const express = require("express")
const { MongoClient } = require('mongodb');
const LinkModel = require("../models/catalogue.model")

const router = express.Router();
const mongoURI = process.env.ATLAS_URI;

const client = new MongoClient(mongoURI)
client.connect();

router.get("/links-data", async (req, res) => {
  
  const links = await LinkModel.find();
  const filteredData = (!links || links.length === 0)
    ? []
    : links.map(({ _id, link }) => ({
      _id, link
    }));
  return res.status(200).json(filteredData)
})

router.delete("/delete/:id", (req, res) => {
  console.log(req.params.id)
  LinkModel.findByIdAndDelete(req.params.id)
    .then(() => res.json("Bot has deleted link succesfully"))
    .catch(err => `Error???: ${err}`)
})

module.exports = router