import { api } from "../apiModule.js"
const mainForm = document.getElementById('mainForm')
var numberOfSubmission = 0

window.postApi = async (e) => {
    e.preventDefault()

    const fullName = document.getElementById('fullName')
    const comment = document.getElementById('comment')
    const email = document.getElementById('email')

    let submitBtn = document.getElementById(`submitBtn${numberOfSubmission}`)
    submitBtn.style.display = "none"
    mainForm.innerHTML += `
        <button type="submit" class="btn form-control" disabled id="loading${numberOfSubmission}">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">در حال بار‌گذاری</span>
        </button>
        `

    let res = await api(`/contactUs/create`, "POST", "", { name: fullName.value, email: email.value, text: comment.value })
    if (res.status == 201) {
        new bootstrap.Toast(document.querySelector('#added', { delay: 10000 })).show();
        let loading = document.getElementById(`loading${numberOfSubmission}`)
        loading.style.display = "none"
        numberOfSubmission++
        mainForm.innerHTML += `
            <button type="submit" class="btn form-control" id="submitBtn${numberOfSubmission}">ارسال</button>
        `
    }

}