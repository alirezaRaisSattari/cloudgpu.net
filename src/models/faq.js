const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const faqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
    },
    question: [{
        starred: {
            type: Boolean,
            required: false,
            minlength: 1,
            maxlength: 5,
            default: false
        },
        title: {
            type: String,
            minlength: 1,
            maxlength: 40,
            required: false,
        },
        answer: {
            type: String,
            minlength: 1,
            maxlength: 40,
            required: false,
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        minlength: 1,
        maxlength: 40,
        ref: 'SupporterUser',
    },
})

faqSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


const faq = mongoose.model('Faq', faqSchema)
module.exports = faq