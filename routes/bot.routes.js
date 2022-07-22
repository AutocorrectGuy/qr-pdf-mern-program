const express = require("express")
const { MongoClient } = require('mongodb');
const LinkModel = require("../models/catalogue.model")

const router = express.Router();
const mongoURI = process.env.ATLAS_URI;

const client = new MongoClient(mongoURI)
client.connect();

const allowerExtensions = [
  "pdf", "txt", "doc", "xdoc", "xls", "xlsx"
]

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

router.post("/sync-sharepoint", async (req, res) => {
  console.log("syncing sharepoing with db...")

  const sharepointFiles = req.body.fileNames
  const links = await LinkModel.find()
  const dbFiles = links.map(({name}) => name)

  // 1. check for files to add or to delete
  const newEntries = sharepointFiles
    .filter(fn => !dbFiles.includes(fn))
    .map(fn => ({ "name": fn, "link": fn, "color1": "#FFFFFF", "color2": "#000000", "author": "bot-1"}))
  
  const entriesToDelete = dbFiles
    .filter(fn => allowerExtensions.includes(fn.slice(-3).toLowerCase()))
    .filter(fn => !sharepointFiles.includes(fn))
    .reduce((p, n) => ({ name: [...p.name, n]}), { name: []})

  // 2. add and/or delete files
  if(newEntries.length > 0) {
    const entries = await LinkModel.insertMany(newEntries)
    console.log(entries)
  }
  if(entriesToDelete.name.length > 0) {
    const deleted = await LinkModel.deleteMany(entriesToDelete)
    console.log(deleted)
  }

  console.log("syncing finished!")
  res.json({"hello": "world"})
})

module.exports = router