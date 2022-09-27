import { api } from "../apiModule.js"
const categories = document.getElementById("categories")
var blogContainer = document.getElementById("blogContainer")
var mobileCategories = document.getElementById("mobileCategories")
var banner = document.getElementById("banner")
var bannerLoading = document.getElementById("bannerLoading")
var blogs
var blogsCount = 0
var skip = 0
var take = 16
var loadingBlogCover = false
var numberOfLoading


const getCategoryApi = async function postData() {
    let res = await api('/category/title/get')
    if (res.status == 201) {
        categories.innerHTML = ""
        for (let i = 0; i < res.data.length; i++) {
            addToCategory(res.data[i])
        }
    }
}
getCategoryApi()

window.toCategory = (cat) => {
    blogContainer.innerHTML = ""
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].category == cat) addToBlog(blogs[i])
    }
}
const addToCategory = (cat) => {
    mobileCategories.innerHTML += `
        <li><a class="dropdown-item" onclick="toCategory('${cat.name}')">${cat.name}</a></li>
    `
    categories.innerHTML += `
        <a class="hover-pointer" onclick="toCategory('${cat.name}')">${cat.name}</a>
    `
}
const getBlogApi = async function postData() {
    blogContainer.innerHTML = `
        <div class="text-center" id="">
            <div class="spinner-border" role="status">
                <span class="sr-only">در حال بار‌گذاری</span>
            </div>
        </div>
    `
    let res = await api('/blog/getCovers')

    if (res.status == 201) {
        blogContainer.innerHTML = ""
        blogs = res.data.blog
        blogsCount = res.data.count
        if (blogsCount) {
            document.getElementById("paginator").style.visibility = "hidden";
            document.getElementById("paginator").style.padding = "0";
            document.getElementById("paginator").style.margin = "0";
        }
        for (let i = 0; i < res.data.blog.length; i++) {
            addToBlog(res.data.blog[i])
        }
    }
}
getBlogApi()
const addToBlog = (blog) => {
    blogContainer.innerHTML += `
        <div class="col-12 col-md-6 col-lg-3 ${blog.category}">
            <div class="card">
                <img class="card-img-top" src="${'/files/' + blog.coverImg}" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h4 class="card-title">${blog.title}</h4>
                    <p class="card-text">${blog.category}</p>
                    <a href="/blog/${blog.id}" class="btn">نمایش بیشتر…</a>
                </div>
            </div>
        </div>
    `
}

const getBanner = async function postData() {
    let res = await api('/blogBanner/get')

    if (res.status == 200) {
        bannerLoading.innerHTML = ""
        for (let i = 0; i < res.data.length; i++) {
            banner.innerHTML += `
                <div class="item"><img src="${'/files/' + res.data[i].file}" alt="Card image" style=""></div>
            `
        }
        initialBanner()
    }
}
getBanner()

const initialBanner = () => {
    $(document).ready(function () {
        var owl = $('.owl-carousel');
        if ($(window).width() < 768) {
            owl.owlCarousel({
                stagePadding: 10,
                margin: 11,
                nav: false,
                loop: true,
                responsive: {
                    0: {
                        items: 1
                    }
                }
            })
        }
        else {
            owl.owlCarousel({
                stagePadding: 80,
                margin: 35,
                nav: true,
                loop: true,
                responsive: {
                    0: {
                        items: 1
                    }
                }
            })
        }
    })
}