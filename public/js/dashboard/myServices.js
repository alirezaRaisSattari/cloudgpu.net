import { api } from '../apiModule.js';
import { scrollLoader } from '../loadingScroll.js';

var skip = 0
var take = 7
var loading = false
var isApiDataFinished = false
const newDate = new Date()
const services = document.getElementById("services");

scrollLoader(() => getApi())
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
    if (isApiDataFinished || loading) return
    loading = true
    services.innerHTML += `
        <div class="text-center" id="loading${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `
    let res = await api(`/myService?skip=${skip}&take=${take}`, "GET", token)
    document.getElementById(`loading${skip}`).style.display = "none"
    if (res.status == 200) {
        loading = false
        if (res.data.bills) {
            if (res.data.bills.length == 7) {
                skip += 7
                take += 7
            } else {
                isApiDataFinished = true
            }
            if (!res.data.bills.length && skip == 0) {
                services.innerHTML = "<h5 class='text-center my-4'>سرویسی خریداری شده‌ای وجود ندارد</h5>"
                return
            }
            res.data.bills.forEach((e, i) => { template(e, res.data.timeDiffs[i]) });
        } else {
            if (skip == 0) {
                services.innerHTML = "<h5 class='text-center my-4'>سرویسی خریداری شده‌ای وجود ندارد</h5>"
            }
            isApiDataFinished = true
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
