const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const mongoURI = process.env.ATLAS_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'pdfs',
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = { 
          bucketName: 'pdfs',
          filename: filename,
          metadata: { 
            name: req.body.name,
            author: req.body.author,
            colors: req.body.colors,
          }
        };
        resolve(fileInfo);
      });
    });
  },
});

// set up our multer to use the gridfs storage defined above
const store = multer({
  storage, limits: { fileSize: 20000000 },
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
      return res.status(400).send('File too large');
    } else if (err) {
      if (err === 'filetype') return res.status(400).send('Pdf files only');
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
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('Pdf deletion error');
  });
};

router.delete(("delete/:id", (req, res) => {
  gfs.delete(req.params.id, (err) => {
    if (err) return res.status(500).send('Pdf deletion error');
  });
}))

router.get('/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.status(400).send('no pdf id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    gfs.openDownloadStream(_id).pipe(res);
  });
});

// find all file _ids
// router.get("/get-files-ids", (req, res) => {
//   gfs.find().toArray((err, files) => {
//     if(!files || files.length === 0) 
//       return res.status(404).json({err: "Datubāzē nav failu vai nosūtīts nepareizs pieprasījums"})
    
//     let outData = files.map(({pdfFile}) => ({
//       _id: pdfFile._id,
//       name: pdfFile.name,
//       colors: pdfFile.metadata.colors
//     }));
//     console.log(outData);
//     return res.json(outData);
//   })
// })


module.exports = router;