const multer = require('multer')

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(file)
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, file.originalname)
    }
});

module.exports = {
    uploads: multer().array('image', 4)
}