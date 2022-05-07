const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catalogueSchema = new Schema({
  catalogue: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 15
  }
}, {
  timestamps: true
})

const Catalogue = mongoose.model("Catalogue", catalogueSchema);

module.exports = Catalogue; 