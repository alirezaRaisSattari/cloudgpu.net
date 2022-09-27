import { api, apiMultipartFormData } from '../apiModule.js';
const formModal = document.getElementById('formModal')
const submitBtnModal = document.getElementById('submitBtnModal')
var fileContainer
var language

window.programmingLanguage = (num) => {
    language = num
}

window.postDialogApi = async (e) => {
    e.preventDefault()
    const email = document.getElementById('dialogEmail')
    const fullName = document.getElementById('fullName')
    const file = document.getElementById('fileInputDialog').files[0]

    submitBtnModal.style.display = "none"
    formModal.innerHTML += ` 
        <button type="submit" class="btn form-control" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="sr-only">در حال بار گذاری</span>
        </button>
    `

    if (file.size > 5297152) {
        alert("حجم فایل بیش از حد مجاز است.!");
        return;
    };

    fileContainer = new FormData();
    fileContainer.append("name", fullName.value);
    fileContainer.append("email", email.value);
    fileContainer.append("job", language.toString());
    fileContainer.append("avatar", file);

    let res = await apiMultipartFormData('/cv/create', "POST", null, fileContainer)
    if (res.status == 200) {
        window.location.href = "/"
    }
}

window.postApi = async (e) => {
    e.preventDefault()
    const email = document.getElementById('email')
    const fullName = document.getElementById('name')
    const file = document.getElementById('inputFileMain').files[0]

    submitBtnModal.style.display = "none"
    formModal.innerHTML += ` 
        <button type="submit" class="btn form-control" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="sr-only">در حال بار گذاری</span>
        </button>
    `

    if (file.size > 5297152) {
        alert("حجم فایل بیش از حد مجاز است.!");
        return;
    };

    let fileContainer = new FormData();
    fileContainer.append("name", fullName.value);
    fileContainer.append("email", email.value);
    fileContainer.append("text", text.value);
    fileContainer.append("job", "1");
    fileContainer.append("avatar", file);

    let res = await apiMultipartFormData('/cv/create', "POST", null, fileContainer)
    if (respon.status == 200) {
        window.location.href = "/"
    }
}

window.toFileInput = () => {
    document.getElementById('inputFileMain').click()
}
window.toFileInputDialog = () => {
    document.getElementById('fileInputDialog').click()
}