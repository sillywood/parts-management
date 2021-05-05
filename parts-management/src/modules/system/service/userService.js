
let userSchema = require('../Entity/userEntity')
let userModel = userSchema.userModel

// 根据用户名获取用户信息
exports.getUserByName = function (username) {
    return userModel.find({ username: username })
}

exports.getUserById = function(userId){
    return userModel.findOne({_id:userId})
}