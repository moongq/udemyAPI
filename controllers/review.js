const express = require('express');
const Content = require('../models/Content');
const Course = require('../models/Course');
const Review = require('../models/Review');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.course = req.params.courseId;
    req.body.user = req.user.id;

    const course = await Course.findById(req.params.courseId);
    
    console.log(course);

    console.log('req.body : ', req.body);
    const review = await Review.create(req.body);

    console.log('is here ok?');
    res.status(201).json({
        success: true,
        data: review
    })
});

exports.getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ course: req.params.courseId })
    
    res.status(200).json({
        success: true,
        data: reviews
    })
});

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findOne({ _id : req.params.id })

    res.status(200).json({
        success: true,
        data: review
    })
});

exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`Not authoired to update review`, 401));
    }

    review = await Review.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: review
    })
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findOneAndDelete({ _id: req.params.id });
    
    res.status(200).json({
        success: true,
        data: {}
    });
});