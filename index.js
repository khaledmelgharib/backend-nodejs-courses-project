require('dotenv').config();

// 1. الاستيرادات أولاً
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText');
const path = require('path');


// 2. تعريف app بعد الاستيرادات
const app = express();

// 3. الاتصال بقاعدة البيانات
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
    console.log('mongo-db server started');
});

// 4. Middleware العام
app.use(cors());
app.use(express.json());

// 5. المسارات (Routes)
const coursesRouter = require('./rouets/courses.route.js'); 
const usersRouter = require('./rouets/users.route .js'); 
app.use('/', coursesRouter);  // (/api/courses)
app.use('/api/users', usersRouter); // (/api/users)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. 404 Handler (في النهاية)
app.use((req, res) => {
    return res.status(404).json({status: httpStatusText.ERROR, message: "Route not found"});
});
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status:error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null})
})


// 7. تشغيل السيرفر
app.listen(process.env.PORT || 5000, () => {
    console.log('listening to port: 5000');
});