const UserService = require('../../models/bills')
const passwordGenerator = require('../passwordGenerator')
const connectW2C = require('./connectW2C')
const axios = require('axios');
const nodemailer = require('nodemailer');
const { application } = require('express');
const Bills = require('../../models/bills')
const cdnProvider = require('../cdnProvider');
const Ticket = require('../../models/ticket')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "asatari1381@gmail.com",
        pass: 'yxvoywfejtqylpne'
    }
});

const callManager = (gpuNum) => new Promise((resolve, reject) => {
    axios.get(`http://localhost:8000?count=${gpuNum}`)
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error);
            reject(error)
        });
});

const callCreateContainer = (data) => new Promise((resolve, reject) => {
    console.log("data for create container", data);
    data = JSON.stringify({ data })
    axios.post(`http://localhost:8000/create`, data, {
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

const createContainer = async (req, res, next) => {
    var port
    var newDate = new Date()
    try {
        port = parseInt(Math.random() * 58000 + 2000)
        var service = req.service
        var containerPassword = passwordGenerator()
        var containerName = parseInt(Math.random() * 9999999)
        var gpuNum = service.canCustomize ? req.body.gpuNum : service.gpuNum
        var framework = req.body.framework
    } catch (error) {
        console.log("error In container", error);
        return { success: false, error: error }
    }

    var managerRes
    try {
        managerRes = await callManager(gpuNum)
        if (!!managerRes.data.Error) throw Error
    } catch (error) {
        console.log("err in manager", managerRes.data.Error);
        const ticket = new Ticket({
            title: "تیکت سرور : مشکل در ساخت کانتینر",
            chat: { text: "محمد gpu ها تموم شده." },
            createdAt: newDate,
            owner: req.user._id
        })
        await ticket.save()
        const mailOptions = {
            to: `${req.user.email}`,
            subject: ' با عرض پوزش گرافیکی برای سرویس شما وجود ندارد',
            text: `با عرض پوزش گرافیکی برای سرویس شما وجود ندارد به زودی بررسی خواهد شد و هزینه سرویس به حساب شما باز خواهد گشت.`
        };
        transporter.sendMail(mailOptions)
        return { success: false, error: "این سرویس ناموجود می باشد." }
    }

    managerRes.data.gpu = managerRes.data.gpu.split(",")
    var createContainerRes
    try {
        createContainerRes = await callCreateContainer({
            image: framework == 1 ? "jupyterlab:v0.6" : "torchlab:latest",
            memory: `${Math.pow(2, Number(req.body.gpuNum ?? req.bill.gpuNum) - 1) * 32}g`,
            gpu_num: managerRes.data.gpu,
            password: containerPassword,
            ip: managerRes.data.ip,
            name: containerName.toString(),
            port,
            time: req.service.isFree ? 60 * 13 : (((req.body.useTime ?? req.bill.useTime) * 60) + 9) * 60,
        })
    } catch (error) {
        console.log("error In container", error);
        return { success: false, error: error }
    }

    try {
        const response = await cdnProvider({
            "type": "a",
            "name": containerName,
            "value": [{
                "ip": "81.12.86.120",
                "port": null,
                "weight": null,
                "country": "US"
            }],
            "ttl": 120,
            "cloud": true,
            "upstream_https": "default",
            "ip_filter_mode": {
                "count": "single",
                "order": "none",
                "geo_filter": "none"
            }
        });
    } catch (err) {
        console.log("err In Create Domain", err);
        res.status(500).send("err In Create Domain", err)
        return { success: false, error: error }
    }

    req.containerId = createContainerRes.data.Id

    var bills = await Bills.findOne({ _id: req.bill._id })

    bills.containerInfo.subDomain = containerName
    bills.containerInfo.containerId = createContainerRes.data.Id
    bills.containerInfo.password = containerPassword
    bills.containerInfo.ip = managerRes.data.ip

    bills = await Bills.findOneAndUpdate({ _id: req.bill._id }, bills);

    try {
        await connectW2C(port, containerName, managerRes.data.ip)
    } catch (error) {
        console.log("error In connectW2C", error);
        return { success: false, error: error }
    }

    const mailOptions = {
        to: `${req.user.email}`,
        subject: 'سرویس شما با موفقیت ایجاد شد',
        text: `سرویس شما در https://${containerName}.cloudgpu.net ایجاد شد. و رمز عبور شما ${containerPassword} می باشد.`
    };
    transporter.sendMail(mailOptions)

    return { success: true }
}

module.exports = createContainer
