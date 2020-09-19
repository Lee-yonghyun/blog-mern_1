const express = require('express')
const router = express.Router()
const profileModel = require('../models/profile')
const passport = require('passport')
const checkAuth = passport.authenticate("jwt",{session: false})


//프로필 등록 및 업데이트 (put없이 !)
router.post('/registor',checkAuth,(req,res) => {

    const profileFields ={};

    profileFields.user = req.user.id //checkAuth에서 받아온 id (payload에 담긴)

    if(req.body.introduce) profileFields.introduce = req.body.introduce;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.gender) profileFields.gender = req.body.gender;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    if(typeof req.body.skills !== "undefined" || req.body.skills.length !==0 ){
        profileFields.skills = req.body.skills.split(",");
    }

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {
            //profile이 있다면? --> 수정
            if(profile){

                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => {
                        res.status(200).json(profile)
                    })
                    .catch(err => {
                        res.status(404).json({
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


// 프로필 가져오기 (사용자)
router.get('/',checkAuth,(req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {
            //프로필 등록 x
            if(!profile){
                return res.status(200).json({
                    message:"no profile"
                })
            }
            else {
                res.status(200).json(profile)
            }
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
})

// 프로필 모두 가져오기 (모든 사용자가  사용하는 기능)
router.get('/total', (req,res) => {

    profileModel
        .find()
        .populate("user","name email avatar")
        // .populate("user",["name","email","avatar"])
        .then(profiles => {

            if (profiles.length === 0) {
                return res.status(200).json({
                    message:"profile not exists"
                })
            }
            else {
                res.status(200).json({
                    count:profiles.length,
                    profiles:profiles
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })

})


module.exports = router