const express = require('express')
const ContactUs = require('../models/contactUs')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "asatari1381@gmail.com",
        pass: 'yxvoywfejtqylpne'
    }
});

router.post('/contactUs/create', async (req, res) => {
    try {
        let { name, email, text, isSeen } = req.body
        const contactUs = new ContactUs({
            name, email, text, isSeen,
        })

        const mailOptions = {
            to: `${req.body.email}`,
            subject: 'نظر شما با موفقیت ثبت شد',
            text: "نظر شما با موفقیت برای پشتیبان‌های ما ثبت شد و در اسرع وقت پاسخ داده خواهد شد."
        };
        transporter.sendMail(mailOptions)

        await contactUs.save()
        res.status(201).send(contactUs)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/contactUs/get', supporterAuth, async (req, res) => {
    try {
        var contactUs = await ContactUs.find({})
        res.send(contactUs)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.post('/contactUs/seen', supporterAuth, async (req, res) => {
    try {
        await ContactUs.findByIdAndUpdate({ _id: req.body.id }, { isSeen: true })
        res.send({ msg: 'successful' })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})
router.delete('/contactUs/delete', supporterAuth, async (req, res) => {
    try {
        let contactUs = await ContactUs.findByIdAndDelete({ _id: req.body.id })
        if (!contactUs) {
            res.status(404).send(errorHandler.noText(e))
            return
        }
        res.send({ msg: 'successful' })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router