const router = require('express').Router()
const { transactions , users , Sequelize , sequelize } = require('../models/index')
const { Op } = require('sequelize')
const passport = require('passport')
const joi = require('joi')
const generate = require('../utils/generate')
const addValidator = joi.object().keys({
    users_id : joi.number().required(),
    product_name : joi.string().required(),
    product_total_count : joi.number().required(),
    product_price : joi.number().required(),
    product_total_price : joi.number().required(),
    transaction_point : joi.number().required()
})

const updateValidator = joi.object().keys({
    id : joi.number().required(),
    product_name : joi.string().required(),
    product_total_count : joi.number().required(),
    product_price : joi.number().required(),
    product_total_price : joi.number().required()
})

router.get('/index/:limit/:offset' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const limit = parseInt(req.params.limit)
        const offset = parseInt(req.params.offset)
        const data = await transactions.findAll({
            order : [['id' , 'DESC']]
        })
        return res.end(JSON.stringify(data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/get/:id' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const id = req.params.id
        const data = await transactions.findOne({
            where : {
                id : id
            }
        })
        return res.end(JSON.stringify(data , null , 2))
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/index/search/:nama/:limit/:offset' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const limit = parseInt(req.params.limit)
        const offset = parseInt(req.params.offset)
        const nama = req.params.nama
        const data = await transactions.findAll({
            include : [{
                model : users,
                where : {
                    [Op.and] : {
                        id : Sequelize.col('transactions.users_id'),
                        username : {
                            [Op.like] : `%${nama}%`
                        }
                    }
                }
            }],
            limit : limit,
            offset : offset
        })
        return res.end(JSON.stringify(data , null , 2))
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
        const user_data = await users.findOne({
            where : {
                id : data.users_id
            }
        })
        if(!user_data){
            return res.status(404).json({
                server_message : 'user not found',
                status : 'failure'
            })
        }
        if(!error){
            const payload = {
                ...data,
                transaction_id : `T-${generate.randomString(4)}`
            }
            const transaction_created = await transactions.create(payload)
            await users.update({
                users_point : Sequelize.literal('users_point + 5')
            } , {
                where : {
                    id : data.users_id
                }
            })
            return res.status(200).json({
                server_message : 'transaction created',
                status : 'ok',
                callback : transaction_created
            })
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
            const existing_data = await transactions.findOne({
                where : {
                    id : data.id
                }
            })
            if(existing_data){
                const updated = await transactions.update({
                    product_name : data.product_name,
                    product_total_count : data.product_total_count,
                    product_price : data.product_price,
                    product_total_price : data.product_total_price
                } , {
                    where : {
                        id : req.params.id
                    }
                } , transaction)
                await transaction.commit()
                return res.status(200).json({
                    server_message : 'transaction updated',
                    status : 'ok',
                    callback : updated
                })
            } else {
                return res.status(404).json({
                    server_message : 'transaction not found',
                    status : 'failure'
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
        const id = req.params.id
        await transactions.destroy({
            where : {
                id : id
            }
        } , transaction)
        await transaction.commit()
        return res.status(200).json({
            server_message : 'transaction deleted',
            status : 'ok'
        })
    } catch (err) {
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router