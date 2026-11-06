const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now()+"-"+file.originalname;
        cb(null, uniqueName);
    }
});

// Set up multer upload configuration
const upload = multer({ 
    storage: storage,
    fileFilter:(req,file,cb)=> {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "application/pdf"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type. Only PNG, JPEG, JPG and PDF are allowed!"), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Max 5MB 
    }
});


module.exports = upload;

