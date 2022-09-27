const isSupporter = !!window.location.pathname.match("supporter");

const api = (URL, method, token, body, contentType) => new Promise(async (resolve, reject) => {
    try {
        const res = await fetch(URL, {
            method: method ?? "GET",
            headers: {
                'Authorization': token,
                'Content-Type': contentType ?? 'application/json'
            },
            body: JSON.stringify(body)
        })
        const responseInfo = await res
        const data = await res.json()
        const status = responseInfo.status

        if (status == 401) {
            if (isSupporter) {
                localStorage.removeItem("accessCv");
                localStorage.removeItem("accessFaq");
                localStorage.removeItem("accessTicket");
                localStorage.removeItem("accessContactUs");
                localStorage.removeItem("SupporterToken");
                localStorage.removeItem("SupporterUsername");
                localStorage.removeItem("accessServices");
                localStorage.removeItem("accessAddSupporter");
                window.location.href = "/supporter/login"
            } else {
                localStorage.removeItem("number");
                localStorage.removeItem("email");
                localStorage.removeItem("name");
                localStorage.removeItem("token");
                window.location.href = "/login"
            }
        }
        if (status >= 400 && status <= 600) {
            if (data.msg) {
                document.getElementById('titleApiErr').innerHTML = data.msgHead
                document.getElementById('bodyApiErr').innerHTML = data.msg
            } else {
                document.getElementById('titleApiErr').innerHTML = "در خواست شما با مشکل مواجه شد"
                document.getElementById('bodyApiErr').innerHTML = "در خواست شما با مشکل مواجه شد"
            }
            new bootstrap.Toast(document.querySelector('#apiErr', { delay: 10000 })).show();
        }
        resolve({ status, data })
    } catch (error) {
        reject(error)
    }
})

const apiMultipartFormData = (URL, method, token, body) => new Promise(async (resolve, reject) => {
    try {
        const res = await fetch(URL, {
            method: method ?? "GET",
            headers: {
                'Authorization': token,
            },
            body
        })
        const responseInfo = await res
        const data = await res.json()
        const status = responseInfo.status

        if (status == 401) {
            localStorage.removeItem("number");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            window.location.href = "/login"
        }
        if (status == 500) {
            if (data.msg) {
                document.getElementById('titleApiErr').innerHTML = data.msgHead
                document.getElementById('bodyApiErr').innerHTML = data.msg
            } else {
                document.getElementById('titleApiErr').innerHTML = "در خواست شما با مشکل مواجه شد"
                document.getElementById('bodyApiErr').innerHTML = "در خواست شما با مشکل مواجه شد"
            }
            new bootstrap.Toast(document.querySelector('#apiErr', { delay: 10000 })).show();
        }
        resolve({ status, data })
    } catch (error) {
        reject(error)
    }
})

export { api, apiMultipartFormData }