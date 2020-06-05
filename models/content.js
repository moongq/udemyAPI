const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
	title: {
		type: String,
		// trim: true,
		required: [true, 'Please add a course title']
	},
	description: {
		type: String,
		required: [true, 'Please add a description']
	},
	video: {
		type: String,
		default: 'wait !! not developed yet !!'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	course: {
		type: mongoose.Schema.ObjectId,
		ref: 'Course',
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('Content', ContentSchema);