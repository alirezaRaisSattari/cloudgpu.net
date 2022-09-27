const Bills = require('../../models/bills')

const activateService = async (req, res, next) => {
    try {
        setTimeout(async () => {
            var newDate = new Date()
            var bills = await Bills.findOne({ _id: req.bill._id })

            const services = req.service
            bills.activateDate = newDate
            bills.expireDate = bills.serviceInfo.isFree ? newDate.setTime(newDate.getTime() + (12 * 60 * 1000)) : newDate.setTime(newDate.getTime() + (((req.body.useTime ?? req.bill.useTime) * 60) + 9) * 60 * 1000)
            bills.active = true

            await Bills.findOneAndUpdate({ _id: req.bill._id }, bills);
        }, 60000);
        
        return true
    } catch (e) {
        return false
    }
}

module.exports = activateService
