const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catalogueSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  color1: {
    type: String,
    required: true,
    maxlength: 8
  },
  color2: {
    type: String,
    required: true,
    maxlength: 8
  },
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
}, {
  timestamps: true
})

const Catalogue = mongoose.model("Catalogue", catalogueSchema);

module.exports = Catalogue; 