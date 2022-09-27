import { api } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const recentFactorDiv = document.getElementById("recentFactor");
const showMoreBtn = document.getElementById("showMore");
const dateTime = new Date();
var isFinished = false;
var unSeenTicket = 0;
var unSeenFactor = 0;
var unreadFactorNum = 0
var skip = 0;
var take = 5;
const loading = new Loading
var tomorrowDate = new Date()
tomorrowDate.setHours(tomorrowDate.getHours() + 24);

const services = document.getElementById("services");
const newDate = new Date()

const template = (bills, timeDiff) => {
    const humanDiffHr = `${timeDiff.Hr}`
    const humanDiffMin = `${timeDiff.Min}`

    const timeSpan = humanDiffHr != 0 ? `<td>${humanDiffHr} ساعت دیگر</td>` : `<td>${humanDiffMin} دقیقه دیگر</td>`

    let myDate = new Date(bills.expireDate);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    let activateDate = new Date(bills.activateDate);
    let PersianActivateDate = activateDate.toLocaleDateString('fa-IR');

    const expiredTxt = bills.isExpired ? '' : bills.expireDate ? `<span class="checkout expired-service">منقضی شده</span>` : `<span class="checkout">در انتظار فعال سازی</span>`

    let dateTxt = bills.isExpired ? `<div>تاریخ انقضا<span class="d-md-none"> :</span></div><div class="date">${humanDiffHr >= 1 ? humanDiffHr : "کمتر از یک"} ساعت دیگر</div>` : `
        <div>تاریخ انقضا<span class="d-md-none"> :</span></div>
        <div class="date">${myPersianDate}</div>
    `
    if (!bills.expireDate) {
        dateTxt = ""
    }

    let text
    let extension = bills.serviceInfo.isDisabled || bills.serviceInfo.isFree ? "" : `<button class="extend-service-btn" onclick="extensionService(event, '${bills.framework}', '${bills.useTime}', '${bills.gpuNum}', '${bills.serviceInfo.serviceId}', '${bills.serviceInfo.isDisabled}', '${bills.serviceInfo.isFree}', '${bills.serviceInfo.gpuModel}', '${bills.serviceInfo.os}', '${bills.serviceInfo.performancePerGpu}', '${bills.serviceInfo.costPerGpu}')">تمدید سرویس</button>`


    var servicesTxt
    if (!bills.isExpired > 0 && bills.active) {
        servicesTxt = `
            <div class="my-service-paid-factor-container">
                <div class="title-my-service-paid-factor-container">
                    <div class="d-flex">
                        <div class="title-my-service-paid-factor-title">
                            ${bills.serviceInfo.gpuModel}
                        </div>
                        <div class="title-my-service-paid-factor-buffer">
                            |
                        </div>
                        <div class="title-my-service-paid-factor-detail">
                            <p class="text-dark"><small class="factor-header-detail">سیستم عامل: </small>${bills.serviceInfo.os}</p>
                        <p class="text-dark"><small class="factor-header-detail">توان پردازشی: </small>ترافلاپس ${bills.serviceInfo.performancePerGpu * bills.gpuNum}</p>
                        </div>
                    </div>
                    <div class="title-my-service-paid-factor-detail" style="margin-right="auto; margin-left: 10px;> 
                        <a href="http://${bills.containerInfo.subDomain}.cloudgpu.net" target="_blank" style="margin-right="auto; margin-left: 10px;">مشاهده سرویس</a>
                    </div>
                </div>
                <div class="body-my-service-paid-factor-container">
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item">
                            ${bills.gpuNum} عدد گرافیک
                        </div>
                    </div>
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item">
                            ${32 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت رم
                        </div>
                    </div>
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item">
                            <p> ظرفیت SSD : </p><p> ${128 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت </p>
                        </div>
                    </div>
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item">
                            ${4 * Math.pow(2, Number(bills.gpuNum) - 1)} هسته واقعی پردازنده
                        </div>
                    </div>
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item">
                            ${bills.framework == 1 ? "tensorflow" : "pytorch"}
                        </div>
                    </div>
                    <div class="body-my-service-paid-factor-item">
                        <div class="body-my-service-paid-factor-inner-item upgrade-service">
                            درخواست ارتقا به سرویس دیگر &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class='fas fa-angle-left'></i> </div>
                    </div>
                </div>
                <div class="my-service-paid-factor-bottom">
                    <div class="my-service-paid-factor-bottom-item"> <span class="text-bottom-service">تاریخ فعال سازی :</span>
                        <span>${PersianActivateDate}</span>
                    </div>
                    <div class="title-my-service-paid-factor-buffer-bottom">
                        |
                    </div>
                    <div class="my-service-paid-factor-bottom-item"> <span class="text-bottom-service">باقی مانده سرویس :</span>
                        ${timeSpan}
                    </div>
                </div>
            </div>
        `
    } else if (!bills.isExpired && !bills.active) {
        servicesTxt = `
         <div class="plan">
                <span class="name">${bills.serviceInfo.gpuModel}</span>
                <span class="s-value">ترافلاپس ${bills.serviceInfo.performancePerGpu * bills.gpuNum}</span>

                <!--===================== table larg screen =====================-->
                <table class="table table-bordered large">
                    <tbody>
                        <tr>
                            <td>${bills.gpuNum} تعداد گرافیک</td>
                            <td>${32 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت رم</td>
                            <td>${4 * Math.pow(2, Number(bills.gpuNum) - 1)} هسته های واقعی پردازنده</td>
                            <td><p> ظرفیت SSD : </p><p> ${128 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت </p></td>
                            <td>${bills.serviceInfo.os}</td>
                            <td class="two-line">
                                <div class="title terracota">
                                    در انتظار فعال سازی
                                </div>
                                <div class="subtitle">این فرایند ممکن است بین 1 الی 2 دقیقه طول بکشد</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--===================== table mobile =====================-->
                <table class="table table-bordered mobile">
                    <tbody>
                        <tr>
                            <td>${bills.serviceInfo.gpuNum} تعداد گرافیک</td>
                            <td>${bills.serviceInfo.ram} گیگابایت رم</td>
                        </tr>
                        <tr>
                            <td>${bills.serviceInfo.os}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="two-line d-lg-none">
                    <div class="title terracota">
                        در انتظار فعال سازی
                    </div>
                    <div class="subtitle">این فرایند ممکن است بین 1 الی 2 دقیقه طول بکشد</div>
                </div>


            </div>
        `
    } else {
        let activateDate = new Date(bills.activateDate);
        let expireDate = new Date(bills.expireDate);
        let PersianActivateDate = activateDate.toLocaleDateString('fa-IR');
        let PersianExpireDate = expireDate.toLocaleDateString('fa-IR');
        servicesTxt = `
            <div class="my-service-expired-factor-container">    
                <div class="title-my-service-expired-factor-container">
                    <div class="title-my-service-expired-factor-title">
                        ${bills.serviceInfo.gpuModel}
                    </div>
                    <div class="title-my-service-expired-factor-buffer">
                        |
                    </div>
                    <div class="title-my-service-expired-factor-detail">
                        <p class="text-dark"><small class="factor-header-detail">سیستم عامل: </small>${bills.serviceInfo.os}</p>
                        <p class="text-dark"><small class="factor-header-detail">توان پردازشی: </small>ترافلاپس ${bills.serviceInfo.performancePerGpu * bills.gpuNum}</p>
                    </div>
                    <div class="title-my-service-expired-factor-buffer">
                        |
                    </div>
                    <div class="title-my-service-expired-factor-detail">
                        <p class="text-tiltle-service">اتمام مدت اشتراک</p>
                    </div>
                </div>
                <div class="body-my-service-expired-factor-container">
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            ${bills.gpuNum} عدد گرافیک
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            ${32 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت رم
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            <p> ظرفیت SSD : </p><p> ${128 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت </p>
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            ${4 * Math.pow(2, Number(bills.gpuNum) - 1)} هسته واقعی پردازنده
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item upgrade-service">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            ${bills.framework == 1 ? "tensorflow" : "pytorch"}
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            ${bills.serviceInfo.isFree ? "10 دقیقه استفاده" : bills.useTime + "ساعت استفاده"}
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            فعال سازی : ${PersianActivateDate}
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item">
                            انقضا: ${PersianExpireDate} 
                        </div>
                    </div>
                    <div class="body-my-service-expired-factor-item">
                        <div class="body-my-service-expired-factor-inner-item upgrade-service">
                        ${extension}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </div>
                </div>
            </div>
        `
    }
    services.innerHTML += text ?? servicesTxt
}

