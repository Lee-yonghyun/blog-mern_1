const express = require('express')
const router = express.Router()
const profileModel = require('../models/profile')
const passport = require('passport')
const checkAuth = passport.authenticate("jwt",{session: false})


//프로필 등록

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
            //profile이 있다면?
            if(profile){
                return res.status(200).json({
                    message: "profile already exists, please update profile"
                })
            }
            //profile이 x
            else {
                new profileModel(profileFields)
                    .save()
                    .then(profile => res.status(200).json(profile))
                    .catch(err => {
                        res.status(400).json({
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




module.exports = router