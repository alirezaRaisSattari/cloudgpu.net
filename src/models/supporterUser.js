const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Task = require('./task')


const supporterUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    access: {
        accessAddSupporter: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
        accessServices: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
        accessFaq: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
        accessTicket: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
        accessCv: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
        accessContactUs: {
            type: Boolean,
            required: true,
            trim: true,
            default: false
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// userSchema.virtual('faq', {
//     ref: 'Faq',
//     localField: '_id',
//     foreignField: 'owner'
// })

// userSchema.virtual('blog', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'owner'
// })

supporterUserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

supporterUserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

supporterUserSchema.statics.findByCredentials = async (username, password) => {
    const user = await SupporterUser.findOne({ username })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('wrong password')
    }

    return user
}

// Hash the plain text password before saving
supporterUserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
supporterUserSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const SupporterUser = mongoose.model('SupporterUser', supporterUserSchema)

module.exports = SupporterUser