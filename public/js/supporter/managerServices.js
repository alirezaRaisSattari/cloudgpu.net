import { api, apiMultipartFormData } from '../apiModule.js';

const gpuSelection = document.getElementById('gpuSelection')
const gpuCountInfo = document.getElementById('gpuCountInfo')
const maximumGpus = document.getElementById('maximumGpus')
const osSelection = document.getElementById('osSelection')
const container = document.getElementById('products');
const timeInfo = document.getElementById('timeInfo')
const ramInfo = document.getElementById('ramInfo')
var gpuNumberFilterStore = ''
var timeFilterStore = ''
var RamFilterStore = ''
var minGpu = 0
var maxGpu = 1000
var maxRam = 1000
var minRam = 0
var gpuNumGlobal
var useTimeGlobal
var frameworkGlobal
var maxTime = 1000
var minTime = 0
var gpuSelectionTxt = ''
var osSelectionTxt = ''
var gpuTxt = []
var osTxt = []
var osSelectionTxt = ''
var gpuModel
var editItemId
var selectFrameworkForCreate = 1

window.useTimeValidate = (e) => {
    if (Number(e.target.value) > 999) {
        e.target.value = "999"
        new bootstrap.Toast(document.querySelector('#mostValued', { delay: 10000 })).show();
    }
    if (Number(e.target.value) < 0) {
        e.target.value = "1"
        new bootstrap.Toast(document.querySelector('#leastValued', { delay: 10000 })).show();
    }
}

document.body.addEventListener('click', function (event) {
    if (document.getElementById(`dropdownCreateButton`).contains(event.target)) {
        document.getElementById(`createDropdownMenu`).style.display = "unset"
    } else {
        document.getElementById(`createDropdownMenu`).style.display = "none"
    }
});

window.selectFramework = (num) => {
    selectFrameworkForCreate = num
    if (num == 1) {
        document.getElementById("createFrameworkSelection").innerHTML = "tensorflow"
    } else {
        document.getElementById("createFrameworkSelection").innerHTML = "pytorch"
    }
}

window.calculatePerformanceInUnitPerformance = (e) => {
    let gpuNum = document.getElementById("gpuNum").value
    if (gpuNum && e.target.value) {
        document.getElementById("unitPerformance").value = Number(gpuNum) * Number(e.target.value)
    } else {
        document.getElementById("unitPerformance").value = ""
    }
}

window.calculatePriceInUnitPrice = (e) => {
    let gpuNum = document.getElementById("gpuNum").value
    if (gpuNum && e.target.value) {
        document.getElementById("unitCost").value = Number(gpuNum) * Number(e.target.value)
    } else {
        document.getElementById("unitCost").value = ""
    }
}

window.calculateItemsInGpu = (e) => {
    if (e.target.value > 4) e.target.value = 4
    let performance = document.getElementById("performance").value
    let costPerGpu = document.getElementById("costPerGpu").value
    if (e.target.value) {
        document.getElementById("cpuCore").value = 4 * Math.pow(2, Number(e.target.value) - 1)
        document.getElementById("ssdStorage").value = 128 * Math.pow(2, Number(e.target.value) - 1)
        document.getElementById("ram").value = 32 * Math.pow(2, Number(e.target.value) - 1)
    } else {
        document.getElementById("cpuCore").value = ""
        document.getElementById("ssdStorage").value = ""
        document.getElementById("ram").value = ""
    }
    if (performance && e.target.value) {
        document.getElementById("unitPerformance").value = Number(performance) * Number(e.target.value)
    } else {
        document.getElementById("unitPerformance").value = ""
    }
    if (costPerGpu && e.target.value) {
        document.getElementById("costPerGpu").value = Number(costPerGpu) * Number(e.target.value)
    } else {
        document.getElementById("costPerGpu").value = ""
    }
}

