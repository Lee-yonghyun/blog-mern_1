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

            if (!profile) {
                new profileModel(profileFields)
                    .save()
                    .then(profile => {
                        res.status(200).json(profile)
                    })
                    .catch(err => {
                        res.status(500).json({
                            message:err.message
                        })
                    })
            }
            else {
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


//프로필 삭제 (개인)
router.delete('/',checkAuth ,(req,res) => {

    profileModel
        .findOneAndDelete({user:req.user.id})
        .deleteOne({user:req.user.id})
        .then(() => {
            res.status(200).json({
                message:"delete profile"
            })
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })

})


//@add experience
router.post("/experience",checkAuth, (req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            console.log("profile =", profile)

            const newExperience = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            };

            profile.experience.unshift(newExperience) //unshift experience 인덱스의 첫번째로 추가!

            profile //지금까지는 new model을 만들어서 데이터베이스에 세이브 , 여기는 찾은거를 세이브
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.message
                    })
                })

        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})


//Delete Experience
//@route    POST http://localhost:6001/profile/experience/:exp_id
//@desc     delete experience from profile
//@access   Private
router.delete("/experience/:exp_id",checkAuth,(req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            const removeIndex = profile.experience
                .map(item => item.id) // [id, id] 형태가 출력된다. [id1 , id2].indexOf(id1) => id1의 index가 출력된다.
                .indexOf(req.params.exp_id)

            profile.experience.splice(removeIndex,1) // experience의 요소 삭제

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.messgae
                    })
                })
        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})



//@add education
router.post("/education",checkAuth, (req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            console.log("profile =", profile)

            const newEducation = {
                school : req.body.school,
                degree : req.body.degree,
                fieldOfStudy : req.body.fieldOfStudy,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            };

            profile.education.unshift(newEducation) //unshift education 인덱스의 첫번째로 추가!

            profile //수정된 profile을 model에 저장하기!
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.message
                    })
                })

        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})


//Delete Education
//@route    POST http://localhost:6001/profile/education/:exp_id
//@desc     delete education from profile
//@access   Private
router.delete("/education/:exp_id",checkAuth,(req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            const removeIndex = profile.education
                .map(item => item.id) // [id, id] 형태가 출력된다. [id1 , id2].indexOf(id1) => id1의 index가 출력된다.
                .indexOf(req.params.exp_id)

            profile.education.splice(removeIndex,1) // experience의 요소 삭제

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.messgae
                    })
                })
        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})


module.exports = router