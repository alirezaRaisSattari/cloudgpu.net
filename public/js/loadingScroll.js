
const scrollLoader = (callback) => {
    window.addEventListener('scroll', (e) => {
        if (
            (document.documentElement.scrollHeight - document.documentElement.scrollTop) >=
            document.documentElement.clientHeight &&
            (document.documentElement.scrollHeight - document.documentElement.scrollTop) <=
            document.documentElement.clientHeight + 100
        ) {
            callback()
        }
    }, false);
}
export { scrollLoader }