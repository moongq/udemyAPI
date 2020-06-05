const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controllers/auth');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/getMe', protect ,getMe);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', protect, forgotPassword);
router.put('/resetpassword/:resettoken', protect, resetPassword);

module.exports = router;