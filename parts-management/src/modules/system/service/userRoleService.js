let userRoleSchema = require('../Entity/userRoleEntity')
let userRoleModel = userRoleSchema.userRoleModel

// exports.save = function(userRoleEntity){
//     userRoleEntity.id = (new snowId({
//         mid: new Date()
//     })).generate()

//     new userRoleModel(userRoleEntity).save()
// }


exports.saveUserRoleList =async function(userRoleEntities){
    let flag = false
    await new Promise((res,rej)=>{
        userRoleModel.create(userRoleEntities, (err, docs) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                // console.log(docs);
                res(flag = true)
            }
        })
    })
    return flag
}

exports.getUserRoleIdList = async function (userId) {
    let roleIdList = []
    await new Promise((res,rej)=>{
        userRoleModel.find({
            userId: userId
        },{roleId:1}, (err, docs) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                // console.log('------------------');
                // console.log(docs);
                for(let index in docs){
                    roleIdList.push(docs[index].roleId)
                }
                // roleIdList = docs
                res('ok')
            }
        })
    })
    return roleIdList
}


exports.removeByUserId = async function(userId){
    let flag = false
    await new Promise((res,rej)=>{
        userRoleModel.deleteMany({ userId: userId }, (err, raw) => {
            if (err) {
                console.log(err);
                rej(err)
            }else{
                res(flag=true)
            }
        })
    })   
    return flag
}

exports.deleteByUserIds = async function(userIds){
    return await new Promise((res,rej)=>{
        userRoleModel.deleteMany({userId:{$in:userIds}},(err,raw)=>{
            if(err){
                console.log(err);
                rej(err)
            }else{
                res(true)
            }
        })
    }).catch(err=>{
        console.log(err);
    })
}