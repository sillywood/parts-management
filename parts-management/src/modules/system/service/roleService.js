let roleSchema = require('../Entity/roleEntity')
let roleModel = roleSchema.roleModel
let snowId = require('../../../../utils/snowId')
let userRoleSchema = require('../Entity/userRoleEntity')
let userRoleModel = userRoleSchema.userRoleModel
const roleMenuService = require('./roleMenuService')

//分页获取角色列表
exports.getRoleList = function (data) {
    return new Promise((res, rej) => {
        let list = {
            list: [],
            totalCount: ''
        }
        let page = data.page * 1
        let limit = data.limit * 1
        let roleName = data.roleName

        let reg = new RegExp(roleName, 'gi') //模糊查询
        // console.log(reg);
        // roleModel.aggregate([{ $match: { $or: [{ roleName: reg }] } }, { $project: { roleId: "$_id", roleName: 1,remark:1 }}, { $group: {_id:"$roleId" }}])
        roleModel.find({
                roleName: reg
            }, (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    list.totalCount = docs.length * 1
                    // console.log(docs);
                }

            })
            .sort({
                _id: 1
            }).skip((page - 1) * limit).limit(limit).exec((err, docs) => {
                if (err) {
                    console.log(err);
                    list = 'err'
                    res('err')
                } else {
                    list.list = docs
                    // console.log(docs);
                    res(list)

                }
            })

    })

}

//部分也获取角色列表

exports.getAllRoleList =async function(){
    let list = []
    await new Promise((res,rej)=>{
        roleModel.find((err, docs) => {
            if(err){
                rej(err)
            }else{
                
               list = JSON.parse(JSON.stringify(docs)) 
                // console.log(list);
               res(docs)
            }
            
        })
    })
    return list
}




exports.saveRole = async function (roleEntity, menuIdList, creator) {
    let flag = false
    roleEntity.roleId = roleEntity._id = (new snowId({
        mid: new Date()
    })).generate()
    await new Promise((res,rej)=>{
        new roleModel(roleEntity).save((err, doc) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(doc);
                let id = doc._id

                console.log('保存角色成功，开始保存角色菜单');
                let roleMenuEntities = []
                for (let index in menuIdList) {
                    let temp = {
                        roleId: id,
                        menuId: menuIdList[index],
                        creator: creator
                    }
                    roleMenuEntities.push(temp)
                }
                roleMenuService.saveRoleMenus(roleMenuEntities).then(result => {
                    if(result == true){
                        res(flag = true)
                    }else{
                        rej('保存角色菜单关系失败')
                    }
                })
                // console.log(id);
            }
        })
    }).catch(err=>{
        console.log(err);
    })
    return flag
}

exports.getRoleById = async function (id) {
    let role = {}
    await new Promise((res, rej) => {
        roleModel.findOne({
            roleId: id
        }, function (err, doc) {
            if (err) {
                role = 'err'
                res('err')
                console.log(err);
            } else {
                role = JSON.parse(JSON.stringify(doc.toObject()))
                roleMenuService.getRoleMenuIdList(id).then(result=>{
                    role.menuIdList = result
                    res(role)
                }).catch(err=>{
                    rej(err)
                })
                // console.log(role);
            }
        })
    })
    return role
    
}

exports.update = async function(data){
    let flag = false
    let menuIdList = data.menuIdList
    delete data.menuIdList
    await new Promise((res,rej)=>{
        roleModel.updateOne({ roleId: data.roleId }, { $set: data }, (err, raw) => {
            if (err) {
                console.log(err);
            } else {
                    // console.log(raw);
                roleMenuService.update(data.roleId,menuIdList).then(result=>{
                    if(result == true){
                        res(flag = true)
                    }else{
                        rej('保存角色菜单失败')
                    }
                })
            }
        })
    })
    return flag
}


exports.deleteById = async function(id){
    let flag = false
    await new Promise((res,rej)=>{
        roleMenuService.deleteByRoleId(id).then(result=>{
           if(result == true){
                console.log('删除角色-菜单成功，待删除角色');
                roleModel.deleteOne({ roleId: id }, (err, raw) => {
                    if (err) {
                        console.log(err);
                        rej(err)
                    } else {
                        if (raw.ok) {
                            // console.log(raw);
                            console.log('删除角色成功');
                            res(flag = true)
                        } else {
                            rej('删除角色失败')
                        }
                    }
                })
            }
        })
        
    })
    return flag
    
}

exports.getRoleByUserId = async function(id){
    userRoleModel.find({userId:id},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            console.log(docs);
        }
    })
}