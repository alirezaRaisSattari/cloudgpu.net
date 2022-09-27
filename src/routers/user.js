const express = require('express')
const User = require('../models/user')
const errorHandler = require('../constants/apiErrors')
const auth = require('../middleware/auth')
const otp = require('../methods/otp')
const generateOTPNumber = require('../methods/generateOTPNumber')
const passwordGenerator = require('../methods/passwordGenerator')
const router = new express.Router()
const nodemailer = require('nodemailer')
const supporterAuth = require('../middleware/supporterAuth')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "asatari1381@gmail.com",
        pass: 'yxvoywfejtqylpne'
    }
});

router.post('/users/register', async (req, res) => {
    try {
        const exist = await User.findOne({ email: req.body.email })
        if (exist) {
            res.status(400).send(errorHandler.duplicatedEmail())
            return;
        }
        const user = new User(req.body)

        await user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/users/login', async (req, res) => {
    var user
    if (req.body.emailOrNumber.includes("@")) {
        try {
            user = await User.findByEmail(req.body.emailOrNumber, req.body.password)
        } catch (e) {
            res.status(400).send(errorHandler.noPasswordOrUser(e.toString().split(":")[1]))
            return;
        }
    } else if (await (req.body.emailOrNumber).toLowerCase().match(/^(\+98|0098|98|0)?9\d{9}$/)) {
        try {
            user = await User.findByNumber(req.body.emailOrNumber, req.body.password)
        } catch (e) {
            res.status(400).send(errorHandler.noPasswordOrUser(e.toString().split(":")[1]))
            return;
        }
    } else {
        res.status(400).send(errorHandler.invalidInput())
        return
    }
    try {
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({ msg: "با موفقیت انجام شد" })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ msg: "successful" })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/user/getAll', supporterAuth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/findNumber', async (req, res) => {
    try {
        const user = await User.findOne({ number: req.body.number })
        if (!user)
            res.send({ available: !!user })
        else
            res.send({ available: !!user, id: user._id ?? null, number: user.number ?? null })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/findEmail', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        res.send({ available: !!user })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/findUser/number', async (req, res) => {
    try {
        const user = await User.findOne({ number: req.body.number })
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/user/changeInfo', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });
        if (!user) {
            res.status(404).send(errorHandler.noUser(e.message ?? e))
            return
        }
        res.send({ name: user.name, email: user.email, number: user.number, field: user.field })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/user/changePassword', auth, async (req, res) => {
    try {
        const user = await User.findByEmail(req.user.email, req.body.oldPassword)
        if (!user) {
            res.status(404).send(errorHandler.noUser(e.message ?? e))
            return
        }
        user.password = req.body.password
        user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/user/forgetPassword', auth, async (req, res) => {
    try {
        var user = await User.findOne({ _id: req.user._id });
        var password = passwordGenerator()
        user.password = password
        user.save()
        const mailOptions = {
            to: `${req.user.email}`,
            subject: 'رمز یکبار مصرف',
            text: `می باشد ${password}رمز یکبار مصرف شما .`
        };
        transporter.sendMail(mailOptions)
        res.send(user)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/user/otp/get', async (req, res) => {
    try {
        req.user = await User.findOne({ _id: req.query.id })
        if (req.user.otp.otpDate - new Date() + (2 * 60 * 1000) > 0) {
            res.status(400).send({ msg: "لطفا کمی صبر کنید و سپس دوباره تلاش کنید.", msgHead: "اشتباه" })
            return;
        }
        else {
            let otpNumber = generateOTPNumber(req.user)
            otpNumber = await otpNumber
            otp(req.query.number, await otpNumber.toString())
        }

        res.send({ msg: "با موفقیت ارسال شد" })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/user/otp/verify', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.id })

        if (req.body.otp != user.otp.otp) {
            res.status(400).send({ msg: "کد پیامکی وارد شده اشتباه است.", msgHead: "اشتباه" })
            return;
        }
        else if (user.otp.otpDate - new Date() + (3 * 60 * 1000) < 0) {
            res.status(400).send({ msg: "کد پیامکی شما منقضی شده است.", msgHead: "اشتباه" })
            return;
        }
        else {
            const token = await user.generateAuthToken()
            res.send({ msg: "با موفقیت.", msgHead: "موفق", token, user })
        }
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

module.exports = router