const Component = require('../models/component')
const Service = require('../models/service')

const removeFromComponent = async (req, res, next) => {
    try {
        const component = await Component.findOne({ name: "main" })
        var service = await Service.findOne({ _id: req.body.id })
        var gpuModelIndex = component.gpuModel.findIndex(e => {
            if (service.gpuModel == e.name) {
                e.number--;
                return !e.number
            }
        })
        if (gpuModelIndex != -1) component.gpuModel.splice(gpuModelIndex, 1)

        var gpuNumIndex = component.gpuNum.findIndex(e => {
            if (service.gpuNum == e.name) {
                e.number--;
                return !e.number
            }
        })
        if (gpuNumIndex != -1) component.gpuNum.splice(gpuNumIndex, 1)

        var ramIndex = component.ram.findIndex(e => {
            if (service.ram == e.name) {
                e.number--;
                return !e.number
            }
        })
        if (ramIndex != -1) component.ram.splice(ramIndex, 1)

        var osIndex = component.os.findIndex(e => {
            if (service.os == e.name) {
                e.number--;
                return !e.number
            }
        })
        if (osIndex != -1) component.os.splice(osIndex, 1)

        var useTimeIndex = component.useTime.findIndex(e => {
            if (service.useTime == e.name) {
                e.number--;
                return !e.number
            }
        })
        if (useTimeIndex != -1) component.useTime.splice(useTimeIndex, 1)

        await component.save()
        next()
        return
    } catch (e) {
        next()
        return
    }
}

module.exports = removeFromComponent