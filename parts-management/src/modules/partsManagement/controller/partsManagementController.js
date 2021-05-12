let express = require('express');
let router = express.Router()
const partsManagementService = require('../service/partsManagementService')

router.get('/getDataList',function(req,res){
    let data = req.query
    partsManagementService.getDataList(data).then(result=>{
        res.send({
            code:0,
            page:result
        })
    }).catch(err=>{
        console.log(err);
        res.send({
            code:500,
            msg:err
        })
    })
})

router.post('/save',function(req,res){
    let data = req.body
    partsManagementService.save(data).then(result=>{
        if(result){
            console.log('添加配件目录成功');
            res.send({
                code:0,
                msg:'success'
            })
        }else{
            res.send({
                code:500,
                msg:'服务器内部异常'
            })
        }
    }).catch(err=>{
        console.log('添加配件目录失败：');
        console.log(err);
        res.send({
            code:500,
            msg:err
        })
    })
})

router.post('/update',function(req,res){
    let data = req.body
    partsManagementService.update(data).then(result=>{
        if(result){
            res.send({
                code:0,
                msg:'success'
            })
        } else {
            res.send({
                code: 500,
                msg: '服务器内部异常'
            })
        }
    }).catch(err=>{
        console.log(err);
        res.send({
            code:500,
            msg:err
        })
    })

})

router.post('/delete',function(req,res){
    let id = req.body.id
    partsManagementService.delete(id).then(result=>{
        if(result){
            
            res.send({
                code:0,
                msg:'success'
            })
        }else{
            res.send({
                code: 500,
                msg: '服务器内部错误'
            })
            return result
        }
    }).catch(err=>{
        console.log(err);
    })
})






module.exports = router