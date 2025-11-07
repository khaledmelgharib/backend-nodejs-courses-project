const AppError = require("../utils/appError.js");
const httpStatusText = require("../utils/httpStatusText.js");

module.exports = allowedTo = (...role) =>{
    return (req, res, next) => {
        if(!role.includes(req.currantUser.role)){
            const error = AppError.create("You are not allowed to access this route", 403, httpStatusText.FORBIDDEN)
            return next (error);
        }
        next();
    }
}
