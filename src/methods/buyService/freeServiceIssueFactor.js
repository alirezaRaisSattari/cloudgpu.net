const Bills = require('../../models/bills')
const Service = require('../../models/service')

const freeServiceIssueFactor = async (req, res, next) => {
    try {
        var bills = await Bills.findOne({ owner: req.user._id, _id: req.body.id })

        const service = await Service.findOne({ _id: req.body.serviceId })

        req.service = service

        var gpuNum = service.gpuNum
        var framework = service.framework
        var useTime = service.useTime

        bills = new Bills({
            paid: true,
            framework,
            useTime,
            gpuNum,
            serviceInfo: {
                costPerGpu: req.service.costPerGpu * req.body.useTime * gpuNum,
                performancePerGpu: req.service.performancePerGpu,
                isDisabled: false, isFree: false,
                gpuModel: service.gpuModel,
                serviceId: service._id,
                os: service.os,
                isFree: service.isFree,
            },
            extensionInfo: {
                isExtension: false,
                extensionOrigin: 1,
            },
            owner: req.user._id
        })

        req.bill = await bills.save()

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = freeServiceIssueFactor
