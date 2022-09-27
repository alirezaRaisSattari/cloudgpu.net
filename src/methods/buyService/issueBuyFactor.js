const Bills = require('../../models/bills')
const Service = require('../../models/service')

const issueBuyFactor = async (req, res, next) => {
    try {
        var newDate = new Date()
        var bills = await Bills.findOne({ owner: req.user._id, _id: req.body.id })
        const service = await Service.findOne({ _id: bills.serviceInfo.serviceId })

        if (!service) {
            return new Error(`این سرویس ناموجود است`)
        }

        req.service = service
        await Bills.findOneAndDelete({ owner: req.user._id, _id: req.body.id })

        var gpuNum = req.body.gpuNum
        var framework = req.body.framework
        var useTime = req.body.useTime
        if (!service.canCustomize) {
            gpuNum = service.gpuNum
            framework = service.framework
            useTime = service.useTime
        }

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

module.exports = issueBuyFactor
