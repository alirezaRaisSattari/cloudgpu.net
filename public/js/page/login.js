import { api } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const loading = new Loading
const token = localStorage.getItem("token")
if (token) { window.location.href = "/dashboard"; }
const submitBtnForm = document.getElementById('submitBtnForm')
var errNumber = 0

window.showPassword = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
    var element = document.getElementById("togglePassword");
    element.classList.toggle("fa-eye");
    element.classList.toggle("fa-eye-slash");
}

window.loginAPI = async function postData(e) {
    e.preventDefault();

    const emailOrNumber = document.getElementById('email').value
    const password = document.getElementById('password').value
    var haveErr = false;

    document.getElementById('email').style = 'border-color: #ced4da';
    document.getElementById('password').style = 'border-color: #ced4da';

    if (!emailOrNumber) {
        document.getElementById('email').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#emptyEmail', { delay: 10000 })).show();
        haveErr = true;
    }
    if (!password) {
        document.getElementById('password').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#emptyPassword', { delay: 10000 })).show();
        haveErr = true;
    }

    if (haveErr) {
        return;
    }

    let submitBtn = document.getElementById(`submitBtn${errNumber}`)

    loading.setInnerButtonLoading("submitBtn")

    let res = await api(`/users/login`, "POST", null, { emailOrNumber, password })

    loading.removeInnerLoading("submitBtn", "ورود به حساب کاربری")

    if (res.status == 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.user.name);
        window.location.href = '/dashboard';
    }

    if (res.status == 404) {
        let loadingBtn = document.getElementById(`loading${errNumber}`)
        loadingBtn.style.display = "none"
        errNumber++
        submitBtnForm.innerHTML = `
            <button id="submitBtn${errNumber}" type="submit" class="btn">ورود به حساب کاربری</button>
            `+ submitBtnForm.innerHTML
        document.getElementById('password').style = 'border-color: red';
        document.getElementById('email').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#wrongPassword', { delay: 10000 })).show();
    }
}
