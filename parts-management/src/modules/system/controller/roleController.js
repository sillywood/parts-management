let express = require('express');
let router = express.Router();
const roleService = require('../service/roleService')


router.post('/save', function (req, res) {
    let roleEntity = req.body
    let menuIdList = roleEntity.menuIdList
    let rolePromise = roleService.saveRole(roleEntity)
    // console.log(roleId);

    //存角色-菜单表
    // rolePromise.then(roleId=>{
    //     
    // })


    res.send({
        code: 0,
        msg: 'success'
    })
})

router.get('/list', function (req, res) {
    let data = req.query
    roleService.getRoleList(data).then(list => {
        if (list == 'err') {
            res.send({
                code: 1,
                msg: '获取数据失败，请检查roleController/list'
            })
        } else {
            res.send({
                code: 0,
                page: list
            })
        }
    })

})


router.get('/info/:id', function (req, res) {
    let id = req.params.id
    roleService.getRoleById(id).then(role => {
        if (role == 'err') {
            res.send({
                code: 1,
                msg: '获取角色信息失败，请检查info接口'
            })
        } else {
            console.log(role);

            // 获取menuList
            res.send({
                code:0,
                role:role,
                msg: 'success'
            })
        }
    })
})


router.post('/update',function(req,res){
    let data = req.body
    let menuIdList = data.menuIdList
    roleService.update(data).then(result=>{
        if(result){
            res.send({
                code:0,
                msg:'success'
            })
        }else{
            // 更新menuIdList
            res.send({
                code:1,
                msg:'更新失败，请检查update接口'
            })
        }
    })
})

router.post('/delete',function(req,res){
    let id = req.body
    roleService.deleteById(id).then(result => {
        if (result) {
            res.send({
                code: 0,
                msg: 'success'
            })
        } else {
            // 删除menuIdList
            res.send({
                code: 1,
                msg: '删除失败，请检查delete接口'
            })
        }
    })
})

module.exports = router