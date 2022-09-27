import { api } from "../apiModule.js"

if (!token) {
    window.location.href = "/getNumberUser"
}
document.getElementById('username').innerHTML = name

window.exitUser = async () => {
    await api(`/users/logout`, "POST", token)
    localStorage.removeItem("number");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.href = '/getNumberUser'
}