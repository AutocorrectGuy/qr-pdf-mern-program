const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const PdfModel = require("../models/pdf.model");
const { checkUser, checkTokenLight } = require("../middleware/auth.middleware")
require('dotenv').config();

const mongoURI = process.env.ATLAS_URI;

mongoose.connect(mongoURI);
const db = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});;
db.on('error', console.error.bind(console, 'connection error:'));

let gfs;
db.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(db.db, { bucketName: 'pdfs' });
})

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'pdfs',
          metadata: req.body
        };
        resolve(fileInfo);
      });
    });
  }
});

const store = multer({
  storage, limits: { fileSize: 50000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb('filetype');
}

const uploadMiddleware = (req, res, next) => {
  const upload = store.single('pdf');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('Faila izmērs ir pārāk liels. Tam jābāut < 50 mb.');
    } else if (err) {
      if (err === 'filetype') return res.status(400).send('Iespējams augšupādēt tikai PDF faila tipu (.pdf).');
      return res.sendStatus(500);
    }
    next();
  });
};

router.post('/upload/', uploadMiddleware, async (req, res) => {
  const { file } = req;
  const { id } = file;
  if (file.size > 50000000) {
    deletePdf(id);
    return res.status(400).send('Fails nedrīkst būt lielāks par 50mb!');
  }
  return res.send(file.id);
});

const deletePdf = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no pdf id');
  gfs.delete(mongoose.Types.ObjectId(id), (err) => {
    if (err) return res.status(500).send('Pdf deletion error');
  });
};

router.get('/file/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.status(400).send('no pdf id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    gfs.openDownloadStream(_id).pipe(res);
  });
});

router.get('/json/:id', (req, res) => {

  PdfModel.findById(req.params.id)
    .then(data => res.json(data))
    .catch(err =>`There is no such file in database. ${err}`);
});

router.put('/update/:id', (req, res) => {
  PdfModel.findByIdAndUpdate(req.params.id, {
    metadata: {
      name: req.body.name,
      author: req.body.author,
      colors: req.body.colors
    }
  })
    .then(data => res.json(data))
    .catch(err =>`There is no such file in database. ${err}`);
});

router.delete("/delete/:id", ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.status(400).send('no pdf id (to delete)');
  gfs.delete(mongoose.Types.ObjectId(id), (err) => {
    if (err) return res.status(500).send('Pdf deletion error');
    else res.status(200).send("Deletion succesfull");
  })
})

module.exports = router;