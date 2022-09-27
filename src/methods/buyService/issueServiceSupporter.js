const Bills = require('../../models/bills')
const Service = require('../../models/service')

const issueBuyFactor = async (req, res, next) => {
    try {

        if (!req.service) {
            return new Error(`این سرویس ناموجود است`)
        }
        var gpuNum = req.body.gpuNum
        var framework = req.body.framework
        var useTime = req.body.useTime
        if (!req.service.canCustomize) {
            gpuNum = req.service.gpuNum
            framework = req.service.framework
            useTime = req.service.useTime
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
                gpuModel: req.service.gpuModel,
                serviceId: req.service._id,
                os: req.service.os,
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
