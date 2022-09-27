const Component = require('../models/component')
const Service = require('../models/service')

const refreshComponent = async (req, res, next) => {
    try {
        const component = await Component.findOne({ name: "main" })
        const service = await Service.find({})

        if (!component) {
            let newComponent = await new Component({
                name: "main",
                gpuModel: [{ name: service[0].gpuModel, number: 1 }],
                gpuNum: [{ name: service[0].gpuNum, number: 1 }],
                ram: [{ name: service[0].ram, number: 1 }],
                os: [{ name: service[0].os, number: 1 }],
                useTime: [{ name: service[0].useTime, number: 1 }],
                gpuNumMaxNumber: service[0].gpuNum,
                gpuNumMinNumber: service[0].gpuNum,
                ramMaxNumber: service[0].ram,
                ramMinNumber: service[0].ram,
                useTimeMaxNumber: service[0].useTime,
                useTimeMinNumber: service[0].useTime,
            })
            await newComponent.save()

            return

        } else {
            // clear component
            component.gpuModel = []
            component.gpuNum = []
            component.ram = []
            component.os = []
            component.useTime = []
            component.gpuNumMaxNumber = service[0].gpuNum
            component.gpuNumMinNumber = service[0].gpuNum
            component.ramMaxNumber = service[0].ram
            component.ramMinNumber = service[0].ram
            component.useTimeMaxNumber = service[0].useTime
            component.useTimeMinNumber = service[0].useTime
            //

            service.forEach(serviceItem => {
                if (serviceItem.isFree) return;

                let gpuModelModified = false
                let osModified = false
                let gpuNumModified = false
                let ramModified = false
                let useTimeModified = false

                component.gpuModel.forEach((e) => {
                    if (serviceItem.gpuModel == e.name) {
                        e.number++;
                        gpuModelModified = true
                        return e
                    }
                })
                component.os.forEach((e) => {
                    if (serviceItem.os == e.name) {
                        e.number++;
                        osModified = true
                        return e
                    }
                })
                component.gpuNum.forEach((e) => {
                    if (serviceItem.gpuNum < component.gpuNumMinNumber) {
                        component.gpuNumMinNumber = serviceItem.gpuNum;
                    }
                    if (serviceItem.gpuNum > component.gpuNumMaxNumber) {
                        component.gpuNumMaxNumber = serviceItem.gpuNum;
                    }
                    if (serviceItem.gpuNum == e.name) {
                        e.number++;
                        gpuNumModified = true
                        return e
                    }
                })
                component.ram.forEach((e) => {
                    if (serviceItem.ram < component.ramMinNumber) {
                        component.ramMinNumber = serviceItem.ram;
                    }
                    if (serviceItem.ram > component.ramMaxNumber) {
                        component.ramMaxNumber = serviceItem.ram;
                    }
                    if (serviceItem.ram == e.name) {
                        e.number++;
                        ramModified = true
                        return e
                    }
                })
                component.useTime.forEach((e) => {
                    if (serviceItem.useTime < component.useTimeMinNumber) {
                        component.useTimeMinNumber = serviceItem.useTime;
                    }
                    if (serviceItem.useTime > component.useTimeMaxNumber) {
                        component.useTimeMaxNumber = serviceItem.useTime;
                    }
                    if (serviceItem.useTime == e.name) {
                        e.number++;
                        useTimeModified = true
                        return e
                    }
                })

                if (!gpuModelModified) component.gpuModel.push({ number: 1, name: serviceItem.gpuModel })
                if (!osModified) component.os.push({ number: 1, name: serviceItem.os })
                if (!gpuNumModified) component.gpuNum.push({ number: 1, name: serviceItem.gpuNum })
                if (!ramModified) component.ram.push({ number: 1, name: serviceItem.gpuNum })
                if (!useTimeModified) component.useTime.push({ number: 1, name: serviceItem.useTime })
                // component.discount.push({ number: component.discount.number++, name: serviceItem.discount })
            });
            await component.save()

        }
    } catch (e) {
        throw Error
    }
}

module.exports = refreshComponent;