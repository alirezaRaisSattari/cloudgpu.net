const express = require('express')
const User = require('../models/supporterUser')
const errorHandler = require('../constants/apiErrors')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/supporterUser/register/admin', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/supporterUser/addSupporter', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/supporterUser/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/supporterUser/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({ msg: "successfully" })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/supporterUser/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/supporterUser/changeInfo', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });
        res.send({ name: user.name, email: user.email, number: user.number, field: user.field })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/supporterUser/changePassword', auth, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.user.email, req.body.password)
        user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });
        res.send(user.password)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.delete('/supporterUser/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

module.exports = router