import { api, apiMultipartFormData } from '../apiModule.js';

const ticketContainer = document.getElementById('ticketContainer')
const ticketHeader = document.getElementById('ticketHeader')
const ticketMessages = document.getElementById('ticketMessages')
const reply = document.getElementById('reply')
const newDate = new Date()
var currentId

const getTicket = async () => {
    try {
        const res = await fetch(`/ticket/getAll`, {
            method: 'GET',
            headers: {
                'Authorization': SupporterToken,
                'Content-Type': 'application/json'
            },
        })
        const respon = await res
        const resi = await res.json()
        if (respon.status == 200) {
            for (let i = resi.length; i > 0; i--) {
                template(resi[i - 1])

            }
        }
        if (respon.status == 401) {
            localStorage.removeItem("number");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            window.location.href = "/login"
        }
    } catch (error) {
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
    currentId = id
    ticketHeader.innerHTML = ""
    ticketMessages.innerHTML = ""
    const e = document.getElementById(`${id}`)
    e.classList.remove("not-seen")
    e.classList.add("seen")

    try {
        const res = await fetch(`/ticket/chat/supporter/get?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': SupporterToken,
                'Content-Type': 'application/json'
            },
        })
        const respon = await res
        const resi = await res.json()
        if (respon.status == 200) {
            ticketHeader.innerHTML += `
                <span class="title">${title}</span>
            `
            resi.forEach(e => {
                templateTicket(e)
            });

        }
        if (respon.status == 401) {
            localStorage.removeItem("number");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            window.location.href = "/login"
        }
    } catch (error) {
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
    <div class="msg-left light">
        <div>
            <p>${reply.value}</p>
        </div>
        <div>
            <span class="time">${clock}</span>
            <span class="date">${myPersianDate}</span>
        </div>
    </div>
    
    `
    try {
        const res = await fetch(`/ticket/chat/supporter/post?id=${currentId}`, {
            method: 'POST',
            headers: {
                'Authorization': SupporterToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: reply.value,
                supporterName
            })
        })
        const respon = await res
        const resi = await res.json()
        if (respon.status == 200) {
        }
        if (respon.status == 401) {
            localStorage.removeItem("number");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            window.location.href = "/login"
        }
    } catch (error) {
    }
}