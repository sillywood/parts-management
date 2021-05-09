let roleMenuSchema = require('../Entity/roleMenuEntity')
let roleMenuModel = roleMenuSchema.roleMenuModel

exports.saveRoleMenus = async function(roleMenuEntities){
    let flag = false
    await new Promise((res,rej)=>{
        roleMenuModel.create(roleMenuEntities, (err, docs) => {
            if (err) {
                rej(err)
            } else {
                console.log('保存角色菜单成功');
                res(flag=true)
            }
        })
    })
    return flag
}

exports.deleteByRoleId = async function(id){
    return await new Promise((res,rej)=>{
        roleMenuModel.deleteMany({ roleId: id }, (err, raw) => {
            if (err) {
                rej(err)
            } else {
                res(true)
            }
        })
    })
}

exports.getRoleMenuIdList = async function(roleId){
    return new Promise((res,rej)=>{
        roleMenuModel.find({roleId:roleId},{menuId:1},(err,docs)=>{
            if(err){
                console.log(err);
                rej(err)
            }else{
                let data = JSON.parse(JSON.stringify(docs))
                let temp = []
                for(let index in data){
                    temp.push(data[index].menuId)
                }
                res(temp)
            }
        })
    })
    
}

exports.update = async function(roleId,menuIdList){
    return new Promise((res,rej)=>{
        this.deleteByRoleId(roleId).then(result=>{
            if(result== true){
                let roleMenuEntityList = []
                for(let index in menuIdList){
                    let temp = {
                        roleId:roleId,
                        menuId:menuIdList[index]
                    }
                    roleMenuEntityList.push(temp)
                }
                // roleMenuModel.create(roleMenuEntityList,(err,raw)=>{
                //     if(err){
                //         console.log(err);
                //         rej(err)
                //     }else{
                //         res(true)
                //     }
                // })
                this.saveRoleMenus(roleMenuEntityList).then(result=>{
                    if(result ==  true){
                        res(true)
                    }else{
                        rej('保存角色-菜单失败')
                    }
                })
            }
        })
    })
    
}