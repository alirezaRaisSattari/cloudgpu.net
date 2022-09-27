const express = require('express')
const Faq = require('../models/faq')
const errorHandler = require('../constants/apiErrors')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')

router.post('/faq/title/create', supporterAuth, async (req, res) => {
    try {
        const faq = new Faq({
            title: req.body.title,
            owner: req.supporterUser._id
        })

        await faq.save()
        res.status(201).send(faq)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.post('/faq/question/create', supporterAuth, async (req, res) => {
    try {
        var faq = await Faq.findOne({ _id: req.query.id })
        faq.question.push({
            title: req.body.title, answer: req.body.answer, starred: req.body.starred
        })

        await Faq.findOneAndUpdate({ _id: req.query.id }, faq);

        res.status(201).send(faq)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/faq/titles/get', async (req, res) => {
    try {
        const faq = await Faq.find()
        let response = faq.map(e => {
            return { title: e.title, id: e._id }
        })

        res.send(response)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/faq/questions/get', async (req, res) => {
    try {
        var faq = await Faq.findOne({ _id: req.query.id })

        res.send(faq)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/faq/questions/starred/get', async (req, res) => {
    try {
        var faq = await Faq.find()
        let faqRes = faq.map((e) => e.question.filter((e) => e.starred))
        faqRes = [].concat.apply([], faqRes);
        res.send(faqRes)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.delete('/faq/title/delete', supporterAuth, async (req, res) => {
    try {
        var faq = await Faq.findOneAndDelete({ _id: req.query.id })
        if (!faq) {
            res.status(404).send(errorHandler.status500(e))
            return
        }
        res.send(faq)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.delete('/faq/question/delete', supporterAuth, async (req, res) => {
    try {
        var faq = await Faq.findOne({ _id: req.query.titleId })
        if (!faq) {
            res.status(404).send(errorHandler.status500(e))
            return
        }
        let index = faq.question.findIndex(e => req.query.questionId == e._id)
        faq.question.splice(index, 1)
        await Faq.findOneAndUpdate({ _id: req.query.titleId }, faq)
        res.send(faq)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router