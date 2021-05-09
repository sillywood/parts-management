let userSchema = require('../Entity/userEntity')
let userModel = userSchema.userModel
let snowId = require('../../../../utils/snowId')
const userRoleService = require('./userRoleService')
// 根据用户名获取用户信息
exports.getUserByName = function (username) {
    return userModel.find({
        username: username
    })
}

exports.getUserById = async function (userId) {
    let user = {}
    await userModel.findOne({
        _id: userId
    }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            user = doc
        }
    })

    return user
}

exports.getUserList = async function (data, id) {
    let page = data.page
    let limit = data.limit
    let username = data.username
    let list = {
        list: [],
        total: 0
    }
    let reg = new RegExp(username, 'gi')

    // 管理员查看所有
    if (id == 'super') {
        return new Promise((res, rej) => {
            userModel.find({
                username: reg
            }, (err, docs) => {
                // console.log(docs);
                if (err) {
                    console.log(err);
                } else {
                    list.total = docs.length
                }
            }).sort({
                id: 1
            }).skip((page - 1) * limit).limit(limit).exec((err, docs) => {
                if (err) {
                    rej(err)
                    console.log(err);
                } else {
                    // console.log('========用户查询结果=========');
                    // console.log(docs);
                    list.list = docs
                }
                res(list)
            })
        })
    } else {
        // 其余人只能查看自己创建的用户
        return new Promise((res, rej) => {
            userModel.find({
                username: reg,
                creator: id
            }, (err, docs) => {
                // console.log(docs);
                if (err) {
                    console.log(err);
                } else {
                    list.total = docs.length
                }
            }).sort({
                id: 1
            }).skip((page - 1) * limit).limit(limit).exec((err, docs) => {
                if (err) {
                    rej(err)
                    console.log(err);
                } else {
                    // console.log('========用户查询结果=========');
                    // console.log(docs);
                    list.list = docs
                }
                res(list)
            })
        })
    }


}

exports.updatePassword = async function (id, newPassword) {
    let flag = false
    await new Promise((res, rej) => {
        userModel.updateOne({
            _id: id
        }, {
            $set: {
                password: newPassword
            }
        }).exec((err, raw) => {
            if (err) {
                res(err)
                console.log(err);
            } else {
                if (raw.ok = 1) {
                    res(flag = true)
                } else {
                    console.log(raw);
                }
                res('不成功')
            }
        })
    })

    return flag
}

exports.checkPassWord = async function (id, password) {
    return this.getUserById(id).then(user => {
        //    console.log(password);
        //    console.log(user);
        if (user.password == password) {
            return true
        } else {
            return false
        }
    })
}

exports.removeById = function () {
    let flag = false
    new Promise((res, rej) => {
        userModel.deleteOne({
            userId: id
        }).exec((err, raw) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                if (raw.ok == 1) {
                    flag = true
                    res('成功')
                } else {
                    res('失败')
                }
            }
        })
    })
    return flag

}

/**
 * 
 * @param {*} userEntity 要添加的用户对象
 * @param {Number} id    当前用户id
 * @param {Array} roleIdList 要添加的用户角色列表
 * @returns promise(res) 是否成功
 */

exports.save = async function (userEntity, id, roleIdList) {
    let flag = false
    userEntity._id = userEntity.userId = (new snowId({
        mid: new Date()
    })).generate()
    userEntity.creator = id

    await new Promise((res, rej) => {
        new userModel(userEntity).save((err, doc) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                console.log('添加用户【' + userEntity.username + '】成功');

                let userRoleEntities = []
                for (let index in roleIdList) {
                    let userRoleEntity = {
                        // _id: (new snowId({
                        //     mid: new Date()
                        // })).generate(),
                        userId: userEntity.userId,
                        roleId: roleIdList[index]
                    }
                    userRoleEntities.push(userRoleEntity)
                }

                //存储用户角色关系表
                userRoleService.saveUserRoleList(userRoleEntities).then(result => {
                    if (result == true) {
                        res(flag = true)
                    } else {
                        console.log('用户角色关系表存储失败');
                        res(flag = false)
                    }

                }).catch(err => {
                    rej(err)
                })


            }
        })
    })

    return flag
}


exports.update = async function (userEntity, roleIdList) {
    let flag = false
    await new Promise((res, rej) => {
        userModel.updateOne({
            userId: userEntity.userId
        }, {
            $set: userEntity
        }, (err, raw) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                if (raw.ok == 1) {
                    console.log('更新用户信息成功，待更新角色信息');
                    userRoleService.removeByUserId(userEntity.userId).then(result => {
                        if (result == true) {
                            console.log('删除用户旧角色信息成功，待插入关系数据');

                            let userRoleEntities = []
                            for (let index in roleIdList) {
                                let userRoleEntity = {
                                    // _id: (new snowId({
                                    //     mid: new Date()
                                    // })).generate(),
                                    userId: userEntity.userId,
                                    roleId: roleIdList[index]
                                }
                                userRoleEntities.push(userRoleEntity)
                            }

                            //存储用户角色关系表
                            userRoleService.saveUserRoleList(userRoleEntities).then(result => {
                                if (result == true) {
                                    console.log('用户角色关系插入成功');
                                    res(flag = true)
                                } else {
                                    console.log('用户角色关系表存储失败');
                                    res(flag = false)
                                }
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    // res(flag = true)
                } else {
                    rej('更新失败')
                }
            }
        })
    }).catch(err => {
        console.log(err);
    })
    return flag
}


exports.delete = async function (userIds) {
    let flag = false
    await new Promise((res, rej) => {
        userRoleService.deleteByUserIds(userIds).then(result => {
            if (result == true) {
                console.log('已删除用户-角色关系，待删除用户');
                userModel.deleteMany({
                    userId: {
                        $in: userIds
                    }
                }, (err, raw) => {
                    if (err) {
                        console.log(err);
                        rej(err)
                    } else {
                        console.log('删除用户成功');
                        res(flag = true)
                    }
                })
            }
        }).catch(err => {
            console.log(err);
        })

    })
    return flag
}