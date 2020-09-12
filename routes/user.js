const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



//@ 회원가입
router.post('/registor',(req,res) => {

    const {name, email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {

            if (user) {
                return res.json({
                    message:'email already existed'
                })
            }

            else{

                bcrypt.hash (password, 10, (err, hash) => {

                    if(err) {
                        return res.json({
                            message:err.message
                        })
                    }

                    else {
                        const newUser = new userModel({
                            name,
                            email,
                            password:hash
                        })

                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    message:'saved data',
                                    userInfo:user
                                })
                            })
                            .catch(err=>{
                                res.json({
                                    message:err.message
                                })
                            })
                    }
                })
            }
        })

        .catch(err => {
            res.json({
                message:err.message
            })
        })
})

//@ 로그인 : email 유무 -> return jwt

router.post('/login',(req, res) => {

    const {email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {

            if(!user) {
                return res.json({
                    message:'your eamil wrong'
                })
            }

            else{
                //user가 등록되어 있다면?
                bcrypt.compare(password, user.password, (err,result) => {

                    if(err || result === false){
                        return res.json({
                            success:result,
                            message:'password incorrect'
                        })
                    }

                    else{

                        const token = jwt.sign(
                            {email:user.email, userId:user._id},
                            "key",
                            {expiresIn: "1d"}
                        )

                        res.json({
                            success:result,
                            token:token
                        })
                    }
                })
            }
        })

        .catch(err => {
            res.json({
                message:err.message
            })
        })
})


module.exports = router