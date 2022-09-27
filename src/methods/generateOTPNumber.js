const User = require('../models/user')

const generateOTPNumber = async (user) => {
    let generateOTPNumber = parseInt(Math.random() * 89999 + 10000)

    user.otp.otp = generateOTPNumber
    user.otp.otpDate = new Date() + (70 * 1000)

    await User.findOneAndUpdate({ _id: user._id }, user)

    return generateOTPNumber.toString()
}
module.exports = generateOTPNumber
