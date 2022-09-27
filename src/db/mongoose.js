const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cloud_gpu', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})