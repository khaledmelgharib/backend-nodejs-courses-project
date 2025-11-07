const asyncWrapper = require("../middelWare/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const Users = require("../moudels/users.model.js");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT.js");






const getAllUsers = asyncWrapper( 
async (req, res) =>{
    const query = req.query;

    const limt= query.limit || 10;
    const page  = query.page || 1;
    const skip = (page - 1) * limt;

    const users = await Users.find({}, {"__v":false, "password": false}).limit(limt).skip(skip)
    res.json({status: httpStatusText.SUCCESS, data:{users}})
})

const register = asyncWrapper( async (req, res, next) => {
    const {firstName, lastName, email, password, role, avatar } = req.body;
    const OldUser = await Users.findOne({email: email});
    if(OldUser){
        AppError.create("User Already Exist. Please Login", 400, httpStatusText.BAD_REQUEST)
        return next(AppError);
    }

    // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    })

        // generate token
        const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role });
        newUser.token = token;

    await newUser.save();
    res.status(201).json({status: httpStatusText.SUCCESS, data:{user:newUser}})
})

const login = asyncWrapper (async (req, res, next) => {
    const {email, password} = req.body

    if(!email && !password){
        AppError.create("Please provide email and password", 400, httpStatusText.BAD_REQUEST)
        return next(AppError);
    }

    const user = await Users.findOne({email: email});

    if(!user){
        AppError.create("User not found", 404, httpStatusText.NOT_FOUND)
        return next(AppError);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if(user && matchPassword){
        const token = await generateJWT({ email: user.email, id: user._id, role: user.role });
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{token}})
    }else{
        AppError.create("Invalid Credentials", 401, httpStatusText.UNAUTHORIZED)
        return next(AppError);
    }
})

module.exports = {
    getAllUsers,
    register,
    login,
}