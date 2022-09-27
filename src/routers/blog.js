const express = require('express')
const Blog = require('../models/blog')
const router = new express.Router()
const supporterAuth = require('../middleware/supporterAuth')
const errorHandler = require('../constants/apiErrors')
const multer = require('multer')
const makeRoute = require('../methods/makeRoute')
var path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.id = req.body.id
        cb(null, makeRoute.makeRoute())
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        cb(undefined, true)
    }
})

router.post('/blog/addCover', supporterAuth, upload.single('avatar'), async (req, res) => {
    var blog = await Blog.findOne({ _id: req.file.id })
    blog.coverImg = req.file.filename
    await Blog.findOneAndUpdate({ _id: req.file.id }, blog);
    res.send(blog)
}, (error, req, res, next) => {
    res.status(500).send(errorHandler.status500(error.message))
})

router.post('/blog/create', supporterAuth, async (req, res) => {
    try {
        const blog = new Blog({
            title: req.body.title,
            text: req.body.text,
            isInFaq: req.body.isInFaq,
            category: req.body.category,
            owner: req.supporterUser._id
        })
        await blog.save()
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/blog/get', async (req, res) => {
    try {
        var blog = await Blog.findOne({ _id: req.query.id })
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/blog/delete', async (req, res) => {
    try {
        var blog = await Blog.findOneAndDelete({ _id: req.query.id })
        if (!blog) {
            res.status(404).send(errorHandler.noBlog())
            return;
        }
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/blog/getCovers', async (req, res) => {
    try {
        var blog = await Blog.find()
        var count
        blog = blog.map(e => {
            return { id: e._id, title: e.title, category: e.category, coverImg: e.coverImg }
        })
        await Blog.estimatedDocumentCount({}, function (err, Count) {
            count = Count;
        })
        res.status(201).send({ count, blog })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/blog/getCoversByCategory', async (req, res) => {
    try {
        if (req.query.category == "default") req.query.category = "جدیدترین تغییرات"
        var blog = await Blog.find({ category: req.query.category })

        blog = blog.map(e => {
            return { id: e._id, title: e.title, category: e.category, coverImg: e.coverImg }
        })
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/blog/getCover/highlight', async (req, res) => {
    try {
        var blog = await Blog.find({ isInFaq: true })

        blog = blog.map(e => {
            return { id: e._id, title: e.title, category: e.category, coverImg: e.coverImg }
        })
        res.status(201).send(blog)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router