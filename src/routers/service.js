const express = require('express')
const Service = require('../models/service')
const errorHandler = require('../constants/apiErrors')
const supporterAuth = require('../middleware/supporterAuth')
const deleteService = require('../middleware/deleteService')
const refreshComponent = require('../middleware/refreshComponent')
const router = new express.Router()
const axios = require('axios')

const getGpuInfo = () => new Promise(async (resolve, reject) => {
    axios.get(`http://localhost:8000/info`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        resolve(res)
    }).catch(error => {
        reject(error)
    });
})


router.post('/service/create', supporterAuth, async (req, res) => {
    try {
        let gpuInfo = await getGpuInfo();
        let { Max, Length } = await gpuInfo.data;
        let maximumGpus = Max
        let freeGpus = Length

        let { gpuModel, os, performancePerGpu, discount, gpuNum, ssdStorage, framework, cpuCoreNumber, ram, useTime, costPerGpu, isFree, canCustomize } = req.body

        const service = new Service({
            os, performancePerGpu, discount, freeGpus, maximumGpus, gpuNum, ssdStorage, framework, cpuCoreNumber, ram, useTime: isFree ? 1 : useTime, costPerGpu, isFree, canCustomize,
            gpuModel: gpuModel.toUpperCase()
        })

        await service.save()
        refreshComponent(req, res)
        res.status(201).send(service)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.delete('/service/delete', supporterAuth, async (req, res) => {
    try {
        var service = await Service.findOne({ _id: req.query.id })
        if (!service) {
            res.status(404).send(errorHandler.noService())
            return;
        }

        service.isDisabled = true

        // set time of delete
        var dateTime = new Date()
        dateTime.setTime(dateTime.getTime() + service.useTime * 3600000)
        service.deleteTime = dateTime

        await Service.findOneAndUpdate({ _id: req.query.id }, service);

        res.status(201).send(service)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.post('/service/edit', supporterAuth, async (req, res) => {
    try {
        var service = await Service.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        if (!service) {
            res.status(404).send(errorHandler.noService())
            return;
        }
        if (service.users.length <= service.maximumGpus) service.isDisabled = false;
        service.save()
        refreshComponent(req, res)
        res.status(201).send(service)
    } catch (e) {
        res.status(400).send(errorHandler.status500(e))
    }
})

router.get('/service/getFreeService', deleteService, async (req, res) => {
    try {
        var service = await Service.findOne({
            isFree: true,
        })
        if (!service) {
            res.send(errorHandler.noFreeService())
            return
        }

        let info = await getGpuInfo();
        service.isDisabled = info.data.Max == 0 ? true : false;
        if (info.data.Length != service.freeGpus) {
            service.maximumGpus = info.data.Max
            service.freeGpus = info.data.Length
            await Service.findOneAndUpdate({ _id: service._id }, service, { new: true })
        }

        res.send({ service })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

router.get('/service/get', deleteService, async (req, res) => {
    try {
        if (req.query.gpuSelectionTxt) req.query.gpuSelectionTxt = req.query.gpuSelectionTxt.split(",")
        if (req.query.osSelectionTxt) req.query.osSelectionTxt = req.query.osSelectionTxt.split(",")
        let gpuSelectionTxt = req.query.gpuSelectionTxt ?? { $gte: '' };
        let osSelectionTxt = req.query.osSelectionTxt ?? { $gte: '' };
        let forSupporterTxt = !!req.query.forSupporter ? { $ne: undefined } : false;
        if (typeof req.query.gpuSelectionTxt == "object") gpuSelectionTxt = { $in: req.query.gpuSelectionTxt };
        if (typeof req.query.osSelectionTxt == "object") osSelectionTxt = { $in: req.query.osSelectionTxt };
        let minUseTime = req.query.minUseTime ?? 0;
        let maxUseTime = req.query.maxUseTime ?? 99999;
        let minGpuNum = req.query.minGpuNum ?? 0;
        let maxGpuNum = req.query.maxGpuNum ?? 99999;
        let minRam = req.query.minRam ?? 0;
        let maxRam = req.query.maxRam ?? 99999;
        minUseTime--

        var service = await Service.find({
            isFree: forSupporterTxt,
            gpuModel: gpuSelectionTxt,
            os: osSelectionTxt,
            ram: { $lte: maxRam, $gte: minRam },
            gpuNum: { $lte: maxGpuNum, $gte: minGpuNum },
            useTime: { $lte: maxUseTime, $gte: minUseTime },
        }, null, { skip: Number(req.query.skip) ?? 0, limit: Number(req.query.take) ?? null })

        let info = await getGpuInfo();
        service.forEach(async (service) => {
            service.isDisabled = info.data.Max == 0 ? true : false;
            if (info.data.Length != service.freeGpus) {
                service.maximumGpus = info.data.Max
                service.freeGpus = info.data.Length
                await Service.findOneAndUpdate({ _id: service._id }, service, { new: true })
            }
        })

        res.send({ service })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e))
    }
})

module.exports = router 