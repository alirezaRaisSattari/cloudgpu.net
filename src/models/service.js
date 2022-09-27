const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    gpuModel: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        uppercase: true,
        trim: true
    },
    os: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        trim: true,
        validate(value) {
            if (value.toLowerCase() !== "linux" && value.toLowerCase() !== "windows" && value.toLowerCase() !== "mac") {
                throw new Error('همچین سیستم عاملی وجود ندارد')
            }
        }
    },
    performancePerGpu: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
        trim: true
    },
    maximumGpus: {
        type: Number,
        required: true,
        min: 0,
        max: 4,
        trim: true
    },
    gpuNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 10000,
        trim: true
    },
    freeGpus: {
        type: Number,
        // required: true,
        min: 1,
        max: 10000,
        trim: true
    },
    discount: {
        type: Number,
        required: false,
        min: 1,
        max: 99,
        trim: true
    },
    gpuNum: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
        trim: true
    },
    ssdStorage: {
        type: Number,     // 128x
        min: 1,
        max: 1024,
        required: true,
        validate(value) {
            if (value !== 128 && value !== 256 && value !== 512 && value !== 1024) {
                throw new Error('ssdای با این ظرفیتی وجود ندارد')
            }
        }
    },
    framework: {
        type: Number,     // 1 : tensorflow &  2 : pytorch
        required: true,
        min: 1,
        max: 2,
        trim: true,
    },
    cpuCoreNumber: {      // 4x
        type: Number,
        required: true,
        min: 4,
        max: 32,
        trim: true,
        validate(value) {
            if (value !== 4 && value !== 8 && value !== 16 && value !== 32) {
                throw new Error('همچین پردازنده ای موجود نیست')
            }
        }
    },
    ram: {
        type: Number,     // 32x
        required: true,
        min: 32,
        max: 256,
        trim: true,
        validate(value) {
            if (value !== 32 && value !== 64 && value !== 128 && value !== 256) {
                throw new Error('همچین رمی موجود نیست')
            }
        }
    },
    useTime: {
        type: Number,
        required: true,
        min: 1,
        max: 999,
        trim: true
    },
    costPerGpu: {
        type: Number,
        required: true,
        min: 1000,
        max: 9999999999,
        trim: true
    },
    isFree: {
        type: Boolean,
        required: true,
        default: false
    },
    canCustomize: {
        type: Boolean,
        required: true,
    },
    isDisabled: {
        type: Boolean,
        required: true,
        default: false
    },
    disabledReason: {
        type: String,
        maxlength: 40,
        default: ""
    },
    deleteTime: {
        type: Date,
        required: false,
    },
    editVersion: {
        type: Number,
        required: true,
        default: 1,
    },
    usersNumber: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true })

serviceSchema.virtual('userServices', {
    ref: 'UserService',
    localField: '_id',
    foreignField: 'serviceId'
})
serviceSchema.virtual('servicesUsers', {
    ref: 'servicesUsers',
    localField: '_id',
    foreignField: 'serviceId'
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service