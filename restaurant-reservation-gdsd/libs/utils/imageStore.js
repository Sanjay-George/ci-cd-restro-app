const multer = require("multer");
const path = require("path");

const IMAGE_FOLDER = path.resolve(__dirname, "../../uploads/");
const IMAGE_PATH = "/uploads/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGE_FOLDER);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + Date.now() + ext;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only accept images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|PNG|JPEG|GIF)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = {
  upload,
  IMAGE_FOLDER,
  IMAGE_PATH,
};
