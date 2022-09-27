const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')

const axios = require('axios')

const supporterUserRouter = require('./routers/supporterUser')
const blogBannerRouter = require('./routers/blogBanner')
const contactUsRouter = require('./routers/contactUs')
const componentRouter = require('./routers/component')
const templateRouter = require('./routers/templates')
const categoryRouter = require('./routers/category')
const serviceRouter = require('./routers/service')
const ticketRouter = require('./routers/ticket')
const billsRouter = require('./routers/bills')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')
const faqRouter = require('./routers/faq')
const cvRouter = require('./routers/cv')

const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

const app = express()
app.disable('x-powered-by');
const port = process.env.PORT || 4000
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)




const { smsIr } = require('./methods/smsIr')

const otp = async (mobileNumber) => {
    const sms = new smsIr("i9oeNmdl2v9nHOGBWmZ2WEGGXUsh6Q8nIHwX7tWhhT3MA8UEnD4KyNgFgW6yPa2j", "30007732001499")
    sms.SendVerifyCode(mobileNumber, 680365, [{ name: "OTP" }])
}
otp("9010903525")





app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(supporterUserRouter)
app.use(billsRouter)
app.use(blogBannerRouter)
app.use(contactUsRouter)
app.use(componentRouter)
app.use(categoryRouter)
app.use(serviceRouter)
app.use(ticketRouter)
app.use(blogRouter)
app.use(userRouter)
app.use(faqRouter)
app.use(cvRouter)
app.use(templateRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})