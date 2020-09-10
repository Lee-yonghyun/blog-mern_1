const express = require('express')
const router = express.Router()
const userModel = require('../models/user')


router.post('/registor',(req,res) => {

    const {name, email, password} = req.body

    const newUser = new userModel({
        name,
        email,
        password
    })

    newUser
        .save()
        .then(user => {
            res.json({
                message:'saved data',
                userInfo: user
            })
        })
        .catch(err => {
            res.json({
                message:err.message
            })
        })
})



module.exports = router