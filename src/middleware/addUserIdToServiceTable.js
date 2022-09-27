const ServiceUsers = require('../models/serviceUsers')

const addUserIdToServiceTable = async (req, res, next) => {
    try {
        var service = req.service

        serviceUsers = new ServiceUsers({
            userId: req.user._id,
            gpuNum: req.body.gpuNum ?? req.bill.gpuNum,
            ssdStorage: Math.pow(2, Number(req.body.gpuNum ?? req.bill.gpuNum) - 1) * 128,
            framework: req.body.framework ?? req.bill.framework,
            ram: Math.pow(2, Number(req.body.gpuNum ?? req.bill.gpuNum) - 1) * 32,
            useTime: req.body.useTime ?? req.bill.useTime,
            performance: req.service.performancePerGpu * (req.body.gpuNum ?? req.bill.gpuNum),
            cost: req.service.costPerGpu * (req.body.useTime ?? req.bill.useTime) * (req.body.gpuNum ?? req.bill.gpuNum),
            serviceId: service._id,
            editVersion: service.editVersion,
        })
        await serviceUsers.save()

        return true
    } catch (e) {
        return false
    }
}

module.exports = addUserIdToServiceTable