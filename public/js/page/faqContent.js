import { api } from "../apiModule.js";
const titleList = document.getElementById('titleList')
const faqMain = document.getElementById('faqMain')
var path = window.location.pathname;
path = path.split('/')

const getSidebarApi = async function postData() {
    titleList.innerHTML = `
        <div class="text-center" id="serviceLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api(`/faq/titles/get`)

    if (res.status == 200) {
        titleList.innerHTML = ""
        for (let i = 0; i < res.data.length; i++) {
            titleList.innerHTML += `
            <li class="nav-item">
                <i class="fa fa-angle-left"></i>
                <a class="nav-link active" aria-current="page" href="/FAQ/${res.data[i].id}">${res.data[i].title}</a>
            </li>
            `
        }
    }

}
getSidebarApi()

const getQuestionApi = async function postData() {
    faqMain.innerHTML = `
        <div class="text-center" id = "serviceLoading" >
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `

    let res = await api(`/faq/questions/get?id=${path[2]}`)
    if (res.status == 200) {
        faqMain.innerHTML = ``
        if (!res.data.question.length) {
            faqMain.innerHTML = `<h5 class='text-center'>موردی وجود ندارد</h5> <br/>`
        }
        for (let i = 0; i < res.data.question.length; i++) {
            template(res.data.question[i], i)
        }
    }
}
getQuestionApi()

const template = (element, index) => {
    faqMain.innerHTML += `
        <div class="accordion" id = "accordion-faq">
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}"
                        onclick="$('div.open').toggleClass('open');this.parentElement.parentElement.classList.toggle('open');">
                        ${element.title}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}"
                    data-bs-parent="#accordion-faq">
                    <div class="accordion-body">
                        ${element.answer}
                    </div>
                </div>
            </div>
        </div>
    `
}