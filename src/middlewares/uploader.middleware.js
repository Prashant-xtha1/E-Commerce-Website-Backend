const multer = require("multer");
const fs = require("fs");

const uploader = () => {
  const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "./public/uploads/"
      if(!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true});
      }

      cb(null, path);
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    }
  });

  const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    if(["jpg", "jpeg", "png", "bmp", "svg", "webp", "heic", "gif"].includes(ext.toLowerCase())){
      cb(null, true);
    } else {
      cb({
        code: 422,
        message: "File Format Not Supported",
        status: "FILE_UPLOAD_ERR",
      });
    }
  }
  return multer({
    storage: myStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5000000
    }
  })
}

module.exports = uploader;