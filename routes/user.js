const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')

function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        {expiresIn: '1d'}
    )
}


//@ 회원가입
router.post('/registor',(req,res) => {

    const {name, email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.json({
                    message:'email already existed'
                });
            }

            else{

                const newUser = new userModel({
                    name,
                    email,
                    password
                })

                newUser
                .save()
                .then(user => {

                    console.log(user);

                    res.json({
                        message:'saved data',
                        userInfo:{
                            id:user._id,
                            name:user.name,
                            email:user.email,
                            password:user.password,
                            avatar:user.avatar,
                            date:{
                                createDate:user.createdAt,
                                updateData:user.updatedAt
                            }
                        }
                    })
                })
                .catch(err => {
                    res.json({
                        message:err.message
                    })
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

            if (!user) {
                return res.json({
                    message: 'your email wrong'
                })
            } else {
                //user가 등록되어 있다면?
                user.comparePassword(password, (err, result) => {
                    if (err || result === false) {
                        return res.json({
                            message: "password incorrect"
                        })
                    } else {

                        const payload = {id: user._id, name:user.name, email:user.email, avatar: user.avatar}

                        res.json({
                            success: result,
                            token: tokenGenerator(payload)
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