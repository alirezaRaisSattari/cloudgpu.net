const { smsIr } = require('./smsIr')

const otp = async (mobileNumber, randomNumber) => {
    const sms = new smsIr("i9oeNmdl2v9nHOGBWmZ2WEGGXUsh6Q8nIHwX7tWhhT3MA8UEnD4KyNgFgW6yPa2j", "30007732001499")
    sms.SendVerifyCode(mobileNumber, 520912, [{ name: "OTP", value: randomNumber }])
}
module.exports = otp
