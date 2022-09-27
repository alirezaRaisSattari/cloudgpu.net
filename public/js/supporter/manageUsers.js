import { api } from '../apiModule.js';
var skip = 0
var take = 7
var loadingManageUser = false
var isApiDataFinished = false
const newDate = new Date()
var selectedUserInfo = {}

const template = (userInfo, index) => {
    let { name, createdAt, boughtServiceNumber, activeServiceNumber, totalPaidValue, wallet, _id, email } = userInfo
    let myDate = new Date(createdAt);
    let userRegisterPersianDate = myDate.toLocaleDateString('fa-IR');

    document.getElementById("tableBody").innerHTML += `
        <tr>
            <td data-label="نام">${name}</td>
            <td data-label="تاریخ ثبت نام">${userRegisterPersianDate}</td>
            <td data-label="تعداد سرویس خریداری شده / فعال">${activeServiceNumber} / ${boughtServiceNumber}</td>
            <td data-label="کل پرداختی ها">${totalPaidValue}</td>
            <td data-label="کیف پول">${wallet}</td>
            <td data-label="ابزار" id="toolsDiv${index}">
                <i class="fas fa-ellipsis-v hover-pointer"></i>
                <div class="dropdown-tools" style="display:none;" id="dropdownTools${index}">
                    <p data-bs-toggle="modal" data-bs-target="#factors" onclick="getFactor('${_id}', '${email}')">مشاهده فاکتور ها</p>
                    <p>مشاهده تلفن و ایمیل</p>
                    <p>مشاهده تیکت ها</p>
                    <p>تیکت به کاربر</p>
                    <p data-bs-toggle="modal" data-bs-target="#createService" onclick="getServiceForBuy('${_id}', '${email}')">ساخت سرویس برای کاربر</p>
                    <p class="text-danger">حذف</p>
                </div>
            </td>
        </tr>
    `

    document.addEventListener('click', function (event) {
        if (!document.getElementById(`toolsDiv${index}`)) return
        if (document.getElementById(`toolsDiv${index}`).contains(event.target) && document.getElementById(`dropdownTools${index}`).style.display == "none") {
            document.getElementById(`dropdownTools${index}`).style.display = "unset"
        } else {
            document.getElementById(`dropdownTools${index}`).style.display = "none"
        }
    })
}

const getTicket = async () => {
    try {
        const res = await api(`/user/getAll`, "GET", SupporterToken)
        res.data.forEach((e, i) => {
            template(e, i)
        });

    } catch (error) {
        console.log(error);
    }
}
getTicket()

window.getFactor = async (_id, email) => {
    selectedUserInfo = { _id, email }
    services.innerHTML = ""

    let res = await api(`/myService/supporter?id=${_id}`, "GET", SupporterToken)
    if (res.status == 200) {
        loadingManageUser = false
        if (res.data.bills) {
            if (!res.data.bills.length && skip == 0) {
                services.innerHTML = "<h5 class='text-center my-4'>سرویسی خریداری شده‌ای وجود ندارد</h5>"
                return
            }
            res.data.bills.forEach((e) => {
                templateFactor(e, res.data.timeDiff[i])
            });
        } else {
            if (skip == 0) {
                services.innerHTML = "<h5 class='text-center my-4'>سرویسی خریداری شده‌ای وجود ندارد</h5>"
            }
            isApiDataFinished = true
        }
    }
}






//factor

