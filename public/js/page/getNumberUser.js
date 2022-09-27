import { api } from "../apiModule.js";
import { Loading } from '../loadingModule.js';
const loading = new Loading
const submitBtn = document.querySelector("#submitBtn");
const submitBtnForm = document.querySelector("#submitBtnForm");
const phoneInputField = document.querySelector("#phone");
var smsTimer = 120 //seconds
var userId
var userNumber

var step1 = true;

window.toStep2 = async function postData(e) {
    e.preventDefault();
    if (step1) {

        if (!await (phoneInputField.value)
            .toLowerCase()
            .match(/^(\+98|0098|98|0)?9\d{9}$/)) {
            new bootstrap.Toast(document.querySelector('#invalid-number', { delay: 10000 })).show();
            document.getElementById('phone').style = 'border: solid 1px red';
            return;
        }

        loading.setInnerButtonLoading("submitBtn")

        let arr = phoneInputField.value.split("")
        var number = "";
        for (var i = arr.length - 10; i < arr.length; i++) {
            number += arr[i]
        }

        localStorage.setItem("number", number)

        let res = await api(`/findNumber`, "POST", null, { number })

        loading.removeInnerLoading("submitBtn", "تایید")

        if (res.status == 200 && !res.data.available) {
            window.location.href = '/register';
        }
        if (res.status == 200 && res.data.available) {
            let resOtp = await api(`/user/otp/get?id=${res.data.id}&number=${res.data.number}`)
            if (resOtp.status == 200) {
                document.getElementById("step1").style.display = "none"
                document.getElementById("step2").style.display = "unset"
                step1 = false;
                userId = res.data.id
                userNumber = res.data.number
                startTimer()
            }
        }
    }
}

window.startTimer = () => {
    var timer = setInterval(() => {
        smsTimer--
        document.getElementById("smsTimer").innerHTML = `${Math.floor(smsTimer / 60)}:${smsTimer % 60}`
        if (smsTimer <= 0) {
            clearInterval(timer);
            document.getElementById("notify").innerHTML = `<strong class="hover-pointer" onclick="sendSmsAgain()">پیامکی دریافت نکردید؟</strong>`
        }
    }, 1000);
}

window.sendSmsAgain = () => {
    smsTimer = 120
    startTimer()
    document.getElementById("notify").innerHTML = `تا ارسال مجدد <strong id="smsTimer">2:00</strong>`
    api(`/user/otp/get?id=${userId}&number=${userNumber}`)
}

window.toStep1 = (e) => {
    e.preventDefault();
    if (!step1) {
        step1 = true;
        document.getElementById("step2").style.display = "none"
        document.getElementById("step1").style.display = "block"
    }
}

window.checkCode = async function postData(e) {
    e.preventDefault()
    const number = localStorage.getItem("number")
    let d1 = document.getElementById('d1').value
    let d2 = document.getElementById('d2').value
    let d3 = document.getElementById('d3').value
    let d4 = document.getElementById('d4').value
    let d5 = document.getElementById('d5').value

    let otp = d1 + d2 + d3 + d4 + d5

    if (!d1 || !d2 || !d3 || !d4 || !d5) {
        new bootstrap.Toast(document.querySelector('#invalid-code', { delay: 10000 })).show();
    } else {
        let res = await api(`/user/otp/verify`, "POST", null, { id: userId, otp })
        if (res.status == 200 && !res.data.available) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("name", res.data.user.name);
            localStorage.setItem("email", res.data.user.email);
            window.location.href = "/dashboard";
        }
    }

}
