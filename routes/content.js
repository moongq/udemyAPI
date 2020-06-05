const express = require('express');
const {
    createContent,
    getContents,
    getContent,
    updateContent,
    deleteContent
} = require('../controllers/content');
const router = express.Router({mergeParams: true});
const {protect, authorize } = require('../middlewares/auth');

router
    .route('/')
    .post(protect, authorize('instructor'), createContent)
    .get(getContents);

router
    .route('/:id')
    .put(protect, authorize('instructor'), updateContent)
    .delete(protect, authorize('instructor') ,deleteContent)
    .get(getContent);

module.exports = router;