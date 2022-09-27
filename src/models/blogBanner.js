const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const blogBannerSchema = new mongoose.Schema({
    file: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: true,
    },
    title: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        minlength: 1,
        maxlength: 40,
        ref: 'SupporterUser',
    },
})

blogBannerSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


const BlogBanner = mongoose.model('BlogBanner', blogBannerSchema)
module.exports = BlogBanner