const getApi = async function postData() {
    services.innerHTML += `
        <div class="text-center" id="loading${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    let res = await api(`/myService?skip=${skip}&take=${take}`, "GET", token)

    if (res.status == 200) {
        document.getElementById(`loading${skip}`).style.display = "none"
        if ((!res.data.bills || res.data.bills.length < 5) && skip) {
            isFinished = true
        }
        let showFree = !res.data.haveFreeService
        if (res.data.bills) {
            if (!res.data.bills.length && skip == 0) {
                services.innerHTML = "<h5 class='text-center my-4'>سرویسی خریداری شده‌ای وجود ندارد</h5>"
                services.style = "-webkit-mask-image:none"
                showMoreBtn.style.display = "none"
            }
            res.data.bills.forEach((e, i) => {
                template(e, res.data.timeDiffs[i])
            });
            if (res.data.bills.length < 5) {
                showMoreBtn.style.display = "none"
                services.style = "-webkit-mask-image:none"
            }
        } else {
            showMoreBtn.style.display = "none"
            services.style = "-webkit-mask-image:none"
        }
        if (showFree) {
            showFreeService()
        }
    }
}
getApi()

window.extensionService = async function (element, framework, useTime, gpuNum, serviceId, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu) {
    element.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">در حال بارگذاری...</span>
    `
    

    let res = await api("/userService/create", "POST", token, {
        paid: false, framework: framework == 'tensorflow' ? 1 : 2, useTime, gpuNum, serviceInfo: { serviceId, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu }
    })


    if (res.status == 201) {
        window.location.href = "/dashboard/factors"
    }
}
window.showMore = (e) => {
    if (isFinished) {
        services.style = "-webkit-mask-image: none;"
        e.target.style.display = "none"
    }
    skip += 5
    take += 5
    getApi()
}

