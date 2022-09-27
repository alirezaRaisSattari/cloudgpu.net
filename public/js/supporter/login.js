import { api } from '../apiModule.js';

window.showpassword = () => {
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
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    var haveErr = false;

    document.getElementById('username').style = 'border-color: #ced4da';
    document.getElementById('password').style = 'border-color: #ced4da';

    if (!username) {
        document.getElementById('username').style = 'border-color: red';
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



    let res = await api('/supporterUser/login', "POST", null, {
        username,
        password
    })

    if (res.status == 200) {
        localStorage.setItem("SupporterToken", res.data.token);
        localStorage.setItem("SupporterUsername", res.data.user.username);
        localStorage.setItem("accessAddSupporter", res.data.user.access.accessAddSupporter);
        localStorage.setItem("accessServices", res.data.user.access.accessServices);
        localStorage.setItem("accessFaq", res.data.user.access.accessFaq);
        localStorage.setItem("accessTicket", res.data.user.access.accessTicket);
        localStorage.setItem("accessCv", res.data.user.access.accessCv);
        localStorage.setItem("accessContactUs", res.data.user.access.accessContactUs);
        window.location.href = '/supporter';
    }

    if (res.status == 400) {
        document.getElementById('password').style = 'border-color: red';
        document.getElementById('email').style = 'border-color: red';
        new bootstrap.Toast(document.querySelector('#wrongPassword', { delay: 10000 })).show();
    }
}
