const jwt = require('jsonwebtoken')
const SupporterUser = require('../models/supporterUser')

const supporterAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const supporterUser = await SupporterUser.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!supporterUser) {
            throw new Error()
        }
        req.token = token
        req.supporterUser = supporterUser
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = supporterAuth