const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')



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

                const avatar = gravatar.url(email, {
                    s: "200", //크기
                    r: "pg", //형식
                    d: "mm" //단위
                })

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
                            password:hash,
                            avatar:avatar
                        })

                        newUser
                            .save()
                            .then(user => {
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