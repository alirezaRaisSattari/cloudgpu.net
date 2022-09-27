const Bills = require('../models/bills')
const ServiceUsers = require('../models/serviceUsers')
const Service = require('../models/service')
const axios = require('axios');

const checkExpire = async (req, res, next) => {
    try {
        var bills = await Bills.find({ owner: req.user._id })

        if (!bills) {
            next();
            return
        }
        bills = bills.filter(e => e.expireDate - new Date() >= 0 || e.paid)

        for (let i = 0; i < bills.length; i++) {
            if (bills[i].expireDate - new Date() < 0 && bills[i].paid && !bills[i].isExpired) {
                await ServiceUsers.findOneAndDelete({ _id: bills[i].serviceInfo.serviceId, userId: req.user._id })
                var service = await Service.findOne({ _id: bills[i].serviceInfo.serviceId })

                if (!service) continue; // if service deleted

                bills[i].isExpired = true;
                bills[i] = await Bills.findOneAndUpdate({ _id: bills[i]._id }, bills[i], { new: true })
            }
        }
        next();
    } catch (e) {
        res.status(409).send(e)
    }
}

module.exports = checkExpire