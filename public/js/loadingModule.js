class Loading {
    templateLoading = (containerElementId) => {
        return `
            <span class="spinner-border spinner-border-sm p-0" id="${containerElementId}" role="status" aria-hidden="true"></span>
            <span class="sr-only p-0">در حال بار‌گذاری</span>
        `
    }
    setLoading = (containerElementId) => {
        if (document.getElementById(`${containerElementId}Loading`)) {
            document.getElementById(`${containerElementId}Loading`).style.display = "unset"
        } else {
            document.getElementById(containerElementId).innerHTML += `
                <div class="text-center p-0" id="${containerElementId}Loading">
                    <div class="spinner-border p-0" role="status">
                        <span class="sr-only p-0">در حال بار‌گذاری</span>
                    </div>
                </div>
            `
        }
        return `${containerElementId}Loading`
    }

    setInnerButtonLoading = (containerElementId) => {
        if (document.getElementById(`${containerElementId}Loading`)) {
            document.getElementById(`${containerElementId}Loading`).style.display = "unset"
        } else {
            document.getElementById(containerElementId).innerHTML = `
                <span class="spinner-border spinner-border-sm p-0" id="${containerElementId}Loading" role="status" aria-hidden="true"></span>
                <span class="sr-only p-0">در حال بار‌گذاری</span>
            `
        }
        return `${containerElementId}Loading`
    }

    setButtonLoading = (containerElementId) => {
        if (document.getElementById(`${containerElementId}Loading`)) {
            document.getElementById(`${containerElementId}Loading`).style.display = "unset"
        } else {
            document.getElementById(containerElementId).innerHTML += `
                <button type="submit" class="btn form-control" disabled id="${containerElementId}Loading">
                    <span class="spinner-border spinner-border-sm p-0" role="status" aria-hidden="true"></span>
                    <span class="sr-only p-0">در حال بار‌گذاری</span>
                </button>
            `
        }
        return `${containerElementId}Loading`
    }

    setOptionLoading = (containerElementId) => {
        if (document.getElementById(`${containerElementId}Loading`)) {
            document.getElementById(`${containerElementId}Loading`).style.display = "unset"
        } else {
            document.getElementById(containerElementId).innerHTML += `
                <option disabled id="${containerElementId}Loading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">در حال بار‌گذاری</span>
                </option>
            `
        }
        return `${containerElementId}Loading`
    }

    removeLoading = (loadingId) => {
        document.getElementById(loadingId).style.display = "none"
    }

    removeInnerLoading = (loadingId, txt) => {
        document.getElementById(loadingId).innerHTML = txt
    }
}
export { Loading }
