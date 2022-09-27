const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 40,
    },
    isSupporterSeen: {
        type: Boolean,
        default: false,
        trim: true
    },
    isUserSeen: {
        type: Boolean,
        default: true,
        trim: true
    },
    chat: [{
        supporterName: {
            type: String,
            trim: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: new Date(),
            trim: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true })

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket