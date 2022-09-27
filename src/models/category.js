const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true,
    },
    blogs: [{
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            minlength: 1,
            maxlength: 40,
            ref: 'Blog',
            require: false
        },
        title: {
            type: String,
            minlength: 1,
            maxlength: 40,
            ref: 'Category',
            require: false
        }
    }],
})

categorySchema.virtual('tasks', {
    ref: 'Blog',
    localField: 'name',
    foreignField: 'category'
})

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


const Category = mongoose.model('Category', categorySchema)
module.exports = Category