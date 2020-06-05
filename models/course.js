const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50characters']
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please  add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        photo: {
            type: String,
            default: 'no-photo.jpg'
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
			required: true
        }
    }
);

CourseSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Course', CourseSchema);