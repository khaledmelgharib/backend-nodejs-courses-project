
const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users.controllers.js")
const verifyToken = require("../middelWare/verifyToken.js")
const multer = require('multer')
const appError = require("../utils/appError.js")


const diskStorage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb (null, 'uploads/')
    },
    filename : function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `user-${Date.now()}.${ext}`;
        cb(null, filename);
    }
})

const fileFilter = (req, file, cb) => {
    const imageTypes = file.mimetype.split('/')[0];

    if(imageTypes === 'image'){
        return cb(null, true);
    }else{
    return cb(new Error('Only image files are allowed'), false);
    }
}

const upload = multer({ storage: diskStorage, fileFilter });


router.route('/')
    .get(verifyToken, usersController.getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), usersController.register)

router.route('/login')
    .post(usersController.login)


    
module.exports = router