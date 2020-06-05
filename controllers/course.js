const Course = require('../models/Course');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createCourse = asyncHandler( async (req, res, next) => {
    // input : req.user (from protect)
    req.body.user = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    }) 
});

exports.getCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({});

    res.status(200).json({
        success: true,
        data: courses
    })
});

exports.getCourse = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: course
    })
})

exports.updateCourse = asyncHandler(async(req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse('course not found')
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    })
})

exports.deleteCourse = asyncHandler(async(req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse('course not found')
        );
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
})