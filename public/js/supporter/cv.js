import { api, apiMultipartFormData } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const loading = new Loading
const itemContainer = document.getElementById("itemContainer")

const getApi = async () => {
    loading.setLoading("itemContainer")
    let res = await api(`/cv/get`, "GET", SupporterToken)
    loading.removeLoading("itemContainerLoading")
    if (res.status == 200) {
        if (res.data.length == 0) itemContainer.innerHTML = "<h5 class='text-center'>موردی وجود ندارد</h5>"

        for (let i = res.data.length; i > 0; i--) {
            let e = res.data[i - 1]
            itemContainer.innerHTML += `
                <div class="accordion-item w-100">
                    <h2 class="accordion-header" id="heading${i}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                            <p>${e.name}</p>
                        </button>
                    </h2>
                    <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}"
                        data-bs-parent="#accordion-faq">
                        <div class="accordion-body">
                            <p>فایل : <a href="${'/files/' + e.file}" download>دانلود</a></p>
                            <p>ایمیل : ${e.emailOrPhone}</p>
                            <p>اسم : ${e.name}</p>
                            <p>متن : ${e.text}</p>
                        </div>
                        <p class="delete-txt text-danger" onclick="deleteCv('${e._id}')">حذف</p>
                    </div>
                </div>
            `
        };
    }
}
getApi()
window.deleteCv = async (id) => {
    let res = await api(`/cv/delete`, "POST", SupporterToken, {
        id
    })
    if (res.status == 200) window.location.reload()
}