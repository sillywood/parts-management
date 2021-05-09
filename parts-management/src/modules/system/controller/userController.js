let express = require('express');
let router = express.Router();
const userService = require('../service/userService')
const roleService = require('../service/roleService')
const token = require('../../common/token')
const userRoleService = require('../service/userRoleService')

router.get('/list',async function(req,res){
    let data = req.query
    let id = req.data.userId
    if ( id == appObj.SUPER_USER){
        id = 'super'
    }
    userService.getUserList(data,id).then(list=>{
        res.send({
            code:0,
            page:list,
            msg:'success'
        })
    }).catch((e)=>{
        res.send({
            code:500,
            msg:'服务器异常'
        })
    })

})

router.get('/info', async function (req, res) {
    let user = JSON.parse(JSON.stringify(await userService.getUserById(req.data.userId)))
    userRoleService.getUserRoleIdList(user._id).then(roleIdList=>{
        user.roleList = roleIdList
        res.send({
            code: 0,
            msg: 'success',
            user: user
        })
    })
    
    // console.log(user);
})

router.get('/info/:id',async function(req,res){
    let id = req.params.id
    // console.log(id);
    userService.getUserById(id).then(async user=>{
        // console.log(user);
        let userInfo = JSON.parse(JSON.stringify(user.toObject()))
        await userRoleService.getUserRoleIdList(userInfo._id).then(roleIdList=>{
            // console.log('==============================');
            // console.log(roleIdList);
            userInfo.roleIdList = roleIdList
            // console.log('++++++++++++++++++++++++++++++++++++++++');
            // console.log(userInfo);
            res.send({
                code: 0,
                user: userInfo,
                msg: 'success'
            })
        })
        
    }).catch(err=>{
        console.log(err);
        res.send({
            code:500,
            msg:'服务器内部异常'
        })
    })
})

router.post('/password', function (req, res) {
    let id = req.data.userId
    let password = req.body.password
    let newPassword = req.body.newPassword
    userService.checkPassWord(id, password).then(result => {
        // console.log(result);
        if (result == true) {
            userService.updatePassword(id, newPassword).then(flag => {
                // console.log(flag);
                if (flag == true) {
                    token.removeToken(id).then(isOk => {
                        if (isOk) {
                            res.send({
                                code: 0,
                                msg: 'success'
                            })
                        } else {
                            res.send({
                                code: 0,
                                msg: 'token未删除'
                            })
                        }
                    })
                } else {
                    res.send({
                        code: 1,
                        msg: '修改失败'
                    })
                }
            })
        } else {
            res.send({
                code: 1,
                msg: '原密码错误'
            })
        }
    })
})

router.post('/save',function(req,res){
    let user = req.body
    let roleIdList = user.roleIdList
    userService.save(user,req.data.userId,roleIdList).then(result=>{
        if(result == true){
            res.send({
                code:0,
                msg:'success'
            })
        }else{
            res.send({
                code:500,
                msg:'服务器异常'
            })
        }
    })
})

router.post('/update',function(req,res){
    let data = req.body
    let roleIdList = data.roleIdList
    delete data.roleIdList 
    userService.update(data,roleIdList).then(result=>{
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
        }
    })
})

router.post('/delete',function(req,res){
    let userIds = req.body
    if(userIds.filter(item=>{ return (item == req.data.userId || item == appObj.SUPER_USER) }).length>0){
        res.send({
            code:500,
            msg:'不能删除当前用户或超级管理员！'
        })
    }else{
        // console.log(userIds);
        userService.delete(userIds).then(result => {
            if (result == true) {
                res.send({
                    code: 0,
                    msg: 'success'
                })
            } else {
                res.send({
                    code: 500,
                    msg: '服务器内部异常'
                })
            }
        })
    }
   
})

module.exports = function(app){
    appObj = app
    return router
}