const templateFactor = (bills, timeDiff) => {
    const humanDiffHr = `${timeDiff.Hr}`
    const humanDiffMin = `${timeDiff.Min}`

    const timeSpan = humanDiffHr != 0 ? `<td>${humanDiffHr} ساعت دیگر</td>` : `<td>${humanDiffMin} دقیقه دیگر</td>`

    let myDate = new Date(bills.expireDate);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    let activateDate = new Date(bills.activateDate);
    let PersianActivateDate = activateDate.toLocaleDateString('fa-IR');

    const expiredTxt = diff >= 0 ? '' : bills.expireDate ? `<span class="checkout expired-service">منقضی شده</span>` : `<span class="checkout">در انتظار فعال سازی</span>`

    let dateTxt = diff >= 0 ? `<div>تاریخ انقضا<span class="d-md-none"> :</span></div><div class="date">${humanDiffHr >= 1 ? humanDiffHr : "کمتر از یک"} ساعت دیگر</div>` : `
        <div>تاریخ انقضا<span class="d-md-none"> :</span></div>
        <div class="date">${myPersianDate}</div>
    `
    if (!bills.expireDate) {
        dateTxt = ""
    }

    let text
    let extension = bills.serviceInfo.isDisabled || bills.serviceInfo.isFree ? "" : `<button class="extend-service-btn" onclick="extensionService('${bills._id}', event)">تمدید سرویس</button>`

    var servicesTxt
    if (diff > 0 && bills.active) {
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
    } else if (!bills.expireDate && !bills.active) {
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
                                <button type="button" class="text-danger" onclick="activateService('${bills._id}')">فعال سازی برای کاربر</button>
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

window.activateService = async (billId) => {
    let user = selectedUserInfo
    await api(`/service/activate/supporter`, "POST", SupporterToken, { user, billId })
    new bootstrap.Toast(document.querySelector('#added', { delay: 10000 })).show();
}




// purchaseGpuService

import { Loading } from '../loadingModule.js';
const loading = new Loading
const gpuSelection = document.getElementById('gpuSelection')
const gpuCountInfo = document.getElementById('gpuCountInfo')
const osSelection = document.getElementById('osSelection')
const container = document.getElementById('products');
const timeInfo = document.getElementById('timeInfo')
const ramInfo = document.getElementById('ramInfo')
var gpuNumberFilterStore = ''
var timeFilterStore = ''
var RamFilterStore = ''
var minGpu = 0
var gpuNumGlobal
var useTimeGlobal
var frameworkGlobal
var maxGpu = 1000
var maxRam = 1000
var minRam = 0
var maxTime = 1000
var minTime = 0
var gpuSelectionTxt = ''
var osSelectionTxt = ''
var osSelectionTxt = ''
var dateTime = new Date()
var gpuTxt = []
var osTxt = []
var gpuModel
dateTime.setHours(dateTime.getHours() + 24);

window.getServiceForBuy = (_id, email) => {
    selectedUserInfo = { _id, email }
}

window.searchInGpu = (e) => {
    let value = e.target.value.toString();
    const matches = gpuModel.filter(e => e.name.includes(value));
    gpuSelection.innerHTML = ``
    matches.forEach(e => {
        gpuSelection.innerHTML += `
            <div class="d-flex justify-content-between">
            <div class="option">
            <input id="gpuPowerFull" checked type="checkbox" onchange="gpuSelectionFilter(event, '${e.name.toUpperCase()}')" class="checkbox">
            <label id="gpuName">${e.name.toUpperCase()}</label>
            </div>
            <span class="info" id="ramInfo">${e.number}</span>
            </div>
            `
    });
}

const callApi = async function postData() {
    loading.setButtonLoading("products")

    let res = await api('/service/get', "GET")
    loading.removeLoading("productsLoading")

    if (res.status == 200) {
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i], i)
        }
    }
}
callApi()

