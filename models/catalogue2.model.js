const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catalogue2Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  pdf: {
    type: Buffer,

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
  }
}, {
  timestamps: true
})

const Catalogue2 = mongoose.model("Catalogue2", catalogue2Schema);

module.exports = Catalogue2; 