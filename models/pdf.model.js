const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pdfFileSchema = new Schema({
  length: {
    type: Number,
    required: true
  },
  chunkSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    required: true
  },
  filename: {
    type: String,
    required: true,
    minlength: 8
  },
  contentType: {
    type: String,
    required: true,
  },
  metadata: {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    colors: {
      type: String,
      required: true,
    }
  }
})

const PdfFileSchema = mongoose.model("pdfs.file", pdfFileSchema);

module.exports = PdfFileSchema; 