const addToContainer = ({ gpuNum, discount, gpuModel, os, ram, useTime, costPerGpu, _id, isDisabled, maximumGpus, performancePerGpu, canCustomize, ssdStorage, cpuCoreNumber, framework, gpuNumber, isFree }, index) => {
    gpuNumGlobal = gpuNum
    frameworkGlobal = framework
    useTimeGlobal = useTime
    let discountTxt = discount == '0' || !discount ? `` : `<span class="off">${discount}٪ تخفیف</span>`
    let disableTxt = ""
    if (isDisabled) { disableTxt = " disabled" }
    container.innerHTML += canCustomize ? `
        <div class="${disableTxt} service-buy-container">
        <div class="title-service-buy-container">
            <div class="title-service-buy-title">
                ${gpuModel}
            </div>
            <div class="title-service-buy-detail">
                <p class="text-dark"><small class="factor-header-detail-buy">سیستم عامل: </small>${os}</p>
                <p class="text-dark"><small class="factor-header-detail-buy">توان پردازشی: </small> <span id="reactivePerformance${index}">ترافلاپس ${performancePerGpu * gpuNum}</span></p>
            </div>
        </div>
        <div class="body-service-buy-container">
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <button type="button" class="btn btn-secondary dropdown-toggle p-0 m-0" id="dropdownGpuNumberOffset${index}">
                        تعداد گرافیک :
                        <span id="gpuNumberSelection${index}">${gpuNumGlobal}</span>
                    </button>
                    <div id="menuGpuNumber${index}" style="display: none;" class="dropdown-menu" aria-labelledby="dropdownGpuNumberOffset${index}">
                        <a class="dropdown-item hover-pointer" onclick="gpuNumGlobalFunc(1, ${index}, ${costPerGpu}, ${performancePerGpu})">1x</a>
                        <a class="dropdown-item hover-pointer" onclick="gpuNumGlobalFunc(2, ${index}, ${costPerGpu}, ${performancePerGpu})">2x</a>
                        <a class="dropdown-item hover-pointer" onclick="gpuNumGlobalFunc(3, ${index}, ${costPerGpu}, ${performancePerGpu})">3x</a>
                        <a class="dropdown-item hover-pointer" onclick="gpuNumGlobalFunc(4, ${index}, ${costPerGpu}, ${performancePerGpu})">4x</a>
                    </div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <span id="ramReactive${index}">${ram}</span> گیگابایت رم</td>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <div class="d-flex"><p> ظرفیت SSD : </p><p id="reactiveSsd${index}"> ${ssdStorage} گیگابایت </p></div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    مدت استفاده (به ساعت) : <input type="number" value="${useTimeGlobal}" id="inputTime${index}" oninput="useTimeValidation(event, ${index}, ${costPerGpu})" class="input-use-time">
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    هسته های واقعی پردازنده : <span id="cpuCoreReactive${index}">${cpuCoreNumber}
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownFrameworkOffset${index}">
                        فریم ورک :
                        <span id="frameworkSelection${index}">${framework == 1 ? "tensorflow" : "pytorch"}</span>
                    </button>
                    <div id="menuFramework${index}" style="display: none;" class="dropdown-menu" aria-labelledby="dropdownFrameworkOffset${index}">
                        <a class="dropdown-item hover-pointer" onclick="frameworkGlobalFunc(1, ${index})">tensorflow</a>
                        <a class="dropdown-item hover-pointer" onclick="frameworkGlobalFunc(2, ${index})">pytorch</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="buy-service-bottom">
            <div class="buy-service-bottom-buy"><button id="buyNewServiceBtn" ${disableTxt} onclick="newService(event,'${_id}', '${index}', '${isDisabled}', '${isFree}', '${gpuModel}', '${os}', '${performancePerGpu}', '${costPerGpu}')" class="order-service-btn"> سفارش سرویس</button></div>
            <div class="buy-service-bottom-price">
                <p class="text-price-order-service">هزینه سرویس : </p>
                <button class="price-service" id="reactivePrice${index}" value="${costPerGpu * gpuNum * useTimeGlobal} تومان"> ${costPerGpu * gpuNum * useTimeGlobal} تومان</button>
            </div>
        </div>
    </div>
    `: `
    <div class="${disableTxt} service-buy-container" option-btn btn btn-secondary">
        <div class="title-service-buy-container">
            <div class="title-service-buy-title">
                ${gpuModel}
            </div>
            <div class="title-service-buy-detail">
                <p class="text-dark"><small class="factor-header-detail-buy">سیستم عامل: </small>${os}</p>
                <p class="text-dark"><small class="factor-header-detail-buy">توان پردازشی: </small><span id="reactivePerformance${index}">ترافلاپس ${performancePerGpu * gpuNum}</span></p>
            </div>
        </div>
        <div class="body-service-buy-container">
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    تعداد گرافیک :
                    <span id="gpuNumberSelection${index}">${gpuNumGlobal}</span>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <span id="ramReactive${index}">${ram}</span> گیگابایت رم</td>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <div class="d-flex"><p> ظرفیت SSD : </p><p id="reactiveSsd${index}"> ${ssdStorage} گیگابایت </p></div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    <div class="d-flex">
                        مدت استفاده (به ساعت) : <p class="input-value" disabled id="inputTime${index}" value="${useTimeGlobal}">${useTimeGlobal}</p>
                    </div>
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    هسته های واقعی پردازنده : <span id="cpuCoreReactive${index}">${cpuCoreNumber}
                </div>
            </div>
            <div class="body-service-buy-item">
                <div class="body-service-buy-inner-item">
                    فریم ورک :
                    <span id="frameworkSelection${index}">${framework == 1 ? "tensorflow" : "pytorch"}</span>
                            
                </div>
            </div>
        </div>
        <div class="buy-service-bottom">
            <div class="buy-service-bottom-buy"><button id="buyNewServiceBtn" ${disableTxt} onclick="newService(event,'${_id}', '${index}', '${isDisabled}', '${isFree}', '${gpuModel}', '${os}', '${performancePerGpu}', '${costPerGpu}')" class="order-service-btn"> سفارش سرویس</button></div>
            <div class="buy-service-bottom-price">
                <p class="text-price-order-service">هزینه سرویس : </p>
                <button class="price-service" id="reactivePrice${index}" value="${costPerGpu * gpuNum * useTimeGlobal} تومان"> ${costPerGpu * gpuNum * useTimeGlobal} تومان</button>
            </div>
        </div>
    </div>
    `

    document.body.addEventListener('click', function (event) {
        if (!document.getElementById(`dropdownGpuNumberOffset${index}`)) return
        if (document.getElementById(`dropdownGpuNumberOffset${index}`).contains(event.target) && document.getElementById(`menuGpuNumber${index}`).style.display == "none") {
            document.getElementById(`menuGpuNumber${index}`).style.display = "unset"
        } else {
            document.getElementById(`menuGpuNumber${index}`).style.display = "none"
        }
        if (document.getElementById(`dropdownFrameworkOffset${index}`).contains(event.target) && document.getElementById(`menuFramework${index}`).style.display == "none") {
            document.getElementById(`menuFramework${index}`).style.display = "unset"
        } else {
            document.getElementById(`menuFramework${index}`).style.display = "none"
        }
    });
}
window.useTimeValidation = (e, index, cost) => {
    gpuNumGlobal = document.getElementById(`gpuNumberSelection${index}`).innerHTML
    document.getElementById(`inputTime${index}`).value = e.target.value.replace(".", "")
    if (Number(e.target.value) > 999) {
        document.getElementById(`inputTime${index}`).value = "999"
        new bootstrap.Toast(document.querySelector('#mostValued', { delay: 10000 })).show();
    }
    if (Number(e.target.value) < 0) {
        document.getElementById(`inputTime${index}`).value = "1"
        new bootstrap.Toast(document.querySelector('#leastValued', { delay: 10000 })).show();
    }
    document.getElementById(`reactivePrice${index}`).innerHTML = cost * gpuNumGlobal * e.target.value + " تومان "

}

