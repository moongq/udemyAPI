const express = require('express');
const Content = require('../models/Content');
const Course = require('../models/Course');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createContent = asyncHandler(async (req, res, next) => {
    req.body.course = req.params.courseId;
    req.body.user = req.user.id;
  
    const course = await Course.findById(req.params.courseId);

    // Check is there collect course
    
    // Check the user is course owner
    if (course.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(
                'only instructor of this course can do',
                401
            )
        )
    }

    const content = await Content.create(req.body);
  
    res.status(201).json({
      success: true,
      data: content
    });

  });

exports.getContents = asyncHandler(async(req, res, next) => {
    const contents = await Content.find({ course: req.params.courseId });
    
    res.status(200).json({
        success: true,
        data: contents
    });
})

exports.getContent = asyncHandler(async(req, res, next) => {
    const content = await Content.findOne({ _id: req.params.id }).populate({
        path: 'course',
        select: 'name description'
    });

    res.status(200).json({
        success: true,
        data: content
    });
})

exports.updateContent = asyncHandler(async(req, res, next) => {
    content = await Content.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data : content
    });
})

exports.deleteContent = asyncHandler(async(req, res, next) => {
    content = await Content.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
        success: true,
        data: {}
    });
})  
