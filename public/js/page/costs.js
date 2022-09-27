import { api } from "../apiModule.js"
const gpuSelection = document.getElementById('gpuSelection')
const gpuCountInfo = document.getElementById('gpuCountInfo')
const osSelection = document.getElementById('osSelection')
const container = document.getElementById('products');
const timeInfo = document.getElementById('timeInfo')
const ramInfo = document.getElementById('ramInfo')
var gpuNumberFilterStore = ''
var gpuModel
var timeFilterStore = ''
var RamFilterStore = ''
var minGpu = 0
var maxGpu = 1000
var maxRam = 1000
var minRam = 0
var maxTime = 1000
var minTime = 0
var gpuSelectionTxt = ''
var osSelectionTxt = ''
var gpuTxt = []
var osTxt = []
var osSelectionTxt = ''
var dateTime = new Date()
dateTime.setHours(dateTime.getHours() + 24);

window.searchInGpu = (e) => {
    let value = e.target.value.toString();
    const matches = gpuModel.filter(e => e.name.includes(value));
    gpuSelection.innerHTML = ``
    matches.forEach(e => {
        gpuSelection.innerHTML += `
            <div class="d-flex justify-content-between">
            <div class="option">
            <input id="gpuPowerFull" type="checkbox" onchange="gpuSelectionFilter(event, '${e.name.toUpperCase()}')" class="checkbox">
            <label id="gpuName">${e.name.toUpperCase()}</label>
            </div>
            <span class="info" id="ramInfo">${e.number}</span>
            </div>
            `
    });
}

const callApi = async function postData() {
    container.innerHTML += `
        <div class="text-center" id="serviceLoading">
                <div class="spinner-border text-light" role="status">
                    <span class="sr-only">در حال بار‌گذاری</span>
                </div>
            </div>
        `
    let res = await api('/service/get')

    if (res.status == 200) {
        container.innerHTML = ""
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i])
        }
    }

}
callApi()

const addToContainer = ({ gpuNum, discount, gpuModel, os, ram, useTime, costPerGpu, isDisabled, performancePerGpu, ssdStorage, cpuCoreNumber, framework }) => {
    let discountTxt = discount == '0' || !discount ? `` : `<span class="off">${discount}٪ تخفیف</span>`
    let disableTxt = isDisabled ? "disabled" : ""
    let tooltipTxt = isDisabled ? `data-toggle="tooltip" data-placement="top" title="این سرویس ناموجود است"` : ""
    container.innerHTML += `
        <div class="plan position-relative ${disableTxt}" ${tooltipTxt}>
            <span class="name">${gpuModel}</span>
            <span class="s-value">ترافلاپس ${performancePerGpu * gpuNum}</span>
            <span class="s-value" style="margin-right:10px;">${os}</span>
            <span class="price-services"> ${costPerGpu * gpuNum * useTime} تومان</span>
            ` + discountTxt + `
            <!--===================== table large screen =====================-->

            <table class="table table-bordered large">
                <tbody>
                    <tr>
                        <td>تعداد گرافیک ${gpuNum}</td>
                        <td>${ram} گیگابایت رم</td>
                        <td><p> ظرفیت SSD : </p><p> ${ssdStorage} گیگابایت </p></td>
                        <td>اشتراک ${useTime}ساعت استفاده</td>
                        <td>هسته های واقعی پردازنده : <span>${cpuCoreNumber}</span></td>
                        <td><span>${framework == 1 ? "tensorflow" : "pytorch"}</span></td>
                    </tr>
                </tbody>
            </table>

            <!--===================== table mobile =====================-->
            <table class="table table-bordered mobile">
                <tbody>
                    <tr>
                        <td>تعداد گرافیک ${gpuNum}</td>
                        <td>${ram} گیگابایت رم</td>
                    </tr>
                    <tr>
                        <td>${os}</td>
                        <td>اشتراک ${useTime}ساعت استفاده</td>
                    </tr>
                    <tr>
                        <td>پشتیبانی دائمی</td>
                        <td>قابلیت ارتقا به سرویس دیگر</td>
                    </tr>
                </tbody>
            </table>


            <div class="link"><a href="/login" ${disableTxt}">همین حالا سفارش دهید !</a></div>
        </div>
    `
}

//set responsive mobile input field placeholder text
if ($(window).width() < 769) {
    $(".takhfif input").attr("placeholder", "کد تخفیف دارید");
}
else {
    $(".takhfif input").attr("placeholder", "کد تخفیف");
}
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
    container.innerHTML += `
        <div class="text-center" id="serviceLoading">
                <div class="spinner-border text-light" role="status">
                    <span class="sr-only">در حال بار‌گذاری</span>
                </div>
            </div>
        `
    let res = await api(`/service/get?` + gpuNumberFilterStore + '&' + timeFilterStore + '&' + RamFilterStore + '&' + osSelectionTxt + '&' + gpuSelectionTxt,)
    if (res.status == 200) {
        container.innerHTML = ""
        for (let i = 0; i < res.data.length; i++) {
            addToContainer(res.data[i])
        }
    }
}

const componentApi = async function () {
    let res = await api(`/component/get`, "GET")
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
            gpuSelection.innerHTML += `
                <div class="d-flex justify-content-between">
                <div class="option">
                <input id="gpuPowerFull" type="checkbox" onchange="gpuSelectionFilter(event, '${e.name.toUpperCase()}')" class="checkbox">
                <label id="gpuName">${e.name.toUpperCase()}</label>
                </div>
                <span class="info" id="ramInfo">${e.number}</span>
                </div>
                `
        });
        res.data[0].os.forEach(e => {
            osSelection.innerHTML += `
                <div class="d-flex justify-content-between">
                <div class="option">
                <input id="gpuPowerFull" type="checkbox" onchange="osSelectionFilter(event, '${e.name}')" class="checkbox">
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