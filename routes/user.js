const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const {
    register_user,
    login_user,
    current_user,
    all_user
} = require('../controller/user')

const passport = require('passport')
const checkAuth = passport.authenticate("jwt",{session:false})




//@ 회원가입
router.post('/registor', register_user)



//@ 인증이메일을 통해 로그인하기
router.post('/activation',(req,res) => {

    const {token} = req.body //postman으로 확인하기 위해서 직접입력

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err,result) => {

            //토큰이 유효하지 않을때
            if(err) {
                return res.status(401).json({
                    error: "만료된 링크입니다. 다시 등록해주세요"
                })
            }
            //토근이 유효하다 -> 유저정보를 등록한다.
            else {

                const {name, email, password} = jwt.decode(token);

                const newUser = new userModel({
                    name, email, password
                });

                console.log("userInfo ",newUser)

                newUser
                    .save()
                    .then(user => {
                        res.status(200).json({
                            message:"successful sign up",
                            userInfo:user
                        })

                    })
                    .catch(err => {
                        return res.status(400).json({
                            message:err.message
                        })
                    })
            }
        })
    }

})




//@ 로그인 : email 유무 -> return jwt
router.post('/login', login_user)



//@ 현재 유저 정보 가져오기 (서버가 토큰을 발행 -> 헤더에 저장 -> 인증이 필요할때마다, req된 토큰 정보를 서버가 검증한다.)
// 마이페이지 확인하는 것처럼
router.get('/current' , checkAuth, current_user)
 //payload에 담기지 않은 정보는 가져올 수 없다. x -> 가져올수 있다. usermodel에서 가져오기 때문에 가져올 수 있다.



//@전체 유저 정보 가져오기
router.get('/all',checkAuth, all_user)




module.exports = router