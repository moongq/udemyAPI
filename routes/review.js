const express = require('express');
const { 
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} = require('../controllers/review');
const router = express.Router({mergeParams:true});

const { protect, authorize } = require('../middlewares/auth');


router
    .route('/')
    .post(protect, authorize('user'), createReview)
    .get(getReviews);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user'), updateReview)
    .delete(protect, authorize('user'), deleteReview);

module.exports = router;