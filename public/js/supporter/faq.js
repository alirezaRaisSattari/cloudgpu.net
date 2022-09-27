import { api, apiMultipartFormData } from '../apiModule.js';
import { Loading } from '../loadingModule.js';
const loading = new Loading
const selectOption = document.getElementById('selectOption')
const deleteTitleOption = document.getElementById('deleteTitleOption')
const deleteTitleQuestionOption = document.getElementById('deleteTitleQuestionOption')
const deleteQuestionOption = document.getElementById('deleteQuestionOption')

window.postTitle = async function postData(e) {
    e.preventDefault()
    const title = document.getElementById('newTitle')
    document.getElementById("createFaqTitleBtn").style.display = "none"
    loading.setButtonLoading("createFaqTitle")

    let res = await api('/faq/title/create', "POST", SupporterToken, {
        title: title.value
    })

    loading.removeLoading("createFaqTitleLoading")

    if (res.status == 201) {
        window.location.href = "/supporter/faq"
    }
}

window.postQuestion = async function postData(e) {
    e.preventDefault()
    let title = document.getElementById('questionTitle').value
    let answer = document.getElementById('answer').value
    let selectOptionValue = document.getElementById('selectOption').value
    let switchStarred = document.getElementById('switchStarred').checked

    document.getElementById("createQuestionBtn").style.display = "none"
    loading.setButtonLoading("createQuestion")

    let res = await api(`/faq/question/create?id=${selectOptionValue}`, "POST", SupporterToken, {
        title, answer, starred: switchStarred
    })
    loading.removeLoading("createQuestion")
    document.getElementById("createQuestionBtn").style.display = "unset"
    if (res.status == 201) {
        window.location.href = "/supporter/faq"
    }
}

const getTitle = async function postData() {
    loading.setOptionLoading("selectOption")
    loading.setOptionLoading("deleteTitleOption")
    loading.setOptionLoading("deleteTitleQuestionOption")

    let res = await api('/faq/titles/get')

    loading.removeLoading("selectOptionLoading")
    loading.removeLoading("deleteTitleOptionLoading")
    loading.removeLoading("deleteTitleQuestionOptionLoading")

    if (res.status == 200 || res.status == 201) {
        res.data.forEach(e => {
            selectOption.innerHTML += `
                <option value="${e.id}">${e.title}</option>
                `
            deleteTitleOption.innerHTML += `
                <option value="${e.id}">${e.title}</option>
                `
            deleteTitleQuestionOption.innerHTML += `
                <option value="${e.id}">${e.title}</option>
                `
        });
    }
}
getTitle()

window.getQuestion = async function postData() {
    let id = document.getElementById('deleteTitleQuestionOption').value

    loading.setOptionLoading("deleteQuestionOption")
    let res = await api(`/faq/questions/get?id=${id}`)
    loading.removeLoading("deleteQuestionOptionLoading")

    if (res.status == 200) {
        deleteQuestionOption.innerHTML = ``
        for (let i = 0; i < res.data.question.length; i++) {
            deleteQuestionOption.innerHTML += `
                <option value="${res.data.question[i]._id}">${res.data.question[i].title}</option>
            `
        }
    }
}

window.deleteTitleApi = async function postData(e) {
    e.preventDefault()
    const id = document.getElementById('deleteTitleOption').value
    document.getElementById("deleteTitleBtn").style.display = "none"
    loading.setButtonLoading("deleteTitle")

    let res = await api(`/faq/title/delete?id=${id}`, "DELETE", SupporterToken)

    document.getElementById("deleteTitleBtn").style.display = "unset"
    loading.removeLoading("deleteTitleLoading")
    if (res.status == 200) {
        window.location.href = "/supporter/faq"
    }
}

window.deleteQuestionApi = async function postData(e) {
    e.preventDefault()
    document.getElementById("deleteQuestionBtn").style.display = "none"
    loading.setButtonLoading("deleteQuestion")
    let titleId = document.getElementById('deleteTitleQuestionOption').value
    let questionId = document.getElementById('deleteQuestionOption').value

    let res = await api(`/faq/question/delete?titleId=${titleId}&questionId=${questionId}`, "DELETE", SupporterToken)

    document.getElementById("deleteQuestionbtn").style.display = "unset"
    loading.removeLoading("deleteQuestion")
    if (res.status == 200) {
        window.location.href = "/supporter/faq"
    }

}