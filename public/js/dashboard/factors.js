import { api } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const loading = new Loading;
import { scrollLoader } from '../loadingScroll.js';
scrollLoader(() => getApi())

var skip = 0
var take = 7
var loadingApi = false
var isApiDataFinished = false
const allFactor = document.getElementById("allFactor");
const allFactors = document.getElementById("allFactors");
const paidFactors = document.getElementById("paid");
const notPaidFactors = document.getElementById("notPaid");
const notPaidNum = document.getElementById("notPaidNum");
const newDate = new Date()
notPaidNum.innerHTML = 0;

// for UI
setTimeout(() => {
    allFactor.click();
}, 200);
//

const template = (bills) => {
    const diff = new Date(bills.expireDate) - newDate
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    const humanDiff = `${Math.floor(diff / HRS)}`

    let myDate = new Date(bills.expireDate);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    var expiredTxt = !bills.active && !bills.isExpired ? `<span class="checkout-factor">در انتظار فعال سازی</span>` : ``

    expiredTxt = bills.active && bills.isExpired ? `<span class="checkout-factor">منقضی شده</span>` : expiredTxt

    const showSubdomainTxt = !bills.isExpired && bills.active && bills.paid ? `<a href="http://${bills.containerInfo.subDomain}.cloudgpu.net" target="_blank" style="margin-right="auto; margin-left: 10px;">مشاهده سرویس</a>` : ''
    let dateTxt = !bills.isExpired ? `<div>تاریخ انقضا <span> : </span></div><div class="date">${humanDiff >= 1 ? humanDiff : "کمتر از یک"} ساعت دیگر</div>` : `
        <div>تاریخ انقضا<span> : </span></div>
        <div class="date">${myPersianDate}</div>
    `
    if (!bills.expireDate) {
        dateTxt = ""
    }
    var text
    if (bills.paid) {
        const paidFactor = `
            <div class="service-paid-factor-container">
                <div class="title-service-paid-factor-container">
                    <div class="title-service-paid-factor-title">
                        ${bills.serviceInfo.gpuModel}
                    </div>
                    <div class="title-service-paid-factor-detail">
                        <p class="text-dark"><small class="factor-header-detail">سیستم عامل: </small>${bills.serviceInfo.os}</p>
                        <p class="text-dark"><small class="factor-header-detail">توان پردازشی: </small>ترافلاپس ${bills.serviceInfo.performancePerGpu * bills.gpuNum}</p>
                    </div>
                    <span class="mr-auto">${showSubdomainTxt}</span>`
            + expiredTxt + `
                </div>
                <div class="body-service-paid-factor-container">
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            ${bills.gpuNum} عدد گرافیک
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            ${32 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت رم
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            <p> ظرفیت SSD : </p><p> ${128 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت </p>
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            اشتراک ${bills.serviceInfo.isFree ? "10 دقیقه استفاده" : bills.useTime + "ساعت استفاده"}
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            ${4 * Math.pow(2, Number(bills.gpuNum) - 1)} هسته واقعی پردازنده
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            ${bills.framework == 1 ? "tensorflow" : "pytorch"}
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            `+ dateTxt + `
                        </div>
                    </div>
                    <div class="body-service-paid-factor-item">
                        <div class="body-service-paid-factor-inner-item">
                            مبلغ پرداختی <span
                                    class="d-md-none">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>${bills.serviceInfo.costPerGpu * bills.useTime * bills.gpuNum} تومان
                        </div>
                    </div>
                </div>
            </div>
            `

        allFactors.innerHTML += text ?? paidFactor
        paidFactors.innerHTML += text ?? paidFactor
    } else {
        notPaidNum.innerHTML++
        let extension = bills.serviceInfo.isDisabled ? "" : `<span class="name">خرید سرویس ${bills.serviceInfo.gpuModel}</span>`

        const notPaidFactor = `
            <div class="service-factor-container">
                <div class="title-service-factor-container">
                    <div class="title-service-factor-title">
                        ${bills.serviceInfo.gpuModel}
                    </div>
                    <div class="title-service-factor-detail">
                        <p class="text-dark"><small class="factor-header-detail">سیستم عامل: </small>${bills.serviceInfo.os}</p>
                        <p class="text-dark"><small class="factor-header-detail">توان پردازشی: </small>ترافلاپس ${bills.serviceInfo.performancePerGpu * bills.gpuNum}</p>
                    </div>
                </div>
                <div class="body-service-factor-container">
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            ${bills.gpuNum} عدد گرافیک
                        </div>
                    </div>
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            ${32 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگابایت رم
                        </div>
                    </div>
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            <p> ظرفیت SSD : </p><p> ${128 * Math.pow(2, Number(bills.gpuNum) - 1)} گیگ </p>
                        </div>
                    </div>
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            اشتراک ${bills.serviceInfo.isFree ? "10 دقیقه استفاده" : bills.useTime + "ساعت استفاده"}
                        </div>
                    </div>
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            ${4 * Math.pow(2, Number(bills.gpuNum) - 1)} هسته واقعی پردازنده
                        </div>
                    </div>
                    <div class="body-service-factor-item">
                        <div class="body-service-factor-inner-item">
                            ${bills.framework == 1 ? "tensorflow" : "pytorch"}
                        </div>
                    </div>
                </div>
                <div class="service-factor-bottom">
                    <div class="service-factor-bottom-flex">
                        <div class="service-factor-bottom-buy"><button id="buyServiceBtn" onclick="payBill(event, '${bills._id}', '${bills.framework}', '${bills.useTime}', '${bills.gpuNum}')" class="order-service-btn" style="margin: 20px;" data-bs-toggle="modal" data-bs-target="#warningTxt">پرداخت این صورت حساب</button></div>
                        <div class="takhfif">
                            <input type="text" class="form-control" id="takhfif" placeholder="کد تخفیف">
                            <button type="button" class="discount-submit">اعمال</button>
                        </div>
                    </div>
                    <div class="service-factor-bottom-price">
                        <p class="text-price-order-service">مبلغ قابل پرداخت : </p>
                        <button class="price-service"> ${bills.serviceInfo.costPerGpu * bills.useTime * bills.gpuNum} تومان</button>
                    </div>
                </div>
            </div>
            `
        allFactors.innerHTML += text ?? notPaidFactor
        notPaidFactors.innerHTML += text ?? notPaidFactor
    }
}
const getApi = async function postData() {
    if (isApiDataFinished || loadingApi) return

    loadingApi = true
    loading
    paidFactors.innerHTML += `
        <div class="text-center my-5" id="PaidloadingApi${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    notPaidFactors.innerHTML += `
        <div class="text-center my-5" id="unpaidloadingApi${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    allFactors.innerHTML += `
        <div class="text-center my-5" id="allFactorloadingApi${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    let res = await api(`/bill/get?skip=${skip}&take=${take}`, "GET", token)

    if (res.status == 200) {
        loadingApi = false
        document.getElementById(`PaidloadingApi${skip}`).style.display = "none"
        document.getElementById(`unpaidloadingApi${skip}`).style.display = "none"
        document.getElementById(`allFactorloadingApi${skip}`).style.display = "none"
        if (res.data.bills) {
            if (res.data.bills.length) {
                if (res.data.bills.length == 7) {
                    skip += 7
                    take += 7
                } else {
                    isApiDataFinished = true
                }
                let paid = res.data.bills.find(e => e.paid)
                let notPaid = res.data.bills.find(e => !e.paid)
                if (!paid) { paidFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>" }
                if (!notPaid) { notPaidFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>" }
                if (!notPaid && !paid) { allFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>" }
                res.data.bills.forEach((e, i) => { template(e) });
            } else {
                isApiDataFinished = true
            }
        } else {
            isApiDataFinished = true
            if (skip == 0) {
                paidFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>"
                notPaidFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>"
                allFactors.innerHTML = "<h5 class='text-center mt-4'>موردی وجود ندارد</h5> <br/>"
            }
        }
    }
}

var payBillParameter = {}
window.payBill = async function postData(e, id, framework, useTime, gpuNum) {
    e.preventDefault();
    payBillParameter = { id, framework, useTime, gpuNum }
}
window.payBill2 = async function postData() {
    let { id, framework, useTime, gpuNum } = payBillParameter
    document.getElementById("finalStepBuyService").innerHTML = loading.templateLoading("payBillBtnLoading")

    let res = await api(`/service/buy`, "POST", token, {
        id,
        framework,
        useTime,
        gpuNum,
    })

    if (res.status == 201) {
        window.location.href = "/dashboard/factors"
    }

    loading.removeLoading("payBillBtnLoading")
    document.getElementById("finalStepBuyService").innerHTML = "<span>پرداخت این صورت حساب</span>"

    document.getElementById("buyServiceBtn").innerHTML = "پرداخت این صورت حساب"
    document.getElementById("allFactors").innerHTML = "<br/>"
    document.getElementById("notPaid").innerHTML = "<br/>"
    document.getElementById("paid").innerHTML = "<br/>"
    isApiDataFinished = false
    skip = 0
    take = 7
    getApi()
}

getApi()