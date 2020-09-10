const mongoose = require('mongoose')

const dboptions ={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}

mongoose
    .connect(process.env.MONGO_URL,dboptions)
    .then(() => console.log('mongoDB connected...'))
    .catch(err => console.log(err.message))


