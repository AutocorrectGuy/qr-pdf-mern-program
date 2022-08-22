const express = require("express")
const { MongoClient } = require('mongodb');
const LinkModel = require("../models/catalogue.model")

const router = express.Router();
const mongoURI = process.env.ATLAS_URI;

const client = new MongoClient(mongoURI)
client.connect();

const allowedExtensions = [
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
  console.log("syncing sharepoint with db...")

  const sharepointFiles = req.body.fileNames
  console.log("recieved data from bot: ")
  console.log(sharepointFiles)
  console.log("-----------")
  const sharepointFileNames = Array.isArray(sharepointFiles)
    ? sharepointFiles.map(data => Array.isArray(data) && data.length === 2
      ? data[0] : [])
    : null
  const links = await LinkModel.find()
  const dbFiles = links.map(({ name }) => name)

  // 1. check for files to add or to delete
  const newEntries = Array.isArray(sharepointFileNames)
    && sharepointFileNames.length > 0
    ? sharepointFileNames
      .filter(fn => !dbFiles.includes(fn))
      .map((x, i) => ({
        "name": sharepointFiles[i][0], "link": sharepointFiles[i][1],
        "color2": "#FFFFFF",
        "color1": "#000000" ,
        "author": "Sharepoint bots"
      }))
    : []

  const entriesToDelete = dbFiles
    .filter(fn => allowedExtensions.includes(fn.slice(-3).toLowerCase()))
    .filter(fn => !sharepointFileNames.includes(fn))
    .reduce((p, n) => ({ name: [...p.name, n] }), { name: [] })

  // 2. add and/or delete files
  // 2. add and/or delete files
  if (newEntries.length > 0) {
    const entries = await LinkModel.insertMany(newEntries)
  }
  if (entriesToDelete.name.length > 0) {
    const deleted = await LinkModel.deleteMany(entriesToDelete)
  }

  console.log("syncing finished!")
  res.json({ "syncPostRequest": "sent" })
})

module.exports = router