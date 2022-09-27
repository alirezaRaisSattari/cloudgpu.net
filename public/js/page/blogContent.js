import { api } from "../apiModule.js"

var path = window.location.pathname;
path = path.split('/')
var category = ""
var id = ""
var blogTxt = document.getElementById("blogTxt")
var blogContainer = document.getElementById("blogContainer")

const getApi = async function postData() {
    blogTxt.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api(`/blog/get?id=${path[2]}`)

    if (res.status == 201) {
        new Quill('#blogTxt', { readOnly: true }).setContents(res.data.text)
        category = res.data.category
        id = res.data._id
    }
    getSimilarApi()
}
getApi()

const getSimilarApi = async function postData() {
    blogContainer.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api(`/blog/getCoversByCategory?category=${category}`)

    if (res.status == 201) {
        blogContainer.innerHTML = ""
        if (res.data.length == 1) {
            blogContainer.innerHTML = `
                    <h5 class='text-center pr-3'>وبلاگ مشابهی وجود ندارد</h5> <br/>
                `
        }
        for (let i = 0; i < res.data.length; i++) {
            if (id == res.data[i].id) continue;
            addToBlog(res.data[i])
        }
    }
}

const addToBlog = (blog) => {
    blogContainer.innerHTML += `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="card">
                <img class="card-img-top" src="/image/post-thumbnail1.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h4 class="card-title">${blog.title}</h4>
                    <p class="card-text">${blog.category}</p>
                    <a href="/blog/${blog.id}" class="btn">نمایش بیشتر…</a>
                </div>
            </div>
        </div>
    `
}