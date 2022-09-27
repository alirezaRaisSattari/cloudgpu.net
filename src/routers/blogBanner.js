const express = require('express')
const BlogBanner = require('../models/blogBanner')
const errorHandler = require('../constants/apiErrors')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')
const makeRoute = require('../methods/makeRoute')
const multer = require('multer')
var path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.title = req.body.title
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

router.post('/blogBanner/create', supporterAuth, upload.single('avatar'), async (req, res) => {
    const blogBanner = new BlogBanner({
        title: req.file.title,
        file: req.file.filename,
        owner: req.supporterUser._id
    })

    blogBanner.save()
    res.send(blogBanner)
}, (error, req, res, next) => {
    res.status(500).send(errorHandler.status500(error.message))
})

router.get('/blogBanner/get', async (req, res) => {
    try {
        var blogBanner = await BlogBanner.find({})
        res.send(blogBanner)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.delete('/blogBanner/delete', supporterAuth, async (req, res) => {
    try {
        var blogBanner = await BlogBanner.findOneAndDelete({ _id: req.query.id })
        if (!blogBanner) {
            res.status(404).send(errorHandler.noBlogBanner(e))
            return;
        }
        res.send(blogBanner)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router;