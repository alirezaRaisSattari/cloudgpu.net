import { api } from '../apiModule.js';
const token = localStorage.getItem("token")
if (token) { window.location.href = "/dashboard"; }

var userId
var userNumber
const number = localStorage.getItem("number")
if (!number) {
    window.location.href = '/getNumberUser'
}

var name = ""
var email = ""
var password = ""
var password2 = ""
var step1 = true;
var smsTimer = 120 //seconds
var userId
var userNumber

window.toStep2 = async function postData(e) {
    e.preventDefault();
    name = document.getElementById('name').value;
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    password2 = document.getElementById('password2').value;
    var haveErr = false;

    document.getElementById('name').style = 'border-color: #ced4da';
    document.getElementById('password2').style = 'border-color: #ced4da';
    document.getElementById('email').style = 'border-color: #ced4da';
    document.getElementById('password').style = 'border-color: #ced4da';

    if (!name) {
        document.getElementById('name').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#emptyName', { delay: 10000 })).show();
        haveErr = true
    }
    if (!email || !emailValidation(email)) {
        document.getElementById('email').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#emptyEmail', { delay: 10000 })).show();
        haveErr = true
    }
    if (!password || !passwordValidation(password)) {
        document.getElementById('password').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#emptyPassword', { delay: 10000 })).show();
        haveErr = true
    }
    if (password != password2) {
        document.getElementById('password2').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#notMatchPassword', { delay: 10000 })).show();
        haveErr = true
    }
    if (await checkEmail()) {
        document.getElementById('email').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#repetitiousEmail', { delay: 10000 })).show();
        haveErr = true
    }

    if (haveErr) {
        return;
    }

    let res = await api(`/users/register`, "POST", null, { name, email, number, password })
    userId = res.data.user._id
    userNumber = number
    await api(`/user/otp/get?id=${userId}&number=${userNumber}`)
    startTimer()

    document.getElementById("step1").style.display = "none"
    document.getElementById("step2").style.display = "block"
    step1 = false;
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
        document.getElementById("step2").style.display = "none"
        document.getElementById("step1").style.display = "block"
        step1 = true;
    }
}

window.checkCode = async function postData() {
    const number = localStorage.getItem("number")
    let d1 = document.getElementById('d1').value
    let d2 = document.getElementById('d2').value
    let d3 = document.getElementById('d3').value
    let d4 = document.getElementById('d4').value
    let d5 = document.getElementById('d5').value

    let otp = d1 + d2 + d3 + d4 + d5

    let res = await api(`/user/otp/verify`, "POST", null, { id: userId, otp })

    if (res.status == 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
        window.location.href = '/dashboard';
    }
}

const checkEmail = async function postData() {
    let email = document.getElementById('email').value
    let res = await api(`/findEmail`, "POST", null, { email })

    if (res.status == 200) return res.data.available
    else return false

}
function emailValidation(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function passwordValidation(password) {
    return String(password)
        .toLowerCase()
        .match(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        );
}