const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 40,
    },
    category: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
        ref: 'Category',
    },
    isInFaq: {
        type: Boolean,
        required: true,
        minlength: 1,
        maxlength: 10,
        default: false
    },
    coverImg: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: false,
    },
    text: {
        type: Object,
        minlength: 1,
        maxlength: 100,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        minlength: 1,
        maxlength: 60,
        ref: 'SupporterUser',
    },
}, { timestamps: true })

blogSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog