import { api } from '../apiModule.js';
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

    let res = await api('/service/get', "GET", token)
    loading.removeLoading("productsLoading")

    if (res.status == 200) {
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i], i)
        }
    }
}
callApi()


const addToContainer = ({ gpuNum, discount, gpuModel, os, ram, useTime, costPerGpu, _id, isDisabled, maximumGpus, performancePerGpu, canCustomize, ssdStorage, cpuCoreNumber, framework, isFree }, index) => {
    gpuNumGlobal = gpuNum
    frameworkGlobal = framework
    useTimeGlobal = useTime
    let discountTxt = discount == '0' || !discount ? `` : `<span class="off">${discount}٪ تخفیف</span>`
    let disableTxt = ""

    let optionOfGpuNum = ""
    for (let i = 0; i < maximumGpus; i++) {
        optionOfGpuNum += `
            <a class="dropdown-item hover-pointer" onclick="gpuNumGlobalFunc(${i + 1}, ${index}, ${costPerGpu}, ${performancePerGpu})">${i + 1}x</a>
        `
    }

    if (isDisabled || !maximumGpus) { disableTxt = " disabled" }
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
                        ${optionOfGpuNum}
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

    let res = await api('/service/get?' + gpuNumberFilterStore + '&' + timeFilterStore + '&' + RamFilterStore + '&' + osSelectionTxt + '&' + gpuSelectionTxt, "GET", token)

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

    let res = await api("/component/get", "GET", token)

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

    let res = await api("/userService/create", "POST", token, {
        paid: false, framework: frameworkNumber, useTime, gpuNum, serviceInfo: { serviceId, isDisabled, isFree, gpuModel, os, performancePerGpu, costPerGpu }
    })

    loading.removeLoading("buyNewServiceBtnLoading")
    e.target.innerHTML = "<span>سفارش سرویس</span>"

    if (res.status == 201) {
        window.location.href = "/dashboard/factors"
    }
}