const mongoose = require('mongoose')

const cvSchema = new mongoose.Schema({
    job: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        default: 0
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        trim: true
    },
    emailOrPhone: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        trim: true
    },
    text: {
        type: String,
        minlength: 1,
        maxlength: 40,
        trim: true
    },
    file: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: true,
    },
    isSeen: {
        type: String,
        required: true,
        default: false,
        minlength: 1,
        maxlength: 5,
        trim: true
    },
})

const Cv = mongoose.model('Cv', cvSchema)

module.exports = Cv