const mongoose = require('mongoose')

const Component = mongoose.model('Component', {
    name: {
        unique: true,
        minlength: 1,
        maxlength: 40,
        type: String,
    },
    gpuModel: [{
        name: {
            minlength: 1,
            maxlength: 40,
            type: String,
        },
        number: {
            minlength: 1,
            maxlength: 10,
            type: Number,
        },
    }],
    gpuNum: [{
        name: {
            type: Number,
            minlength: 1,
            maxlength: 40,
        },
        number: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
    }],
    gpuNumMaxNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    gpuNumMinNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    ram: [{
        name: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
        number: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
    }],
    ramMaxNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    ramMinNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    os: [{
        name: {
            type: String,
            minlength: 1,
            maxlength: 40,
        },
        number: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
    }],
    useTime: [{
        name: {
            type: String,
            minlength: 1,
            maxlength: 40,
        },
        number: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
    }],
    useTimeMaxNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    useTimeMinNumber: {
        type: Number,
        minlength: 1,
        maxlength: 10,
    },
    discount: [{
        name: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
        number: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
        maxNumber: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
        minNumber: {
            type: Number,
            minlength: 1,
            maxlength: 10,
        },
    }],
})

module.exports = Component