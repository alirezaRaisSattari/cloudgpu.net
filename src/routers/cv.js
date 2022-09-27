const express = require('express')
const Cv = require('../models/cv')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')
const multer = require('multer')
var path = require('path')
const makeRoute = require('../methods/makeRoute')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "asatari1381@gmail.com",
        pass: 'yxvoywfejtqylpne'
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.text = req.body.text
        file.name = req.body.name
        file.email = req.body.email
        file.job = req.body.job
        cb(null, makeRoute.makeRoute())
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        cb(undefined, true)
    }
})

router.post('/cv/create', upload.single('avatar'), async (req, res) => {
    const cv = new Cv({
        file: req.file.filename,
        job: req.file.job,
        name: req.file.name,
        text: req.file.text,
        emailOrPhone: req.file.email,
    })

    if (String(req.file.email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
        const mailOptions = {
            to: `${req.file.email}`,
            subject: 'رزومه شما با موفقیت ثبت شد',
            text: "رزومه شما با موفقیت برای پشتیبان‌های ما ثبت شد و در اسرع وقت پاسخ داده خواهد شد."
        };
        transporter.sendMail(mailOptions)
    }

    cv.save()
    res.send(cv)
}, (error, req, res, next) => {
    res.status(500).send(errorHandler.status500(error.message))
})

router.get('/cv/get', supporterAuth, async (req, res) => {
    try {
        var cv = await Cv.find({})
        res.send(cv)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.post('/cv/seen', supporterAuth, async (req, res) => {
    try {
        await Cv.findByIdAndUpdate({ _id: req.body.id }, { isSeen: true })
        res.send({ msg: 'successful' })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.post('/cv/delete', supporterAuth, async (req, res) => {
    try {
        let cv = await Cv.findByIdAndDelete({ _id: req.body.id })
        if (!cv) {
            res.status(404).send(errorHandler.noText(e))
            return;
        }
        res.send({ msg: 'successful' })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router 