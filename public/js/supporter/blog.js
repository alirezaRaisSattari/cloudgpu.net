import { api, apiMultipartFormData } from '../apiModule.js';
import { Loading } from '../loadingModule.js';

const loading = new Loading
const selectOption = document.getElementById('selectOption')
const blogSelection = document.getElementById('blogSelection')
const bannerSelection = document.getElementById('bannerSelection')

var quill = new Quill('#editor-container', {
    modules: {
        imageResize: {},
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['image', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']
        ]
    },
    placeholder: 'Compose an epic...',
    theme: 'snow' // or 'bubble'
});

window.postBlog = async function postData(e) {
    e.preventDefault()

    document.getElementById("createBlogBtn").style.display = "none"
    loading.setButtonLoading("createBlog")
    var jsonContent = quill.getContents();
    const title = document.getElementById('newTitle')
    let switchFaq = document.getElementById("switchFaq").checked
    let res = await api('/blog/create', "POST", SupporterToken, {
        title: title.value,
        text: jsonContent,
        isInFaq: switchFaq,
        category: selectOption.value,
    })
    loading.removeLoading("createBlogLoading")
    document.getElementById("createBlogBtn").style.display = "unset"
    if (res.status == 201) {
        uploadImg(res.data._id)
    }
}

const uploadImg = async (id) => {
    const file = document.getElementById('cover-image').files[0]
    if (file.size > 1097152) {
        alert("حجم فایل بیش از حد مجاز است.!");
        return;
    };

    let fileContainer = new FormData();
    fileContainer.append("id", id);
    fileContainer.append("avatar", file);

    let res = await apiMultipartFormData('/blog/addCover', "POST", SupporterToken, fileContainer)

    if (res.status == 201) {
        window.location.href = "/supporter/blog"
    }
}

window.createCategory = async function postData(e) {
    e.preventDefault()
    const fullName = document.getElementById('fullName')
    document.getElementById("createCategoryBtn").style.display = 'none'

    loading.setButtonLoading("createCategory")

    let res = await api('/category/create', "POST", SupporterToken, {
        name: fullName.value,
    })

    loading.removeLoading("createCategoryLoading")

    if (res.status == 201) {
        window.location.href = "/supporter/blog"
    } y
}

const getTitle = async function postData() {
    let res = await api('/category/title/get')
    loading.setOptionLoading("selectOption")

    if (res.status == 200 || res.status == 201) {
        loading.removeLoading("selectOptionLoading")
        res.data.forEach(e => {
            selectOption.innerHTML += `
                <option value="${e.name}">${e.name}</option>
                `
        });
    }
}
getTitle()

const getBlog = async function postData() {
    loading.setOptionLoading("blogSelection")

    let res = await api('/blog/getCovers')

    if (res.status == 201) {
        loading.removeLoading("blogSelectionLoading")

        for (let i = 0; i < res.data.blog.length; i++) {
            blogSelection.innerHTML += `
                    <option value="${res.data.blog[i].id}">${res.data.blog[i].title}</option>
                `
        }
    }
}
getBlog()

window.deleteBlog = async function postData(e) {
    e.preventDefault()
    let id = document.getElementById('blogSelection').value

    document.getElementById('deleteBlogBtn').style.display = "none"
    loading.setButtonLoading("deleteBlog")

    let res = await api(`/blog/delete?id=${id}`, "DELETE", SupporterToken)
    loading.removeLoading("deleteBlogLoading")
    document.getElementById('deleteBlogBtn').style.display = "unset"

    if (res.status == 201) {
        window.location.href = "/supporter/blog"
    }

}

window.postBanner = async (e) => {
    e.preventDefault()
    const title = document.getElementById('bannerTitle')
    const file = document.getElementById('bannerFile').files[0]

    if (file.size > 5297152) {
        alert("حجم فایل بیش از حد مجاز است.!");
        return;
    };

    let fileContainer = new FormData();
    fileContainer.append("title", title.value);
    fileContainer.append("avatar", file);

    document.getElementById("createBannerBtn").style.display = "none"
    loading.setButtonLoading("createBanner")

    let res = await apiMultipartFormData('/blogBanner/create', "POST", SupporterToken, fileContainer)
    loading.removeLoading("createBannerLoading")
    document.getElementById("createBannerBtn").style.display = "unset"

    if (res.status == 200) {
        window.location.href = "/supporter/blog"
    }
}

const getBanner = async function postData() {
    loading.setOptionLoading("bannerSelection")


    let res = await api('/blogBanner/get')

    if (res.status == 200) {
        loading.removeLoading("bannerSelectionLoading")
        for (let i = 0; i < res.data.length; i++) {
            bannerSelection.innerHTML += `
                <option value="${res.data[i]._id}">${res.data[i].title}</option>
                `
        }
    }
}
getBanner()

window.deleteBanner = async function postData(e) {
    e.preventDefault()
    let id = document.getElementById('bannerSelection').value

    document.getElementById("deleteBannerBtn").style.display = "none"
    loading.setButtonLoading("deleteBanner")

    let res = await api(`/blogBanner/delete?id=${id}`, "DELETE", SupporterToken)
    loading.removeLoading("deleteBannerLoading")

    if (res.status == 200) {
        window.location.href = "/supporter/blog"
    }
}
