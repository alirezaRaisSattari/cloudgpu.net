const express = require('express')
const Category = require('../models/category')
const errorHandler = require('../constants/apiErrors')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')

router.post('/category/create', supporterAuth, async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
        })
        await category.save()
        res.status(201).send(category)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/category/title/get', async (req, res) => {
    try {
        var category = await Category.find()
        res.status(201).send(category)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/category/get', async (req, res) => {
    try {
        var blog = await Category.find()
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router