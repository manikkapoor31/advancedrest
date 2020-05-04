const mongoose=require('mongoose')
const express=require('express')
const shortid=require('shortid')
const logger =require('./../libs/loggerLib')
const response=require('./../libs/responseLib')
const time=require('./../libs/timeLib')
const validateInput= require('./../libs/paramsValidationLib')

/*Models */
const UserModel=mongoose.model('User')

// start user signup function

let signupFunction=(req,res)=>{
    let validateUseInput=()=>{
        return new Promise((resolve,reject)=>{
            if (req.body.email){
                if(!validateInput.Email(req.body.email)){
                    let apiResponse=response.generate(true,'Email Doesn\'s meet the requirement',400,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(req.body.password)){
                    let apiResponse=response.generate(true,"password param is missing",400,null)
                    reject(apiResponse)

                }
                else{
                    resolve(req)
                }
            }
            else{
                logger.error('Field Missing During User Creation','userController:createUser()',5)
                let apiResponse=response.generate(true,"One or more param is missing",400,null)
                reject(apiResponse)
            }
        })
    }
    let createUser=()=>{
        return newPromise((resolve,reject)=>{
            return new Promise((resolve,reject)=>{
                UserModel.findOne({email:req.body.email}).exec((err,retrievedUserDetails)=>{
                    if(errr){
                        logger.error(err.message,'userController:createUser',10)
                        let apiResponse=response.generate(true,'Failed to create user',500,null)
                        reject(apiResponse)
                    }
                    else if(check.isEmpty(retrievedUserDetails)){
                        console.log(req.body)
                        let newUser=new UserModel({
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName||'',
                            email:req.body.email.toLowerCase(),
                            mobileNumber:req.body.mobileNumber,
                            password:passwordLib.hashpassword(req.body.password),
                            created:time.now()
                        })
                        newUser.save((err,newUser)=>{
                            if(err){
                                console.log(err)
                                logger.error(err.message,'userController:createUser',10)
                                let apiResponse=response.generate(true,'Failed to create new user',500,null)
                                reject(apiResponse)
                            }
                            else{
                                let newUserObj=newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    }
                    else{
                        logger.error('user cannot be created. User already present','usercontroller:createuser',4)
                        let apiResponse=response.generate(true,'user Already Present',403,null)
                        reject(apiResponse)
                    }
                })

            })
        })
    }
    validateUserInput(req,res).then(createUser).then((resolve)=>{
        delete resolve.password
        let apiResponse=response.generate(false,'user created',200,null)
        res.send(apiResponse)
    })

}

let loginFunction=(req,res)=>{
    console.log("findUser");
    return new Promise((resolve,reject)=>{
        if(req.body.email){
            console.log("req body email is there");
            console.log(req.body)
            UserModel.findOne({email:req.body.email},(err,userDetails)=>{
                if(err){
                    console.log(err)
                    logger.error('Failed To Retrieve User Data','userController:findUser()',10)
                    let apiResponse=response.generate(true,'Failed to Find User Details',500,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(userDetails)){
                    logger.error('No user found','usercontroller',findUser(),7)
                    let apiResponse=response.generate(true,'No user details found',404,null)
                    reject(apiResponse)
                }
                else{
                    logger.info('User Found','userController:findUser()',10)
                    resolve(userDetails)
                }
            })
        }
        else{
            let apiResponse=response.generate(true,'email','parameter is missing',400,null)
            reject(apiResponse)

        }
    })

}
let validatePassword=(retrievedUserDetails)=>{
    console.log('Validate Password')
    return new Promise((resolve,reject)=>{
        passwordLib.comparePassword(req.body.password,retreivedUserDetails.password,(err,isMatch)=>{
            if(err){
                console.log(err)
                logger.error(err.message,'userController:validatePassword()',10)
                let apiResponse=response.generate(true,'Login Failed',500,null)
                reject(apiResponse)
            }
            else if(isMatch){
                let retrievedUserDetailsObj=retrievedUserDetails.toObjecct()
                delete retrievedUserDetailsObj.password
                delete retrievedUserDetailsObj._id
                delete retrievedUserDetailsObj.__v
                delete retrievedUserDetailsObj.createdOn
                delete retrievedUserDetailsObj.modifiedOn
                resolve(retrievedUserDetailsObj)
            }
            else{
                logger.info('Login Failed Due to Invalid Password','userController:validatePassword()',10)
                let apiResponse=response.generate(true,'Wrong Password.login Failed',400,null)
                reject(apiResponse)
            }

        })
    })
}
let generateToken=(userDetails)=>{
    console.log('generate token')
    return new Promise((resolve,reject)=>{
        generateToken.generateToken(userDetails,(err,tokenDetails)=>{
            if(err){
                console.log(err)
                let apiResponse=response.generate(true,'Failed to Generate Token',500,null)
                reject(apiResponse)
            }
        }).catch((err)=>{
            console.log('errorhandler')
            console.log(err)
            res.status(err.status)
            res.send(err)
        })
    })
}
let logout=(req,res)=>{

}
module.exports={
    signupFunction:signupFunction,
    loginFunction:loginFunction,
    logout:logout
}