
const express = require("express")
const router = express.Router()
const coursesController = require("../controllers/courses.controller.js");
const {body} = require('express-validator');
const verifyToken = require("../middelWare/verifyToken.js");
const userRoles = require ("../utils/userRoles.js");
const allowedTo = require("../middelWare/allowedTo.js");



router.get('/api/courses', coursesController.gitAllcourses)

router.get('/api/courses/:courseId', coursesController.getCourse)

router.post('/api/courses', 
    [
        body('title')
            .notEmpty()
            .withMessage('title is require')
            .isLength({min:2})
            .withMessage('title at list is chars'),
        body('price')
            .notEmpty()
            .withMessage('price is require')
    ], verifyToken, coursesController.addCourses)

router.patch('/api/courses/:courseId', verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), coursesController.updeteCourse)

router.delete( "/api/courses/:courseId",verifyToken, allowedTo (userRoles.ADMIN, userRoles.MANAGER), coursesController.deleteCourse)

module.exports = router