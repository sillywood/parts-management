let roleSchema = require('../Entity/roleEntity')
let roleModel = roleSchema.roleModel
let snowId = require('../../../../utils/snowId')


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


exports.getUserRoleIdList = async function (userId) {
    let roleIdList = []
    await roleModel.find({
        userId: userId
    }, {
        _id: 1
    }).then((err, docs) => {
        if (err) {
            console.log(err);
        } else {
            roleIdList = docs
        }
    })
    return roleIdList
}


exports.saveRole = async function (roleEntity) {
    roleEntity.roleId = roleEntity._id = (new snowId({
        mid: new Date()
    })).generate()
    let id = ''
    await new roleModel(roleEntity).save((err, doc) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(doc);
            id = doc._id
            // console.log(id);
        }
    })
    return id
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
                role = doc
                // console.log(role);
                res(role)
            }
        })
    })
    return role
    
}

exports.update = async function(data){
    let flag = false
    delete data.menuIdList
    await new Promise((res,rej)=>{
        roleModel.updateOne({ roleId: data.roleId }, { $set: data }, (err, raw) => {
            if (err) {
                console.log(err);
            } else {
                if (err) {
                    console.log(err);
                    res('err')
                } else if (raw.ok) {
                    console.log(raw);
                    res(flag = true)
                }
            }
        })
    })
    return flag
}


exports.deleteById = async function(id){
    let flag = false
    await new Promise((res,rej)=>{
        roleModel.deleteOne({ roleId: id }, (err, raw) => {
            if (err) {
                console.log(err);
            } else {
                if (err) {
                    console.log(err);
                    res('err')
                } else if (raw.ok) {
                    console.log(raw);
                    res(flag = true)
                }
            }
        })
    })
    return flag
    
}