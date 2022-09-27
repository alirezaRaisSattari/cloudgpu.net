const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    field: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid Email')
            }
        }
    },
    number: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
        //validate
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    otp: {
        otp: {
            type: String,
        },
        otpDate: {
            type: Date,
        }
    },
    boughtServiceNumber: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    activeServiceNumber: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    totalPaidValue: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    wallet: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    haveFreeService: {
        type: Boolean,
        required: true,
        default: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('userServices', {
    ref: 'UserService',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('ticket', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.otp

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByEmail = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('کاربری با این ایمیل یا شماره موبایل ثبت نشده')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است')
    }

    return user
}

userSchema.statics.findByNumber = async (number, password) => {
    const user = await User.findOne({ number })
    if (!user) {
        throw new Error('کاربری با این ایمیل یا شماره موبایل ثبت نشده')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User