const router = require('express').Router()
const passport = require('passport')
const {users , transactions , rewards , Sequelize , sequelize} = require('../models/index')
const joi = require('joi')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const logValidator = joi.object().keys({
    username : joi.string().required(),
    password : joi.string().required()
})
const addValidator = joi.object().keys({
    username : joi.string().required(),
    email : joi.string().required(),
    password : joi.string().required(),
    is_user_admin : joi.string().allow('user' , 'admin').required()
})

const updateValidator = joi.object().keys({
    id : joi.number().required(),
    username : joi.string().required(),
    email : joi.string().required(),
    is_user_admin : joi.string().allow('user' , 'admin').required()
})

/*------------ Login & Register Area ------------*/
router.post('/login' , async ( req , res ) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body))
        const { error , isValid } = logValidator.validate(data)
        if(!error){
            const users_data = await users.findOne({
                where : {
                    username : data.username
                }
            })
            if(users_data){
                console.log(users_data.password)
                const isSamePassword = await bcrypt.compare(data.password , users_data.password)
                if(isSamePassword){
                    const payload_token = {
                        id : users_data.id,
                        username : users_data.username,
                        email : users_data.email,
                        is_user_admin : users_data.is_user_admin
                    }
                    const token = jwt.sign(payload_token , process.env.SECRET_KEY || 'StarkIndustries' , {})
                    return res.status(200).json({
                        server_message : 'login successful',
                        status : 'ok',
                        token : `Bearer ${token}`,
                        data : {
                            ...payload_token,
                            transactions_count : users_data.transactions_count,
                            users_point : users_data.users_point
                        }
                    })
                } else {
                    return res.status(400).json({
                        server_message : 'password didnt match',
                        status : 'failure'
                    })
                }
            } else {
                return res.status(404).json({
                    server_message : 'user not found',
                    status : 'failure'
                })
            }
        } else {
            return res.status(400).json(error)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.post('/register' , async ( req , res ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        const data = JSON.parse(JSON.stringify(req.body))
        const { error , isValid } = addValidator.validate(data)
        if(!error){
            const existing_data = await users.findOne({
                where : {
                    [Op.or] : {
                        email : data.email,
                        username : data.username
                    }
                }
            })
            if(existing_data){
                return res.status(409).json({
                    server_message : 'This email is registered',
                    status : 'failure'
                })
            } else {
                let payload = {
                    username : data.username,
                    email : data.email,
                    password : data.password,
                    transactions_count : 0,
                    users_point : 0,
                    is_user_admin : data.is_user_admin
                }
                const salt = await bcrypt.genSalt(12)
                const hash = await bcrypt.hash(payload.password , salt)
                payload.password = hash
                const user_created = await users.create(payload , { transaction })
                console.log(user_created)
                await transaction.commit()
                return res.status(200).json({
                    server_message : 'register sucessful',
                    status : 'ok'
                })
            }
        } else {
            return res.status(400).json(error)
        }
    } catch (err) {
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})
/*-----------------------------------------------*/

router.get('/index/:limit/:offset' , passport.authenticate('jwt' , { session : false }) , async ( req , res) => {
    try {
        const limit = parseInt(req.params.limit)
        const offset = parseInt(req.params.offset)
        const data = await users.findAll({
            order : [['id' , 'DESC']]
        })
        return res.end(JSON.stringify(data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/index/transactions' , passport.authenticate('jwt' , { session : false }) , async ( req , res) => {
    try {
        const limit = parseInt(req.params.limit)
        const offset = parseInt(req.params.offset)
        const data = await users.findAll({
            where : {
                is_user_admin : 'user'
            },
            order : [['id' , 'DESC']]
        })
        return res.end(JSON.stringify(data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/point/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const data = await users.findOne({
            where : {
                id : req.params.id
            }
        })
        return res.end(JSON.stringify(data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/reward_list/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const data = await users.findOne({
            where : {
                id : req.params.id
            }
        })
        const users_point = data.users_point
        const reward_data = await rewards.findAll({
            where : sequelize.where(
                sequelize.literal('users_point'),
                '>',
                users_point
            )
        })
        return res.end(JSON.stringify(reward_data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/get/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const data = await users.findOne({
            where : {
                id : req.params.id
            }
        })
        return res.end(JSON.stringify(data , null , 20))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.post('/create' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        const data = JSON.parse(JSON.stringify(req.body))
        const { error , isValid } = addValidator.validate(data)
        if(!error){
            const existing_data = await users.findOne({
                where : {
                    [Op.or] : {
                        email : data.email,
                        username : data.username
                    }
                }
            })
            if(existing_data){
                return res.status(409).json({
                    server_message : 'This email is registered',
                    status : 'failure'
                })
            } else {
                let payload = {
                    username : data.username,
                    email : data.email,
                    password : data.password,
                    transactions_count : 0,
                    users_point : 0,
                    is_user_admin : data.is_user_admin
                }
                const salt = await bcrypt.genSalt(12)
                const hash = await bcrypt.hash(payload.password , salt)
                payload.password = hash
                const user_created = await users.create(payload , { transaction })
                console.log(user_created)
                await transaction.commit()
                return res.status(200).json({
                    server_message : 'user created',
                    status : 'ok',
                    callback : user_created
                })
            }
        } else {
            return res.status(400).json(error)
        }
    } catch (err) {
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})


router.put('/update/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        const data = JSON.parse(JSON.stringify(req.body))
        const { error , isValid } = updateValidator.validate(data)
        if(!error){
            const exist = await users.findOne({
                where : {
                    [Op.or] : {
                        email : data.email,
                        username : data.username
                    }
                }
            })
            if(exist){
                return res.status(409).json({
                    server_message : 'This email or username is exist',
                    status : 'failure'
                })
            } else {
                const updated = await users.update({
                    username : data.username,
                    email : data.email,
                    is_user_admin : data.is_user_admin
                } , {
                    where : {
                        id : req.params.id
                    }
                } , transaction)
                await transaction.commit()
                return res.status(200).json({
                    server_message : 'users updated',
                    status : 'ok',
                    callback : updated
                })
            }
            
        } else {
            return res.status(400).json(error)
        }
    } catch (err) {
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})

router.delete('/remove/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        const data = await users.findOne({
            where : {
                id : req.params.id
            }
        })
        if(data){
            const deleted = await users.destroy({
                where : {
                    id : req.params.id
                }
            } , transaction)
            await transaction.commit()
            return res.status(200).json({
                server_message : 'user removed',
                status : 'ok',
                callback : deleted
            })
        } else {
            return res.status(404).json({
                server_message : 'user not found',
                status : 'failure'
            })
        }
    } catch (err){
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router