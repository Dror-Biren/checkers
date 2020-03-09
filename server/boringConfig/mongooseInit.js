const mongoose = require('mongoose')

//console.log(process.env.MONGODB_URL)

mongoose.connect('mongodb://127.0.0.1:27017/users-data', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

