const mongoose = require('mongoose')


const profileSchema = new mongoose.Schema()


module.exports = mongoose.model('profile',profileSchema)