window.gpuNumGlobalFunc = (num, index, cost, performancePerGpu) => {
    gpuNumGlobal = num
    let time = document.getElementById(`inputTime${index}`).value
    document.getElementById(`cpuCoreReactive${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 4
    document.getElementById(`reactivePerformance${index}`).innerHTML = performancePerGpu * gpuNumGlobal + "ترافلاپس"
    document.getElementById(`ramReactive${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 32
    document.getElementById(`reactiveSsd${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 128 + " گیگابایت "
    document.getElementById(`gpuNumberSelection${index}`).innerHTML = gpuNumGlobal
    document.getElementById(`reactivePrice${index}`).innerHTML = cost * gpuNumGlobal * time + " تومان "
}
window.frameworkGlobalFunc = (num, index) => {
    document.getElementById(`frameworkSelection${index}`).innerHTML = num == 1 ? "tensorflow" : "pytorch"
    frameworkGlobal = num
}


//set responsive mobile input field placeholder text
if ($(window).width() < 769) {
    $(".takhfif input").attr("placeholder", "کد تخفیف دارید");
}
else {
    $(".takhfif input").attr("placeholder", "کد تخفیف");
}
$(window).resize(function () {
    if ($(window).width() < 769) {
        $(".takhfif input").attr("placeholder", "کد تخفیف دارید");
    }
    else {
        $(".takhfif input").attr("placeholder", "کد تخفیف");
    }
});
window.filterclick = () => {
    $("#filter-icon").toggleClass("fa-angle-up");
    $("#filter-icon").toggleClass("fa-angle-down");
}

// Sliders

function runSliders() {
    var gpuSlider = document.getElementById('gpuSlider');

    noUiSlider.create(gpuSlider, {
        start: [minGpu, maxGpu],
        connect: true,
        range: {
            'min': minGpu,
            'max': maxGpu
        },
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
        step: 1,
        direction: 'rtl',
    });

    var ramSlider = document.getElementById('ramSlider');

    noUiSlider.create(ramSlider, {
        start: [minRam, maxRam],
        connect: true,
        range: {
            'min': minRam,
            'max': maxRam
        },
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
        step: 1,
        direction: 'rtl',
    });

    var timeSlider = document.getElementById('timeSlider');

    noUiSlider.create(timeSlider, {
        start: [minTime, maxTime],
        connect: true,
        range: {
            'min': minTime,
            'max': maxTime
        },
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
        step: 1,
        direction: 'rtl',
    });

    gpuSlider.noUiSlider.on('change', function (values, handle) {
        gpuNumberFilterStore = `minGpuNum=${values[0]}&maxGpuNum=${values[1]}`
        filterApi()
    });

    timeSlider.noUiSlider.on('change', function (values, handle) {
        timeFilterStore = `minUseTime=${values[0]}&maxUseTime=${values[1]}`
        filterApi()
    });

    ramSlider.noUiSlider.on('change', function (values, handle) {
        RamFilterStore = `minRam=${values[0]}&maxRam=${values[1]}`
        filterApi()
    });
}
const filterApi = async function () {
    document.getElementById("products").innerHTML = ""
    loading.setButtonLoading("products")

    let res = await api('/service/get?' + gpuNumberFilterStore + '&' + timeFilterStore + '&' + RamFilterStore + '&' + osSelectionTxt + '&' + gpuSelectionTxt, "GET")

    loading.removeLoading("productsLoading")

    if (res.status == 200) {
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i], i)
        }
    }
}

const componentApi = async function () {
    loading.setButtonLoading("gpuSelection")
    loading.setButtonLoading("osSelection")

    let res = await api("/component/get", "GET")

    loading.removeLoading("gpuSelectionLoading")
    loading.removeLoading("osSelectionLoading")

    if (res.status == 200) {
        maxGpu = res.data[0].gpuNumMaxNumber
        minGpu = res.data[0].gpuNumMinNumber
        maxRam = res.data[0].ramMaxNumber
        minRam = res.data[0].ramMinNumber
        maxTime = res.data[0].useTimeMaxNumber
        minTime = res.data[0].useTimeMinNumber
        gpuCountInfo.innerHTML = `${minGpu} الی ${maxGpu} گرافیک`
        ramInfo.innerHTML = `${minRam} الی ${maxRam} گیگابایت`
        timeInfo.innerHTML = `${minTime} الی ${maxTime} ساعت`
        gpuModel = res.data[0].gpuModel
        res.data[0].gpuModel.forEach(e => {
            gpuTxt.push(e.name.toUpperCase())
            gpuSelection.innerHTML += `
                <div class="d-flex justify-content-between">
                    <div class="option">
                        <input id="gpuPowerFull" checked type="checkbox" onchange="gpuSelectionFilter(event, '${e.name.toUpperCase()}')" class="checkbox">
                        <label id="gpuName">${e.name.toUpperCase()}</label>
                    </div>
                    <span class="info" id="ramInfo">${e.number}</span>
                </div>
                `
        });
        res.data[0].os.forEach(e => {
            osTxt.push(e.name)
            osSelection.innerHTML += `
                <div class="d-flex justify-content-between">
                <div class="option">
                <input id="gpuPowerFull" checked type="checkbox" onchange="osSelectionFilter(event, '${e.name}')" class="checkbox">
                <label id="gpuName">${e.name}</label>
                </div>
                <span class="info" id="ramInfo">${e.number}</span>
                </div>
                `
        });
        runSliders()
    }
}
componentApi()
window.gpuSelectionFilter = (e, txt) => {
    if (e.target.checked) {
        gpuTxt.push(txt)
    } else {
        const i = gpuTxt.findIndex(element => element == txt)
        gpuTxt.splice(i, 1)
    }
    gpuSelectionTxt = "gpuSelectionTxt=" + gpuTxt
    filterApi()
}
window.osSelectionFilter = (e, txt) => {
    if (e.target.checked) {
        osTxt.push(txt)
    } else {
        const i = osTxt.findIndex(element => element == txt)
        osTxt.splice(i, 1)
    }
    osSelectionTxt = "osSelectionTxt=" + osTxt
    filterApi()
}

window.newService = async function (e, serviceId, index, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu) {
    let useTime
    if (document.getElementById(`inputTime${index}`).value) {
        useTime = document.getElementById(`inputTime${index}`).value
    } else {
        useTime = document.getElementById(`inputTime${index}`).innerHTML
    }
    if (Number(useTime) <= 0) {
        new bootstrap.Toast(document.querySelector('#leastValued', { delay: 10000 })).show();
        return
    }
    e.target.innerHTML = loading.templateLoading("buyNewServiceBtnLoading")

    let gpuNum = document.getElementById(`gpuNumberSelection${index}`).innerHTML
    let framework = document.getElementById(`frameworkSelection${index}`)

    if (framework.innerHTML == "tensorflow") framework.innerHTML = "1"
    else if (framework.innerHTML == "pytorch") framework.innerHTML = "2"
    let frameworkNumber = framework.innerHTML.toString()

    let userInfo = selectedUserInfo
    let res = await api("/service/buy/supporter", "POST", SupporterToken, {
        userInfo, paid: false, framework: frameworkNumber, useTime, gpuNum, serviceInfo: { serviceId, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu }
    })

    loading.removeLoading("buyNewServiceBtnLoading")
    e.target.innerHTML = "<span>سفارش سرویس</span>"

    if (res.status == 201) {
        window.location.href = "/supporter/manageUsers"
    }
}