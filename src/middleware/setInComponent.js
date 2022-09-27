const Component = require('../models/component')

const setInComponent = async (req, res, next) => {
    try {
        const component = await Component.findOne({ name: "main" })

        if (!component) {
            let newComponent = await new Component({
                name: "main",
                gpuModel: [{ name: req.body.gpuModel, number: 1 }],
                gpuNum: [{ name: req.body.gpuNum, number: 1 }],
                ram: [{ name: req.body.ram, number: 1 }],
                os: [{ name: req.body.os, number: 1 }],
                useTime: [{ name: req.body.useTime, number: 1 }],
                gpuNumMaxNumber: req.body.gpuNum,
                gpuNumMinNumber: req.body.gpuNum,
                ramMaxNumber: req.body.ram,
                ramMinNumber: req.body.ram,
                useTimeMaxNumber: req.body.useTime,
                useTimeMinNumber: req.body.useTime,
            })
            await newComponent.save()

            return

        } else {
            const gpuModel = component.gpuModel.map((e) => {
                if (req.body.gpuModel == e.name) {
                    e.number++;
                    return e
                }
            })
            const gpuNum = component.gpuNum.map((e) => {
                if (req.body.gpuNum < component.gpuNumMinNumber) {
                    component.gpuNumMinNumber = req.body.gpuNum;
                }
                if (req.body.gpuNum > component.gpuNumMaxNumber) {
                    component.gpuNumMaxNumber = req.body.gpuNum;
                }
                if (req.body.gpuNum == e.name) {
                    e.number++;
                    return e
                }
            })
            const ram = component.ram.map((e) => {
                if (req.body.ram < component.ramMinNumber) {
                    component.ramMinNumber = req.body.ram;
                }
                if (req.body.ram > component.ramMaxNumber) {
                    component.ramMaxNumber = req.body.ram;
                }
                if (req.body.ram == e.name) {
                    e.number++;
                    return e
                }
            })
            const os = component.os.map((e) => {
                if (req.body.os == e.name) {
                    e.number++;
                    return e
                }
            })
            const useTime = component.useTime.map((e) => {
                if (req.body.useTime < component.useTimeMinNumber) {
                    component.useTimeMinNumber = req.body.useTime;
                }
                if (req.body.useTime > component.useTimeMaxNumber) {
                    component.useTimeMaxNumber = req.body.useTime;
                }
                if (req.body.useTime == e.name) {
                    e.number++;
                    return e
                }
            })

            if (!gpuModel[gpuModel.length - 1]) component.gpuModel.push({ number: 1, name: req.body.gpuModel })
            if (!gpuNum[gpuNum.length - 1]) component.gpuNum.push({ number: 1, name: req.body.gpuNum })
            if (!ram[ram.length - 1]) component.ram.push({ number: 1, name: req.body.ram })
            if (!os[os.length - 1]) component.os.push({ number: 1, name: req.body.os })
            if (!useTime[useTime.length - 1]) component.useTime.push({ number: 1, name: req.body.useTime })
            // component.discount.push({ number: component.discount.number++, name: req.body.discount })
            await component.save()
            return
        }
    } catch (e) {
        return
    }
}

module.exports = setInComponent