const titleList = document.getElementById('titleList')
const lastModify = document.getElementById('lastModify')
import { api } from '../apiModule.js'

const getApi = async function postData() {
    titleList.innerHTML = `
        <div class="text-center" id="serviceLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api('/faq/titles/get')

    if (res.status == 200) {
        titleList.innerHTML = ``
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
getApi()

const getCategoryApi = async function postData() {
    lastModify.innerHTML = `
        <div class="text-center" id="serviceLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api('/blog/getCover/highlight')

    if (res.status == 201) {
        lastModify.innerHTML = ``
        for (let i = 0  ; i < res.data.length; i++) {
            lastModify.innerHTML += `
                <a class="new-post" href="blog/${res.data[i].id}">${res.data[i].title}</a>
                `
        }
    }
}
getCategoryApi()