window.searchInGpu = (e) => {
    document.getElementById('gpuSelection').innerHTML = ``
    let value = e.target.value.toString();
    const matches = gpuModel.filter(e => e.name.includes(value));

    matches.forEach(e => {
        document.getElementById('gpuSelection').innerHTML += `
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
window.createService = async function postData(e, id) {
    e.preventDefault();
    const switchCustomize = document.getElementById('switchCustomize');
    const performance = document.getElementById('performance');
    const ssdStorage = document.getElementById('ssdStorage');
    const switchFree = document.getElementById('switchFree');
    const gpuModel = document.getElementById('gpuModel');
    const cpuCore = document.getElementById('cpuCore');
    const gpuNum = document.getElementById('gpuNum');
    const useTime = document.getElementById('useTime');
    const costPerGpu = document.getElementById('costPerGpu');
    const ram = document.getElementById('ram');
    const os = document.getElementById('os');

    let res = await api('/service/create', "POST", SupporterToken, {
        gpuModel: gpuModel.value,
        os: os.value,
        performancePerGpu: performance.value,
        discount: discount.value,
        gpuNum: gpuNum.value,
        ssdStorage: ssdStorage.value,
        framework: selectFrameworkForCreate,
        cpuCoreNumber: cpuCore.value,
        ram: ram.value,
        useTime: useTime.value,
        costPerGpu: costPerGpu.value,
        maximumGpus: maximumGpus.value,
        isFree: switchFree.checked,
        canCustomize: switchCustomize.checked,
    })

    if (res.status == 201) {
        window.location.href = "/supporter/manageServices"
    }
}

const callApi = async function postData() {
    let res = await api('/service/get?forSupporter=true')
    if (res.status == 200) {
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i], i)
        }
    }
}
callApi()

const addToContainer = ({ gpuNum, discount, gpuModel, os, ram, useTime, costPerGpu, _id, isDisabled, maximumGpus, performancePerGpu, isFree, ssdStorage, cpuCoreNumber, framework, canCustomize, gpuNumber }, index) => {
    gpuNumGlobal = gpuNum
    frameworkGlobal = framework
    useTimeGlobal = useTime
    let discountTxt = discount == '0' || !discount ? `` : `<span class="off">${discount}٪ تخفیف</span>`
    let disableTxt = ""
    if (isDisabled) { disableTxt = " disabled" }
    container.innerHTML += `
        <div class="plan${disableTxt}" option-btn btn btn-secondary" data-toggle="tooltip" data-placement="top" title="${maximumGpus}/${gpuNumber} میزان فروش سرویس">
            <span class="name">${gpuModel}</span>
            <span class="d-none d-md-inline" style="visibility: hidden;">ا</span>
            <span class="s-value" id="reactivePerformance${index}">${performancePerGpu * gpuNum} ترافلاپس</span>
            <span class="s-value service-os mr-3">${os}</span>
            ` + discountTxt + `
            <!--===================== table large screen =====================-->
            <table class="table table-bordered large">
                <tbody>
                    <tr>
                        <td>
                            <span>
                                تعداد گرافیک :
                                <span id="gpuNumberSelection${index}">${gpuNumGlobal}</span>
                            </span>
                        </td>
                        <td><span id="ramReactive${index}">${ram}</span> گیگابایت رم</td>
                        <td><div class="d-flex"><p> ظرفیت SSD : </p><p id="reactiveSsd${index}"> ${ssdStorage} گیگابایت </p></div></td>
                    </tr>
                    <tr>
                        <td>مدت استفاده (به ساعت) : <span> ${useTimeGlobal} </span></td>
                        <td>هسته های واقعی پردازنده : <span id="cpuCoreReactive${index}">${cpuCoreNumber}</span></td>
                        <td>
                        <div class="dropdown mr-1">
                                <span>
                                    فریم ورک :
                                    <span id="frameworkSelection${index}">${framework == 1 ? "tensorflow" : "pytorch"}</span>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--===================== table mobile =====================-->
            <table class="table table-bordered mobile">
                <tbody>
                    <tr>
                        <td>34 تعداد گرافیک</td>
                        <td>۱۸ گیگابایت رم</td>
                    </tr>
                    <tr>
                        <td>windows 10</td>
                        <td>اشتراک ۱۵ساعت استفاده</td>
                    </tr>
                    <tr>
                        <td>پشتیبانی دائمی</td>
                        <td>قابلیت ارتقا دارد</td>
                    </tr>
                </tbody>
            </table>


            <div class="service-info ">
                <div class="d-flex">
                    <div class="link">
                        <button onclick="deleteService('${_id}')" class="delete-btn" ${disableTxt}>حذف</button>
                        <button class="submit-btn" onclick="editService('${gpuNum}', '${gpuModel}', '${os}', '${ram}', '${useTime}', '${costPerGpu}', '${_id}', '${isDisabled}', '${maximumGpus}', '${gpuNumber}','${performancePerGpu}', '${isFree}', '${discount}', ${ssdStorage}, ${cpuCoreNumber}, ${framework}, ${canCustomize});" ${disableTxt})">ویرایش</button>
                    </div>
                    <div class="price ms-md-auto">
                        <label for="price1" class="d-md-none form-label">هزینه سرویس :</label>
                        <input type="text" readonly class="form-control-plaintext" id="reactivePrice${index}"
                            value="${costPerGpu * gpuNum} تومان">
                    </div>
                </div>
            </div>
        </div>
    `

    document.body.addEventListener('click', function (event) {
        if (!document.getElementById(`dropdownGpuNumberOffset${index}`)) return
        if (document.getElementById(`dropdownGpuNumberOffset${index}`).contains(event.target)) {
            document.getElementById(`menuGpuNumber${index}`).style.display = "unset"
        } else {
            document.getElementById(`menuGpuNumber${index}`).style.display = "none"
        }
        if (document.getElementById(`dropdownFrameworkOffset${index}`).contains(event.target)) {
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
    document.getElementById(`reactivePrice${index}`).value = cost * gpuNumGlobal * e.target.value + " تومان "

}

window.gpuNumGlobalFunc = (num, index, cost, performancePerGpu) => {
    gpuNumGlobal = num
    let time = document.getElementById(`inputTime${index}`).value
    document.getElementById(`cpuCoreReactive${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 4
    document.getElementById(`reactivePerformance${index}`).innerHTML = performancePerGpu * gpuNumGlobal
    document.getElementById(`ramReactive${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 32
    document.getElementById(`reactiveSsd${index}`).innerHTML = Math.pow(2, Number(gpuNumGlobal) - 1) * 128 + " گیگابایت "
    document.getElementById(`gpuNumberSelection${index}`).innerHTML = gpuNumGlobal
    document.getElementById(`reactivePrice${index}`).value = cost * gpuNumGlobal * time + " تومان "
}
window.frameworkGlobalFunc = (num, index) => {
    document.getElementById(`frameworkSelection${index}`).innerHTML = num == 1 ? "tensorflow" : "pytorch"
    frameworkGlobal = num
}

window.editService = (gpuNum, gpuModel, os, ram, useTime, cost, _id, isDisabled, maximumGpus, gpuNumber, performance, isFree, discount, ssdStorage, cpuCoreNumber, framework, canCustomize) => {
    editItemId = _id
    document.getElementById('editService').scrollIntoView()
    document.getElementById('gpuModelEdit').value = gpuModel
    document.getElementById('gpuNumEdit').value = gpuNum
    document.getElementById('ramEdit').value = ram
    document.getElementById('osEdit').value = os
    document.getElementById('useTimeEdit').value = useTime
    document.getElementById('performanceEdit').value = performance
    document.getElementById('costPerGpuEdit').value = cost
    document.getElementById('frameworkEdit').value = framework == 1 ? "tensorflow" : "pytorch"
    document.getElementById('discountEdit').value = discount
    document.getElementById('maximumGpusEdit').value = maximumGpus
    document.getElementById('cpuCoreEdit').value = Math.pow(2, Number(gpuNum) - 1) * 4
    document.getElementById('ssdStorageEdit').value = Math.pow(2, Number(gpuNum) - 1) * 128
    document.getElementById('ramEdit').value = Math.pow(2, Number(gpuNum) - 1) * 32
    document.getElementById('unitPerformanceEdit').value = performance * gpuNum
    document.getElementById('unitCostEdit').value = cost * useTime * gpuNum
    document.getElementById('switchFreeEdit').checked = (isFree === "true")
    document.getElementById('switchCustomizeEdit').checked = canCustomize
}

window.editApi = async (e) => {
    e.preventDefault();
    let useTime = document.getElementById('useTimeEdit')
    if (Number(useTime.value) <= 0) new bootstrap.Toast(document.querySelector('#leastValued', { delay: 10000 })).show();

    let gpuModel = document.getElementById('gpuModelEdit')
    let gpuNum = document.getElementById('gpuNumEdit')
    let ram = document.getElementById('ramEdit')
    let os = document.getElementById('osEdit')
    let performance = document.getElementById('performanceEdit')
    let maximumGpus = document.getElementById('maximumGpusEdit')
    let discount = document.getElementById('discountEdit')
    let isFree = document.getElementById('switchFreeEdit')
    let ssdStorage = document.getElementById('ssdStorageEdit')
    let framework = document.getElementById('frameworkEdit')
    let cpuCore = document.getElementById('cpuCoreEdit')
    let costPerGpu = document.getElementById('costPerGpuEdit')
    let switchCustomize = document.getElementById('switchCustomizeEdit')

    if (framework.value.toLowerCase() == "tensorflow") framework.value = "1"
    else if (framework.value.toLowerCase() == "pytorch") framework.value = "2"
    else {
        new bootstrap.Toast(document.querySelector('#noFramework', { delay: 10000 })).show();
        return
    }

    let res = await api('/service/edit', "POST", SupporterToken, {
        id: editItemId,
        gpuModel: gpuModel.value,
        os: os.value,
        performancePerGpu: performance.value,
        discount: discount.value,
        gpuNum: gpuNum.value,
        ssdStorage: ssdStorage.value,
        framework: framework.value,
        cpuCoreNumber: cpuCore.value,
        ram: ram.value,
        useTime: useTime.value,
        costPerGpu: costPerGpu.value,
        maximumGpus: maximumGpus.value,
        isFree: isFree.checked,
        canCustomize: switchCustomize.checked,
    })

    if (res.status == 201) {
        window.location.href = "/supporter/manageServices"
    }
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
    container.innerHTML = ""
    let res = await api(`/service/get?forSupporter=true&` + gpuNumberFilterStore + '&' + timeFilterStore + '&' + RamFilterStore + '&' + osSelectionTxt + '&' + gpuSelectionTxt)

    if (res.status == 200) {
        for (let i = 0; i < res.data.service.length; i++) {
            addToContainer(res.data.service[i], i)
        }
    }
}

const componentApi = async function () {
    let res = await api(`/component/get`)

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

window.deleteService = async (id) => {
    let res = await api(`/service/delete?id=${id}`, "DELETE", SupporterToken)

    if (res.status == 201) {
        window.location.href = "/supporter/manageServices"
    }
}