function templateRecentFactor(bills) {
    const isSeen = bills.paid ? `seen` : `not-seen`
    const isPaid = bills.paid ? `پرداخت شده` : `پرداخت نشده`

    unreadFactorNum += bills.paid ? 0 : 1

    let myDate = new Date(bills.createdAt);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    recentFactorDiv.innerHTML += `
        <div onclick="window.location.href='/dashboard/factors'" class="item hover-pointer
        `+ isSeen + `
            ">
            <div class="title"><a>فاکتور خرید سرویس ${bills.serviceInfo.gpuModel} </a></div>
                <div class="subtitle">
                    <span class="status">وضعیت : `
        + isPaid + `
                    </span >
                    <span>${myPersianDate}</span>
                </div>
            </div>
                `
}
const recentFactor = async function (serviceId) {
    recentFactorDiv.innerHTML = `
        <header>
            <img src="/image/factor.png" alt="">
            <span class="title">صورت حساب و فاکتور‌های اخیر</span>
        </header>
        <div class="text-center mt-2" >
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    let res = await api(`/bill/get?take=5`, "GET", token)

    if (res.status == 200) {
        if (!res.data.bills) {
            recentFactorDiv.innerHTML = `
                <header>
                    <img src="/image/factor.png" alt="">
                    <span class="title">صورت حساب و فاکتور‌های اخیر</span>
                </header>
                <h5 class='text-center mt-4'>فاکتوری وجود ندارد</h5> <br/>
            `
        }
        if (res.data.bills) {
            res.data.bills.forEach(e => { if (!e.paid) { unSeenFactor++ } })
        }
        recentFactorDiv.innerHTML = `
            <header>
                <img src="/image/factor.png" alt="">
                <span class="title">صورت حساب و فاکتور‌های اخیر</span>
                ${unSeenFactor ? `<span class="badge rounded-pill bg-terracota">${unSeenFactor}</span>` : ``}
            </header>
        `
        if (!res.data.bills.length) {
            recentFactorDiv.innerHTML += "<h5 class='text-center mt-4'>فاکتوری وجود ندارد</h5> <br/>"
            return
        }
        res.data.bills.forEach((e, i) => {
            templateRecentFactor(e)
        })
    }

}
recentFactor()
const ticketContainer = document.getElementById('ticketContainer')
const ticketHeader = document.getElementById('ticketHeader')
const ticketMessages = document.getElementById('ticketMessages')
const reply = document.getElementById('reply')
var currentId

window.postApi = async (e) => {
    e.preventDefault()
    const title = document.getElementById('ticketTitle')
    const comment = document.getElementById('comment')

    let res = await api(`/ticket/create`, "POST", token, {
        title: title.value,
        chat: { text: comment.value },
        createdAt: newDate
    })
    if (res.status == 201) {
        window.location.href = "/dashboard/ticket"
    }
}

const getTicket = async () => {
    ticketContainer.innerHTML = `
        <header class="d-flex">
            <img src="/image/ticket.png" alt="">
            <span class="title">تیکت‌های پشتیبانی اخیر</span>
        </header>
            <div class="text-center">
                <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    let res = await api(`/ticket/get?take=5`, "GET", token)
    if (res.status == 200) {
        res.data.forEach(e => { if (!e.isSeen) { unSeenTicket++ } })
        ticketContainer.innerHTML = `
        <header class="d-flex">
            <img src="/image/ticket.png" alt="">
            <span class="title">تیکت‌های پشتیبانی اخیر</span>
            ${unSeenTicket ? `<span class="badge rounded-pill bg-terracota">${unSeenTicket}</span>` : ``}
        </header>
        `
        if (!res.data.length) {
            ticketContainer.innerHTML += "<h5 class='text-center mt-4'>تیکتی وجود ندارد</h5> <br/>"
        } else {
            for (let i = 0; i < res.data.length; i++) {
                templatingTicket(res.data[i])
            }
        }
    }
}
getTicket()

