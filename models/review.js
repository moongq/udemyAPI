const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	text: {
		type: String,
		required: [true, 'Please add some text']
	},
	rating: {
		type: Number,
		min: '1',
		max: '5',
		required: [true, 'Please add a rating between 1 and 10']
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

ReviewSchema.index({ bootcamp: 1, user: 1}, {unique: true });

module.exports = mongoose.model('Review', ReviewSchema);