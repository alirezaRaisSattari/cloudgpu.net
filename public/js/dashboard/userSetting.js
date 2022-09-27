import { api } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const loading = new Loading()

var userEmail = ""
const notCorrespond = document.getElementById('notCorrespond')
const falsePass = document.getElementById('falsePass')
const oldPassword = document.getElementById('oldPassword')
const password = document.getElementById('password')
const repassword = document.getElementById('repassword')
const passwordSubmitBtn = document.getElementById('passwordSubmitBtn')

const API = async () => {
    let fullName = document.getElementById('fullname')
    let field = document.getElementById('field')
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    let res = await api(`/users/me`, "GET", token)
    if (res.status == 200) {
        fullName.value = res.data.name
        field.value = res.data.field ?? ""
        email.value = res.data.email
        userEmail = res.data.email
        phone.value = res.data.number
    }
}
API()

window.changeUserInfo = async (e) => {
    let fullName = document.getElementById('fullname')
    let field = document.getElementById('field')
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    e.preventDefault()
    document.getElementById('infoUserSubmitBtn').style.display = "none"
    loading.setButtonLoading("userInfoForm")
    let res = await api(`/user/changeInfo`, "POST", token, {
        name: fullName.value,
        field: field.value,
        email: email.value,
        number: phone.value
    })
    if (res.status == 200) {
        loading.removeLoading('userInfoFormLoading')
        document.getElementById('infoUserSubmitBtn').style.display = "unset"
        new bootstrap.Toast(document.querySelector('#added', { delay: 10000 })).show();
        document.getElementById('fullname').value = fullName.value
        document.getElementById('field').value = field.value
        document.getElementById('email').value = email.value
        document.getElementById('phone').value = phone.value
    }
}

window.changePassword = async (e) => {
    e.preventDefault()
    if (repassword.value != password.value) {
        notCorrespond.style.display = "unset"
        return
    } else {
        notCorrespond.style.display = "none"
    }

    loading.setInnerButtonLoading("passwordSubmitBtn")

    let res = await api(`/user/changePassword`, "POST", token, {
        email: userEmail,
        oldPassword: oldPassword.value,
        password: password.value,
    })
    loading.removeInnerLoading("passwordSubmitBtn", "بازنشانی کلمه عبور")

    if (res.status == 200) {
        new bootstrap.Toast(document.querySelector('#added', { delay: 10000 })).show();
    }
    if (res.status == 500) {
        falsePass.style.display = "unset"
    }
}

window.forgetPassword = async () => {
    let res = await api(`/user/forgetPassword`, "GET", token)
    if (res.status == 200) {
        new bootstrap.Toast(document.querySelector('#forgetPassword'), { delay: 10000 }).show();
    }
}