const templatingTicket = (ticket) => {
    let myDate = new Date(ticket.createdAt);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');
    ticketContainer.innerHTML += `
    <div class="item ${ticket.isSeen ? "seen" : "not-seen"}" onclick="createTicket('${ticket._id}', '${ticket.title}')" id="${ticket._id}">
        <div class="title"><a class="hover-pointer" data-bs-toggle="modal" data-bs-target="#ticket-form">${ticket.title}</a></div>
        <div class="subtitle">
            <span class="status">وضعیت : پاسخ داده ${ticket.isAnswered ? "" : "ن"}شده</span>
            <span>${myPersianDate}</span>
        </div>
    </div>
    `
}

window.createTicket = async (id, title) => {
    currentId = id
    ticketHeader.innerHTML = ""
    ticketMessages.innerHTML = ""
    const e = document.getElementById(`${id}`)
    e.classList.remove("not-seen")
    e.classList.add("seen")

    let res = await api(`/ticket/chat/get?id=${id}`, "GET", token)

    if (res.status == 200) {
        ticketHeader.innerHTML += `
        <span class="title">${title}</span>
        `
        res.data.forEach(e => {
            templateTicket(e)
        });

    }
}


const templateTicket = (e) => {
    var h = new Date(e.createdAt).getHours();
    var m = new Date(e.createdAt).getMinutes();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;

    var clock = h + ':' + m;

    let myDate = new Date(e.createdAt);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    if (e.supporterName) {
        ticketMessages.innerHTML += `
        <div class="msg-left light">
            <div class="username">${e.supporterName}:</div>
            <div>
                <p>${e.text}</p>
            </div>
            <div class="mt-4">
                <span class="timeTicket">${clock}</span>
                <span class="dateTicket">${myPersianDate}</span>
            </div>
        </div>
        `
    } else {
        ticketMessages.innerHTML += `
            <div class="msg-right black">
            <div>
                    <p>${e.text}</p>
                </div>
                <div class="mt-4">
                    <span class="timeTicket">${clock}</span>
                    <span class="dateTicket ">${myPersianDate}</span>
                </div>
            </div>
        `
    }
}
window.sendMessage = async (e) => {
    e.preventDefault()
    var h = new Date().getHours();
    var m = new Date().getMinutes();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;

    var clock = h + ':' + m;

    let myDate = new Date();
    let myPersianDate = myDate.toLocaleDateString('fa-IR');
    ticketMessages.innerHTML += `
    <div class="msg-right black">
        <div>
            <p>${reply.value}</p>
        </div>
        <div>
            <span class="time">${clock}</span>
            <span class="date">${myPersianDate}</span>
        </div>
    </div>
    `
    let res = await api(`/ticket/chat/post?id=${currentId}`, "POST", token, { text: reply.value })
}
const showFreeService = async () => {
    let res = await api(`/service/getFreeService`, "GET", token)

    if (res.status == 200) {
        res.data.service
        if (res.data.msg) return
        let disableTxt = (res.data.service.isDisabled || res.data.service.freeGpus == 0) ? "disabled" : ""
        let tooltipTxt = res.data.service.isDisabled ? `data-toggle="tooltip" data-placement="top" title="این سرویس ناموجود است"` : ""
        document.getElementById("freeServices").innerHTML = `
        <div class="plan buy-service-font ${disableTxt}" ${tooltipTxt}>
        <div class="title-service-buy-container">
            <div class="title-service-buy-title">
                ${res.data.service.gpuModel}
            </div>
            <div class="title-service-buy-detail">
                <p>${res.data.service.os}</p>
                <p>${res.data.service.performancePerGpu * res.data.service.gpuNum} ترافلاپس</p>
            </div>
        </div>
        <div class="body-service-buy-container">
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    تعداد گرافیک :
                    <span>${res.data.service.gpuNum}</span>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <span>${res.data.service.ram}</span> گیگابایت رم</td>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <div class="d-flex"><p> ظرفیت SSD : </p><p> ${res.data.service.ssdStorage} گیگابایت </p></div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <div class="d-flex">
                        مدت استفاده (به دقیقه) : <p class="input-value" disabled>10</p>
                    </div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    هسته های واقعی پردازنده : <span>${res.data.service.cpuCoreNumber}
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    فریم ورک :
                    <span>${res.data.service.framework == 1 ? "tensorflow" : "pytorch"}</span>
                            
                </div>
            </div>
        </div>
        <div class="buy-service-bottom">
            <div class="buy-service-bottom-buy" id="buyFreeDiv"><button id="buyFreeBtn" ${disableTxt} onclick="buyFreeService('${res.data.service._id}', '${res.data.service.framework}', '${res.data.service.useTime}', '${res.data.service.gpuNum}')" class="order-service-btn"> سفارش سرویس</button></div>
            <div class="buy-service-bottom-price">
                <p class="text-price-order-service">هزینه سرویس : </p>
                <button class="price-service" style="text-decoration: line-through;"> ${res.data.service.costPerGpu * res.data.service.gpuNum * res.data.service.useTime} تومان</button>
            </div>
        </div>
    </div>
        `
    }
}
window.buyFreeService = async (serviceId, framework, useTime, gpuNum) => {
    loading.setInnerButtonLoading("buyFreeBtn")

    let res = await api(`/freeService/buy`, "POST", token, {
        serviceId,
        framework,
        useTime,
        gpuNum,
    })
    loading.removeInnerLoading("buyFreeBtn", "سفارش سرویس")
    if (res.status == 201) {
        window.location.href = "/dashboard/myServices"
    }
    if (res.status >= 400) {
        document.getElementById('buyFreeBtn').style.display = "unset"
    }
}