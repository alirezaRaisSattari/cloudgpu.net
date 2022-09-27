const mongoose = require('mongoose')

const serviceUsersSchema = new mongoose.Schema({
    gpuNum: {
        type: Number,
        required: false,
        min: 1,
        max: 4,
        trim: true
    },
    ssdStorage: {
        type: Number,
        required: false,
    },
    framework: {
        type: Number,     // 1 : tensorflow &  2 : pytorch
        required: false,
        trim: true
    },
    ram: {
        type: Number,
        required: false,
        trim: true
    },
    useTime: {
        type: Number,
        required: false,
        trim: true
    },
    performance: {
        type: Number,
        required: false,
        trim: true
    },
    cost: {
        type: Number,
        required: false,
        trim: true
    },
    editVersion: {
        type: Number,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service',
    },
})

const ServiceUsers = mongoose.model('ServiceUsers', serviceUsersSchema)

module.exports = ServiceUsers