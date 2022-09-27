const express = require('express')
const router = new express.Router()
const Bills = require('../models/bills')
const Service = require('../models/service')
const Ticket = require('../models/ticket')
const User = require('../models/user')
const auth = require('../middleware/auth')
const supporterAuth = require('../middleware/supporterAuth')
const addUserIdToServiceTable = require('../middleware/addUserIdToServiceTable')
const checkExpire = require('../middleware/checkExpire')
const freeServiceIssueFactor = require('../methods/buyService/freeServiceIssueFactor')
const issueServiceSupporter = require('../methods/buyService/issueServiceSupporter')
const activateService = require('../methods/buyService/activateService')
const createContainer = require('../methods/buyService/createContainer')
const issueBuyFactor = require('../methods/buyService/issueBuyFactor')
const makeRoute = require('../methods/makeRoute')
const errorHandler = require('../constants/apiErrors')
const axios = require('axios');
const callExtensionContainer = (data) => new Promise((resolve, reject) => {
    data = JSON.stringify({ data })
    axios.post(`http://localhost:8000/rebuy`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error);
            reject(error)
        });
});

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


router.post('/userService/create', auth, async (req, res) => {
    try {
        let { paid, framework, useTime, gpuNum } = req.body
        let { serviceId, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu } = req.body.serviceInfo
        var expireDate = new Date()
        expireDate.setHours(expireDate.getHours() + 2);

        let service = Service.findOne({ _id: serviceId });
        if (service.isDisabled) {
            res.status(503).send({ msg: "این سرویس فعلا ناموجود است" })
            return
        }

        bills = new Bills({
            paid, expireDate, framework, useTime, gpuNum,
            serviceInfo: { serviceId, costPerGpu, isDisabled, isFree, gpuModel, os, performancePerGpu },
            owner: req.user._id
        })
        await bills.save()

        res.status(201).send(bills)
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/bill/get', auth, checkExpire, async (req, res) => {
    try {
        var bills = await Bills.find({ owner: req.user._id }, null, { skip: Number(req.query.skip) ?? 0, limit: Number(req.query.take) ?? null }).sort({ createdAt: 'desc' })

        var newDate = new Date()
        var timeDiffs = bills.map((bill) => {
            const diff = new Date(bill.expireDate) - newDate
            const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN, DYS = 24 * HRS
            const Hr = `${Math.floor(diff / HRS)}`
            const Min = `${Math.floor(diff / MIN)}`
            return { Hr, Min }
        })

        res.send({ bills, timeDiffs })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/myService', auth, checkExpire, async (req, res) => {
    try {
        var bills = await Bills.find({ owner: req.user._id, paid: true }, null, { skip: Number(req.query.skip) ?? 0, limit: Number(req.query.take) ?? null }).sort({ createdAt: 'desc' })

        var newDate = new Date()
        var timeDiffs = bills.map((bill) => {
            const diff = new Date(bill.expireDate) - newDate
            const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN, DYS = 24 * HRS
            const Hr = `${Math.floor(diff / HRS)}`
            const Min = `${Math.floor(diff / MIN)}`
            return { Hr, Min }
        })

        res.send({ bills, haveFreeService: req.user.haveFreeService, timeDiffs })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.get('/myService/supporter', supporterAuth, async (req, res) => {
    try {
        var bills = await Bills.find({ owner: req.query.id }).sort({ createdAt: 'desc' })

        var newDate = new Date()
        var timeDiffs = bills.map((bill) => {
            const diff = new Date(bill.expireDate) - newDate
            const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN, DYS = 24 * HRS
            const Hr = `${Math.floor(diff / HRS)}`
            const Min = `${Math.floor(diff / MIN)}`
            return { Hr, Min }
        })

        res.send({ bills, timeDiffs })
    } catch (e) {
        res.status(500).send(errorHandler.status500(e.message ?? e))
    }
})

router.post('/service/buy', auth, async (req, res) => {
    try {
        var bills = await Bills.findOne({ owner: req.user._id, _id: req.body.id })
        req.service = await Service.findOne({ _id: bills.serviceInfo.serviceId })

        let info = await getGpuInfo();

        var gpuNum = req.body.gpuNum
        if (!req.service.canCustomize) {
            gpuNum = req.service.gpu
        }
        if (gpuNum > info.data.Length || gpuNum > info.data.Max) {
            res.status(400).send({ msg: "این سرویس ناموجود است" })
            return
        }
        let newDate = new Date()
        let issueBuyFactorRes = await issueBuyFactor(req)
        if (!issueBuyFactorRes) {
            res.status(422).send({ msg: "خطا در ساخت فاکتور", })
            return
        }

        req.service.maximumGpus = info.data.Max
        req.service.freeGpus = info.data.Length

        if ((req.service.maximumGpus < req.service.gpuNum && !req.service.canCustomize) || req.service.maximumGpus == 0) {
            req.service.isDisabled = true
            await Service.findOneAndUpdate({ _id: req.service._id }, req.service)
            // console.log("not enough GPU available");
            // return false
        }

        if (!makeRoute.isWindows) {
            let createContainerRes = await createContainer(req)
            if (!createContainerRes.success) {
                const ticket = new Ticket({
                    title: "تیکت سرور : مشکل در ساخت کانتینر",
                    chat: { text: "لطفا لاگ های کانتینرو چک کن محمد." },
                    createdAt: newDate,
                    owner: req.user._id
                })
                await ticket.save()
                res.status(500).send({ msg: "با عرض پوزش سرور با مشکل مواجه شد. به زودی پشتیبان های ما مشکل شما را پیگیری کرده و به شما اطلاع میدهند.", developerErr: createContainerRes.error })
                return
            }
        }

        info = await getGpuInfo();
        req.service.maximumGpus = info.data.Max
        req.service.freeGpus = info.data.Length

        if ((req.service.maximumGpus < req.service.gpuNum && !req.service.canCustomize) || req.service.maximumGpus == 0) {
            req.service.isDisabled = true
            await Service.findOneAndUpdate({ _id: req.service._id }, req.service)
            // console.log("not enough GPU available");
            // return false
        }

        await Service.findOneAndUpdate({ _id: req.service._id }, req.service, { new: true })

        let activateServiceRes = await activateService(req)
        if (!activateServiceRes) {
            res.status(422).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        let addUserIdToServiceTableRes = await addUserIdToServiceTable(req)
        if (!addUserIdToServiceTableRes) {
            res.status(422).send({ msg: "خطا در اضافه کردن به کاربران سرویس" })
            return
        }

        res.status(201).send({ msg: "با موفقیت سرویس شما آماده شد." })
    } catch (e) {
        res.status(500).send({ msg: "خطا در برقراری ارتباط با سرور" })
    }
})

router.post('/service/activate/supporter', supporterAuth, async (req, res) => {
    try {
        var newDate = new Date()
        req.bill = await Bills.findOne({ owner: req.body.user._id, _id: req.body.billId })
        req.user = req.body.user
        req.service = await Service.findOne({ _id: req.bill.serviceInfo.serviceId })

        if (!req.service) {
            return new Error(`این سرویس ناموجود است`)
        }

        if (req.service.isDisabled) {
            return new Error(`این سرویس غیر فعال است`)
        }

        if (!makeRoute.isWindows) {
            let createContainerRes = await createContainer(req)
            if (!createContainerRes.success) {
                const ticket = new Ticket({
                    title: "تیکت سرور : مشکل در ساخت کانتینر",
                    chat: { text: "لطفا لاگ های کانتینرو چک کن محمد." },
                    createdAt: newDate,
                    owner: req.user._id
                })
                await ticket.save()
                res.status(500).send({ msg: "با عرض پوزش سرور با مشکل مواجه شد. به زودی پشتیبان های ما مشکل شما را پیگیری کرده و به شما اطلاع میدهند.", developerErr: createContainerRes.error })
                return
            }
        }

        let info = await getGpuInfo();
        req.service.maximumGpus = info.data.Max
        req.service.freeGpus = info.data.Length

        if ((req.service.maximumGpus < req.service.gpuNum && !req.service.canCustomize) || req.service.maximumGpus == 0) {
            req.service.isDisabled = true
            await Service.findOneAndUpdate({ _id: req.service._id }, req.service)
            const ticket = new Ticket({
                title: "تیکت سرور : gpu ها تموم شد",
                chat: { text: "گرافیکارو تموم شد" },
                createdAt: newDate,
                owner: req.user._id
            })
            await ticket.save()
        }

        await Service.findOneAndUpdate({ _id: req.service._id }, req.service)

        let activateServiceRes = await activateService(req)
        if (!activateServiceRes) {
            res.status(422).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        let addUserIdToServiceTableRes = await addUserIdToServiceTable(req)
        if (!addUserIdToServiceTableRes) {
            res.status(422).send({ msg: "خطا در اضافه کردن به کاربران سرویس" })
            return
        }

        res.status(201).send({ msg: "با موفقیت سرویس شما آماده شد." })
    } catch (e) {
        res.status(500).send({ msg: "خطا در برقراری ارتباط با سرور" })
    }
})

// router.post('/bills/extension', auth, async (req, res) => {
//     var bills = await Bills.findOne({ owner: req.user._id, _id: req.body.id })
//     console.log(bills);
//     console.log(bills.serviceInfo.serviceId);
//     const service = await Service.findOne({ _id: bills.serviceInfo.serviceId })
//     console.log(service);

//     if (bills.useTime < 24) {
//         res.status(404).send({ msg: "این سرویس ناموجود است." })
//         return
//     }

//     if (!service) {
//         res.status(404).send({ msg: "این سرویس ناموجود است." })
//         return
//     }

//     if (service.isDisabled || bills.gpuNum > service.maximumGpus) {
//         console.log(service.isDisabled, service.gpuNum, service.maximumGpus);
//         res.status(404).send({ msg: "این سرویس فعلا ناموجود است. لطفا بعدا تلاش کنید." })
//         return
//     }
//     console.log(11111);

//     if (bills.extensionInfo.extensionOrigin != "1") {
//         let Xbill = await Bills.findOne({ owner: req.user._id, 'extensionInfo.extensionOrigin': bills.extensionInfo.extensionOrigin, isExpired: false })

//         if (Xbill) {
//             res.status(422).send({ msg: "این سرویس قبلا تمدید شده است." })
//             return
//         }
//     }

//     let isExtensionExpired = await Bills.find({ owner: req.user._id, 'extensionInfo.extensionOrigin': bills.extensionInfo.extensionOrigin, isExpired: true })
//     console.log(22222);

//     let isExpire = isExtensionExpired.find(e => e.expireDate - (new Date() - (49 * 60 * 60 * 1000)) > 0);

//     if (bills.expireDate - (new Date() - (48 * 60 * 60 * 1000)) < 0 && !isExpire) {
//         res.status(422).send({ msg: "فقط تا 48 ساعت بعد از انقضای سرویس می توانید آنرا تمدید کنید." })
//         return
//     }

//     await callExtensionContainer({ Id: bills.containerInfo.containerId, ip: bills.containerInfo.ip })
//     var newDate = new Date()

//     console.log(33333);
//     let newBill = new Bills({
//         gpuNum: bills.gpuNum,
//         framework: bills.framework,
//         useTime: bills.useTime,
//         isExpired: false,
//         active: true,
//         paid: true,
//         buyDate: new Date(),
//         activateDate: new Date(),
//         expireDate: newDate.setTime(newDate.getTime() + (service.useTime * 60 * 60 * 1000)),
//         extensionInfo: {
//             isExtension: true,
//             extensionOrigin: bills.extensionInfo.isExtension ? bills.extensionInfo.extensionOrigin : bills._id,
//             extensionNumber: bills.extensionInfo.isExtension ? bills.extensionInfo.extensionNumber + 1 : 1,
//         },
//         containerInfo: {
//             subDomain: bills.containerInfo.subDomain,
//             containerId: bills.containerInfo.containerId,
//             ip: bills.containerInfo.ip,
//             password: bills.containerInfo.password,
//         },
//         serviceInfo: {
//             serviceId: bills.serviceInfo.serviceId,
//             gpuModel: bills.serviceInfo.gpuModel,
//             costPerGpu: service.costPerGpu,
//             os: bills.serviceInfo.os,
//             performancePerGpu: service.performancePerGpu,
//             isDisabled: service.isDisabled,
//             isFree: false,
//         },
//         owner: req.user._id,
//     })
//     await newBill.save()
//     console.log(44444);

//     res.status(201).send({ msg: "با موفقیت سرویس شما آماده شد." })
//     return
// })

router.post('/freeService/buy', auth, async (req, res) => {
    try {
        if (req.user.haveFreeService) {
            res.status(500).send({ msg: "فقط یک سرویس رایگان میتوانید داشته باشید.!" })
            return
        }

        let newDate = new Date()

        let freeServiceIssueFactorRes = await freeServiceIssueFactor(req)
        if (!freeServiceIssueFactorRes) {
            res.status(500).send({ msg: "خطا در ساخت فاکتور" })
            return
        }

        req.user.haveFreeService = true
        const user = await User.findOneAndUpdate({ _id: req.user._id }, req.user, { new: true });

        if (!makeRoute.isWindows) {
            let createContainerRes = await createContainer(req)
            if (!createContainerRes) {
                const ticket = new Ticket({
                    title: "تیکت سرور : مشکل در ساخت کانتینر",
                    chat: { text: "لطفا لاگ های کانتینرو چک کن محمد." },
                    createdAt: newDate,
                    owner: req.user._id
                })
                await ticket.save()
                res.status(500).send({ msg: "با عرض پوزش سرور با مشکل مواجه شد. به زودی پشتیبان های ما مشکل شما را پیگیری کرده و به شما اطلاع میدهند." })
                return
            }
        }

        let info = await getGpuInfo();
        req.service.maximumGpus = info.data.Max
        req.service.freeGpus = info.data.Length

        if ((req.service.maximumGpus < req.service.gpuNum && !req.service.canCustomize) || req.service.maximumGpus == 0) {
            req.service.isDisabled = true
            await Service.findOneAndUpdate({ _id: req.service._id }, req.service)
            // console.log("not enough GPU available");
            // return false
        }

        await Service.findOneAndUpdate({ _id: req.service._id }, req.service)

        let activateServiceRes = await activateService(req)
        if (!activateServiceRes) {
            res.status(500).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        let addUserIdToServiceTableRes = await addUserIdToServiceTable(req)
        if (!addUserIdToServiceTableRes) {
            res.status(500).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        res.status(201).send({ msg: "با موفقیت سرویس شما آماده شد." })
    } catch (e) {
        res.status(500).send({ msg: "خطا در برقراری ارتباط با سرور" })
    }
})

router.post('/service/buy/supporter', supporterAuth, async (req, res) => {
    try {
        let newDate = new Date()

        req.user = req.body.userInfo

        let issueServiceSupporterRes = await issueServiceSupporter(req)
        if (!issueServiceSupporterRes) {
            res.status(500).send({ msg: "خطا در ساخت فاکتور" })
            return
        }

        if (!makeRoute.isWindows) {
            let createContainerRes = await createContainer(req)
            if (!createContainerRes) {
                const ticket = new Ticket({
                    title: "تیکت سرور : مشکل در ساخت کانتینر",
                    chat: { text: "لطفا لاگ های کانتینرو چک کن محمد." },
                    createdAt: newDate,
                    owner: req.user._id
                })
                await ticket.save()
                res.status(500).send({ msg: "با عرض پوزش سرور با مشکل مواجه شد. به زودی پشتیبان های ما مشکل شما را پیگیری کرده و به شما اطلاع میدهند." })
                return
            }
        }

        let info = await getGpuInfo();
        req.service.maximumGpus = info.data.Max
        req.service.freeGpus = info.data.Length

        if ((req.service.maximumGpus < req.service.gpuNum && !req.service.canCustomize) || req.service.maximumGpus == 0) {
            req.service.isDisabled = true
            await Service.findOneAndUpdate({ _id: req.service._id }, req.service)
            // console.log("not enough GPU available");
            // return false
        }

        await Service.findOneAndUpdate({ _id: req.service._id }, req.service)

        let activateServiceRes = await activateService(req)
        if (!activateServiceRes) {
            res.status(500).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        let addUserIdToServiceTableRes = await addUserIdToServiceTable(req)
        if (!addUserIdToServiceTableRes) {
            res.status(500).send({ msg: "خطا در فعال سازی سرویس" })
            return
        }

        res.status(201).send({ msg: "با موفقیت سرویس شما آماده شد." })
    } catch (e) {
        res.status(500).send({ msg: "خطا در برقراری ارتباط با سرور" })
    }
})

module.exports = router

