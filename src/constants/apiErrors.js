const apiErrors = {
    status500(err) {
        return { msg: "سرور با مشکل مواجه شد لطفا دوباره امتحان کنید", msgHead: "خطای سرور", developerError: err };
    },
    invalidInput(err) {
        return { msg: "لطفا مقادیر ورودی را به درستی وارد نمایید", msgHead: "خطای مقادیر", developerError: err };
    },
    noBlog(err) {
        return { msg: "وبلاگ مورد نظر یافت نشد", msgHead: "یافت نشد", developerError: err };
    },
    noText(err) {
        return { msg: "پیام مورد نظر یافت نشد", msgHead: "یافت نشد", developerError: err };
    },
    noFaq(err) {
        return { msg: "پرسش و پاسخ مورد نظر یافت نشد", msgHead: "یافت نشد", developerError: err };
    },
    noService(err) {
        return { msg: "سرویس مورد نظر یافت نشد", msgHead: "یافت نشد", developerError: err };
    },
    duplicatedEmail(err) {
        return { msg: "شما قبلا با این ایمیل ثبت نام کرده اید", msgHead: "یافت نشد", developerError: err };
    },
    noUser(err) {
        return { msg: "کاربر مورد نظر یافت نشد", msgHead: "یافت نشد", developerError: err };
    },
    issueFactor(err) {
        return { msg: "خطا در صدور فاکتور", msgHead: "خطا", developerError: err };
    },
    container(err) {
        return { msg: "با عرض پوزش سرور با مشکل مواجه شد. به زودی پشتیبان های ما مشکل شما را پیگیری کرده و به شما اطلاع میدهند.", msgHead: "کانتینر ساخته نشد", developerError: err };
    },
    activateService(err) {
        return { msg: "خطا در فعال سازی سرویس.", msgHead: "خطا", developerError: err };
    },
    noFreeService(err) {
        return { msg: "سرویس رایگانی وجود ندارد.", msgHead: "خطا", developerError: err };
    },
    noPasswordOrUser(err) {
        return { msg: err, msgHead: "خطا", developerError: err };
    },
}
module.exports = apiErrors