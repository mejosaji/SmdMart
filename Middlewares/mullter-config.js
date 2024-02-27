const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        const dest = path.join(__dirname,'..','public','uploads');
        cb(null, dest);
    },
    filename : (req, file, cb)=>{
        console.log(file);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.filename + "-" + uniqueSuffix + path.extname(file.originalname)
        )
    }
});

const fileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|webp|JPG)$/)){
        const error = new Error("only JPEG and PNG images are allowed");
        error.status = 400;
        return cb(error, false)
    }
    cb(null,true)
}

const upload = multer({
    storage : storage,
    limits : {fileSize : 2 * 1024 * 1024 * 1024},
    fileFilter : fileFilter
})

module.exports = upload;