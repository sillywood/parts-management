let express = require('express');
let router = express.Router()
const storageService = require('../service/storageService')

router.get('/getDataList',function(req,res){
    let params = req.query
    storageService.getDataList(params).then(result=>{
        res.send({
            code:0,
            msg:'success',
            page:result
        })
    })
})

router.post('/save',function(req,res){
    let storageEntityList = req.body.storages
    storageService.save(storageEntityList).then(result=>{
        if(result == true){
            res.send({
                code:0,
                msg:'success'
            })
        }else{
            res.send({
                code:500,
                msg:'服务器内部异常'
            })
            return result
        }
    }).catch(err=>{
        console.log(err);
        res.send({
            code:500,
            msg:'服务器内部异常'
        })
    })
})

router.post('/outDetail',function(req,res){
    let data = req.body
    let details = data.details
    let custom = data.custom 
    storageService.outParts(details)
    .catch(err=>{
        console.log(err);
        res({
            code:500,
            msg:err
        })
    })
})


module.exports = router