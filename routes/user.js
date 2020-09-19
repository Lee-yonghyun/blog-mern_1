const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const {
    register_user,
    login_user
} = require('../controller/user')

const passport = require('passport')
const checkAuth = passport.authenticate("jwt",{session:false})



//@ 회원가입
router.post('/registor', register_user)



//@ 로그인 : email 유무 -> return jwt
router.post('/login', login_user)



//@ 현재 유저 정보 가져오기 (서버가 토큰을 발행 -> 헤더에 저장 -> 인증이 필요할때마다, req된 토큰 정보를 서버가 검증한다.)
// 마이페이지 확인하는 것처럼
router.get('/current' , checkAuth, (req,res) => {

    res.json({
        id: req.user.id,
        email:req.user.email,
        name:req.user.name,
        avatar:req.user.avatar,
        password:req.user.password
    })
})
 //payload에 담기지 않은 정보는 가져올 수 없다.


//@전체 유저 정보 가져오기




module.exports = router