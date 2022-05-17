const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();


module.exports = uploadMiddleware;  