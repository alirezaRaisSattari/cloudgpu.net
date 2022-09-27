const express = require('express')
const Component = require('../models/component')
const errorHandler = require('../constants/apiErrors')
const auth = require('../middleware/auth')
const refreshComponent = require('../middleware/refreshComponent')
const router = new express.Router()

router.get('/component/get', async (req, res) => {
    try {
        const component = await Component.find({ name: 'main' })
        res.send(component)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/component/refresh', refreshComponent, async (req, res) => {
    try {
        res.send({ msg: "Ok" })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router 