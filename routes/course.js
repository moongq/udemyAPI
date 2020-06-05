const express = require('express');
const { 
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse } = require('../controllers/course');

// Include other resource routers
const contentRouter = require('./content');
const reviewRouter =  require('./review');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');


// Re-route into othher resource routers
router.use('/:courseId/content', contentRouter);
router.use('/:courseId/contents', contentRouter);
router.use('/:courseId/review', reviewRouter);
router.use('/:courseId/reviews', reviewRouter);


router
    .route('/')
    .get(getCourses);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

router
    .route('/create')
    // .get(protect, authroize('instructor', 'admin'), getCreateCourse)
    .post(protect, authorize('instructor', 'admin'), createCourse);



module.exports = router;