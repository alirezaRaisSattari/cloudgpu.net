const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const billsSchema = new mongoose.Schema({
    gpuNum: {
        type: Number,
        required: [true, "لطفا تعداد گرافیک سرویس خود را انتخاب کنید"],
    },
    framework: {
        type: Number,
        required: [true, "لطفا فریم وورک سرویس خود را انتخاب کنید"],
        trim: true
    },
    useTime: {
        type: Number,
        required: [true, "لطفا مدت اشتراک سرویس خود را انتخاب کنید"],
        trim: true,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    paid: {
        type: Boolean,
        required: true,
        default: false,
    },
    buyDate: {
        type: Date,
        required: false,
    },
    activateDate: {
        type: Date,
        required: false,
    },
    expireDate: {
        type: Date,
        required: false,
    },
    extensionInfo: {
        isExtension: {
            type: Boolean,
            required: true,
            default: false,
        },
        extensionOrigin: {
            type: String,
            required: false,
            ref: 'Bills',
        },
        extensionNumber: {
            type: Number,
            required: false,
        },
    },
    containerInfo: {
        subDomain: {
            type: String,
            required: false,
        },
        containerId: {
            type: String,
            required: false,
        },
        ip: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
    },
    serviceInfo: {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Service',
        },
        gpuModel: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 40,
            uppercase: true,
            trim: true
        },
        costPerGpu: {
            type: Number,
            required: true,
            min: 999,
            max: 999999999,
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
        isDisabled: {
            type: Boolean,
            required: true,
            default: false
        },
        isFree: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true })

billsSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


const Bills = mongoose.model('Bills', billsSchema)
module.exports = Bills