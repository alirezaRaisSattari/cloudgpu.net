const express = require('express')
const router = new express.Router()
const path = require('path')
const filesPath = path.join(__dirname, '../../files')

router.get('', (req, res) => {
    res.render('home', {
        name: "introduce_services",
        filesPath
    })
})

router.get('/getNumberUser', (req, res) => {
    res.render('getNumberUser', {
        name: "getNumberUser",
        filesPath
    })
})

router.get('/login', (req, res) => {
    res.render('getNumberUser', {
        name: "getNumberUser",
        filesPath
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        name: "register",
        filesPath
    })
})

router.get('/login_by_password', (req, res) => {
    res.render('loginByPassword', {
        name: "loginByPassword",
        filesPath
    })
})

router.get('/about_us', (req, res) => {
    res.render('aboutUs', {
        name: "about_us",
        filesPath
    })
})

router.get('/contact_us', (req, res) => {
    res.render('contactUs', {
        name: "contact_us",
        filesPath
    })
})

router.get('/blog', (req, res) => {
    res.render('blog', {
        name: "blog",
        filesPath
    })
})

router.get('/partnership', (req, res) => {
    res.render('partnership', {
        name: "partnership",
        filesPath
    })
})

router.get('/costs', (req, res) => {
    res.render('costs', {
        name: "costs",
        filesPath
    })
})

router.get('/FAQ', (req, res) => {
    res.render('FAQ', {
        name: "FAQ",
        filesPath
    })
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard/dashboard', {
        name: "dashboard",
        filesPath
    });
})

router.get('/dashboard/purchaseGpuService', (req, res) => {
    res.render('dashboard/purchaseGpuService', {
        name: "purchaseGpuService",
        filesPath
    })
})

router.get('/dashboard/factors', (req, res) => {
    res.render('dashboard/factors', {
        name: "factors",
        filesPath
    })
})

router.get('/dashboard/myServices', (req, res) => {
    res.render('dashboard/myServices', {
        name: "myServices",
        filesPath
    })
})

router.get('/dashboard/ticket', (req, res) => {
    res.render('dashboard/ticket', {
        name: "ticket",
        filesPath
    })
})

router.get('/dashboard/userSetting', (req, res) => {
    res.render('dashboard/userSetting', {
        name: "userSetting",
        filesPath
    })
})

router.get('/supporter/login', (req, res) => {
    res.render('supporterDashboard/login', {
        name: "home",
        filesPath
    })
})

router.get('/supporter', (req, res) => {
    res.render('supporterDashboard/access', {
        name: "access",
        filesPath
    })
})
router.get('/supporter/manageServices', (req, res) => {
    res.render('supporterDashboard/manageServices', {
        name: "manageServices",
        filesPath
    })
})
router.get('/supporter/blog', (req, res) => {
    res.render('supporterDashboard/blog', {
        name: "blog",
        filesPath
    })
})
router.get('/supporter/cv', (req, res) => {
    res.render('supporterDashboard/cv', {
        name: "cv",
        filesPath
    })
})
router.get('/supporter/contactUs', (req, res) => {
    res.render('supporterDashboard/contactUs', {
        name: "contactUs",
        filesPath
    })
})
router.get('/supporter/tickets', (req, res) => {
    res.render('supporterDashboard/tickets', {
        name: "tickets",
        filesPath
    })
})
router.get('/supporter/faq', (req, res) => {
    res.render('supporterDashboard/faq', {
        name: "faq",
        filesPath
    })
})
router.get('/supporter/manageUsers', (req, res) => {
    res.render('supporterDashboard/manageUsers', {
        name: "manageUsers",
        filesPath
    })
})
router.get('/supporter/addSupporter', (req, res) => {
    res.render('supporterDashboard/addSupporter', {
        name: "addSupporter",
        filesPath
    })
})
router.get('/supporter/aboutUsContent', (req, res) => {
    res.render('supporterDashboard/aboutUsContent', {
        name: "aboutUsContent",
        filesPath
    })
})
router.get('/supporter/homeContent', (req, res) => {
    res.render('supporterDashboard/homeContent', {
        name: "homeContent",
        filesPath
    })
})
router.get('/test', (req, res) => {
    res.render('test', {
        name: "test",
        filesPath
    })
})
router.get('/blog/*', (req, res) => {
    res.render('blogContent', {
        name: "blog",
        filesPath
    })
})
router.get('/FAQ/*', (req, res) => {
    res.render('faqContent', {
        name: "FAQ",
        filesPath
    })
})

router.get('*', (req, res) => {
    res.render('404', {
        name: "404",
        filesPath

    })
})
module.exports = router;