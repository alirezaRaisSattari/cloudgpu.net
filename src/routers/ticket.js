const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const supporterAuth = require('../middleware/supporterAuth')
const errorHandler = require('../constants/apiErrors')
const Ticket = require('../models/ticket')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "asatari1381@gmail.com",
        pass: 'yxvoywfejtqylpne'
    }
});

router.post('/ticket/create', auth, async (req, res) => {
    try {
        let { title, isSupporterSeen, isUserSeen, chat } = req.body
        let { supporterName, text, createdAt } = chat

        const ticket = new Ticket({
            title, isSupporterSeen, isUserSeen, chat: { supporterName, text, createdAt },
            owner: req.user._id
        })

        const mailOptions = {
            to: `${req.user.email}`,
            subject: 'تیکت شما با موفقیت ثبت شد',
            text: "تیکت شما با موفقیت برای پشتیبان‌های ما ثبت شد و در اسرع وقت پاسخ داده خواهد شد."
        };
        transporter.sendMail(mailOptions)

        await ticket.save()
        res.status(201).send(ticket)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/ticket/get', auth, async (req, res) => {
    try {
        var ticket = await Ticket.find({ owner: req.user._id }, null, { skip: Number(req.query.skip) ?? 0, limit: Number(req.query.take) ?? null }).sort({ updatedAt: 'desc' })
        ticket = ticket.map(e => {
            return { title: e.title, issue: e.issue, isAnswered: (e.chat.length > 1), createdAt: e.createdAt, isSeen: e.isUserSeen, _id: e._id }
        })

        res.send(ticket)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/ticket/chat/get', auth, async (req, res) => {
    try {
        var ticket = await Ticket.findOne({ _id: req.query.id })

        if (!ticket.isUserSeen) {
            ticket.isUserSeen = true;
            await Ticket.findOneAndUpdate({ _id: req.query.id }, ticket);
        }
        res.send(ticket.chat)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/ticket/chat/post', auth, async (req, res) => {
    try {
        var ticket = await Ticket.findOne({ _id: req.query.id })
        ticket.isSupporterSeen = false
        ticket.chat.push({ text: req.body.text })
        await Ticket.findOneAndUpdate({ _id: req.query.id }, ticket);

        res.send(ticket.chat)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/ticket/getAll', supporterAuth, async (req, res) => {
    try {
        var ticket = await Ticket.find({})
        ticket = ticket.map(e => {
            return { title: e.title, issue: e.issue, isAnswered: (e.chat.length > 1), createdAt: e.createdAt, isSeen: e.isSupporterSeen, _id: e._id }
        })

        res.send(ticket)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/ticket/chat/supporter/get', supporterAuth, async (req, res) => {
    try {
        var ticket = await Ticket.findOne({ _id: req.query.id })

        if (!ticket.isSupporterSeen) {
            ticket.isSupporterSeen = true;
            await Ticket.findOneAndUpdate({ _id: req.query.id }, ticket);
        }
        res.send(ticket.chat)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/ticket/chat/supporter/post', supporterAuth, async (req, res) => {
    try {
        var ticket = await Ticket.findOne({ _id: req.query.id })
        ticket.isUserSeen = false
        ticket.chat.push({ text: req.body.text, supporterName: req.body.supporterName })
        await Ticket.findOneAndUpdate({ _id: req.query.id }, ticket);

        res.send(ticket.chat)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

module.exports = router 