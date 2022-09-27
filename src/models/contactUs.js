const mongoose = require('mongoose')

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    isSeen: {
        type: String,
        required: true,
        default: false,
        trim: true
    },

})

const ContactUs = mongoose.model('ContactUs', contactUsSchema)

module.exports = ContactUs