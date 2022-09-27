import { api } from '../apiModule.js';
import { Loading } from '../loadingModule.js';

const ticketContainer = document.getElementById('ticketContainer')
const ticketHeader = document.getElementById('ticketHeader')
const ticketMessages = document.getElementById('ticketMessages')
const createTicketForm = document.getElementById('createTicketForm')
const reply = document.getElementById('reply')
const ticketContainerHeader = document.getElementById('ticketContainerHeader')
const newDate = new Date()
var numberOfCreatedTicket = 0
var unSeenTicket = 0
var currentId
var skip = 0
var take = 13
var loading = new Loading
var loadingTicket = false
var isApiDataFinished = false

window.postApi = async (e) => {
    e.preventDefault()
    var createTicketSubmitBtn = document.getElementById(`createTicketSubmitBtn`)
    const title = document.getElementById('ticketTitle')
    const comment = document.getElementById('comment')
    createTicketSubmitBtn.style.display = 'none'
    createTicketForm.innerHTML
    loading.setButtonLoading("createTicketForm")

    let res = await api(`/ticket/create`, "POST", token, {
        title: title.value,
        chat: { text: comment.value },
        createdAt: newDate
    })

    loading.removeLoading("createTicketFormLoading")
    document.getElementById(`createTicketSubmitBtn`).style.display = 'unset'

    if (res.status == 201) {
        new bootstrap.Toast(document.querySelector('#createTicket', { delay: 10000 })).show();
        let myDate = new Date(res.data.createdAt);
        let myPersianDate = myDate.toLocaleDateString('fa-IR');
        ticketContainer.innerHTML = `
                <div class="item ${res.data.isSeen ? "seen" : "not-seen"}" onclick="createTicket('${res.data._id}', '${res.data.title}')" id="${res.data._id}">
                    <div class="title"><a class="hover-pointer" data-bs-toggle="modal" data-bs-target="#ticket-form">${res.data.title}</a></div>
                    <div class="subtitle">
                        <span class="status">وضعیت : پاسخ داده ${res.data.isAnswered ? "" : "ن"}شده</span>
                        <span>${myPersianDate}</span>
                    </div>
                </div>
            `+ ticketContainer.innerHTML
        comment.value = ""
        title.value = ""
    }
}

const getTicket = async () => {
    if (isApiDataFinished || loadingTicket) return
    loadingTicket = true
    ticketContainer.innerHTML += `
        <div class="text-center my-5" id="loading${skip}">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    `

    let res = await api(`/ticket/get?skip=${skip}&take=${take}`, "GET", token)
    if (res.status == 200) {
        loadingTicket = false
        document.getElementById(`loading${skip}`).style.display = "none"
        res.data.forEach(e => { if (!e.isSeen) { unSeenTicket++ } })
        if (unSeenTicket) ticketContainerHeader.innerHTML += `
                <span class="badge rounded-pill bg-terracota">${unSeenTicket}</span>
            `
        if (!res.data.length) {
            ticketContainer.innerHTML = `
                <h5 class='text-center'><br/>تیکتی وجود ندارد</h5> <br/>
                `
        } else {
            if (res.data.length == 13) {
                skip += 7
                take += 7
            } else {
                isApiDataFinished = true
            }
            for (let i = 0; i < res.data.length; i++) {
                template(res.data[i])
            }
        }
    }

}
getTicket()

const template = (ticket) => {
    let myDate = new Date(ticket.createdAt);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');
    ticketContainer.innerHTML += `
        <div class="item ${ticket.isSeen ? "seen" : "not-seen"}" onclick="createTicket('${ticket._id}', '${ticket.title}')" id="${ticket._id}">
            <div class="title"><a class="hover-pointer" data-bs-toggle="modal" data-bs-target="#ticket-form">${ticket.title}</a></div>
            <div class="subtitle">
                <span class="status">وضعیت : پاسخ داده ${ticket.isAnswered ? "" : "ن"}شده</span>
                <span>${myPersianDate}</span>
            </div>
        </div>
    `
}

window.createTicket = async (id, title) => {
    loading.setLoading("ticketMessages")

    currentId = id
    ticketHeader.innerHTML = ""
    const e = document.getElementById(`${id}`)
    e.classList.remove("not-seen")
    e.classList.add("seen")

    let res = await api(`/ticket/chat/get?id=${id}`, "GET", token)

    loading.removeLoading("ticketMessagesLoading")

    if (res.status == 200) {
        ticketHeader.innerHTML += `
            <span class="title">${title}</span>
        `
        ticketMessages.innerHTML = ""
        res.data.forEach(e => {
            templateTicket(e)
        });
    }
}

const templateTicket = (e) => {
    var h = new Date(e.createdAt).getHours();
    var m = new Date(e.createdAt).getMinutes();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;

    var clock = h + ':' + m;

    let myDate = new Date(e.createdAt);
    let myPersianDate = myDate.toLocaleDateString('fa-IR');

    if (e.supporterName) {
        ticketMessages.innerHTML += `
            <div class="msg-left light">
                <div class="username">${e.supporterName}:</div>
                <div>
                    <p>${e.text}</p>
                </div>
                <div class="mt-4">
                    <span class="timeTicket">${clock}</span>
                    <span class="dateTicket">${myPersianDate}</span>
                </div>
            </div>
        `
    } else {
        ticketMessages.innerHTML += `
            <div class="msg-right black">
                <div>
                    <p>${e.text}</p>
                </div>
                <div class="mt-4">
                    <span class="timeTicket">${clock}</span>
                    <span class="dateTicket ">${myPersianDate}</span>
                </div>
            </div>
        `
    }
}
window.sendMessage = async (e) => {
    e.preventDefault()
    var h = new Date().getHours();
    var m = new Date().getMinutes();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;

    var clock = h + ':' + m;

    let myDate = new Date();
    let myPersianDate = myDate.toLocaleDateString('fa-IR');
    ticketMessages.innerHTML += `
    <div class="msg-right black">
        <div>
            <p>${reply.value}</p>
        </div>
        <div class="mt-4">
            <span class="timeTicket">${clock}</span>
            <span class="dateTicket ">${myPersianDate}</span>
        </div>
    </div>
    `

    let res = await api(`/ticket/chat/post?id=${currentId}`, "POST", token, {
        text: reply.value
    })

    if (res.status == 200) {
        reply.value = ""
        new bootstrap.Toast(document.querySelector('#createTicket', { delay: 10000 })).show();
    }
}