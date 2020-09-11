const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password:{
            type: String,
            required: true
        },
        avatar:{
            type:String
        },
        role:{
            type:String,
            default:"user"
        },
        resetPasswordLink: ""
    },
    {
        timestamps: true
    }
)



module.exports = mongoose.model('user',userSchema)