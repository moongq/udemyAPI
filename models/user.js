const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cryto = require('crypto');



const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true,'Please add an email'],
		unique: true,
		match: [
     	 /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      	'Please add a valid email'
    	]
	},
	role: {
		type: String,
		enum: ['user', 'instructor'],
		defalut: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date
});

UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id:this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', UserSchema);
