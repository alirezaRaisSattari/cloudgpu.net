const isWindows = (process.platform === "win32")
const makeRoute = () => {
    let isWin = (process.platform === "win32");
    if (isWin) {
        return "public/files"
    } else {
        return "/var/www/html/website/public/files"
    }
}
module.exports = { makeRoute, isWindows };