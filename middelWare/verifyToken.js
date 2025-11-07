const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!authHeader ){
        const error = AppError.create("Authorization header missing or invalid", 401, httpStatusText.UNAUTHORIZED)
        return next(error);
    }

    try{
    const currantUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.currantUser = currantUser;
    next();

    }catch(err){
        const error = AppError.create("Invalid or expired token", 401, httpStatusText.UNAUTHORIZED)
        return next(error);
    }
}
module.exports = verifyToken;