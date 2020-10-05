const router = require('express').Router()
const passport = require('passport')
const joi = require('joi')
const { rewards , sequelize } = require('../models/index')
const addValidator = joi.object().keys({
    users_point : joi.number().required(),
    rewards : joi.string().required()
})

const updateValidator = joi.object().keys({
    id : joi.number().required(),
    users_point : joi.number().required(),
    rewards : joi.string().required()
})

router.get('/index/:limit/:offset' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    try {
        const limit = parseInt(req.params.limit)
        const offset = parseInt(req.params.offset)
        const data = await rewards.findAll({
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
        const data = await rewards.findOne({
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

router.post('/create' , passport.authenticate('jwt' , { session : false }) , async ( req , res ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        const data = JSON.parse(JSON.stringify(req.body))
        const { error , isValid } = addValidator.validate(data)
        if(!error){
            const rewards_created = await rewards.create(data , { transaction })
            await transaction.commit()
            return res.status(200).json({
                server_message : 'reward created',
                status : 'ok',
                callback : rewards_created
            })
        } else {
            return res.status(500).json(error)
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
            const existing_data = await rewards.findOne({
                where : {
                    id : req.params.id
                }
            })
            if(existing_data){
                const updated = await rewards.update(data, {
                    where : {
                        id : req.params.id
                    }
                } , transaction)
                await transaction.commit()
                return res.status(200).json({
                    server_message : 'reward updated',
                    status : 'ok',
                    callback : updated
                })
            } else {
                return res.status(404).json({
                    server_message : 'reward not found',
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
        const data = await rewards.findOne({
            where : {
                id : req.params.id
            }
        })
        if(data){
            const deleted = await rewards.destroy({
                where : {
                    id : req.params.id
                }
            } , transaction)
            await transaction.commit()
            return res.status(200).json({
                server_message : 'reward deleted',
                status : 'ok',
                callback : deleted
            })
        } else {
            return res.status(404).json({
                server_message : 'reward not found',
                status : 'failure'
            })
        }
    } catch (err) {
        if(transaction) transaction.rollback()
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router