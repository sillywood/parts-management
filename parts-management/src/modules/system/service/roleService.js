let roleSchema = require('../Entity/roleEntity')
let roleModel = roleSchema.roleModel

exports.getRoleList =async function(userId){
   
}


exports.getUserRoleIdList = async function(userId){
    let roleIdList = []
    await roleModel.find({ userId: userId }, { _id: 1}).then((err, docs) => {
        if (err) {
            console.log(err);
        } else {
            roleIdList = docs
        }
    })
    return roleIdList
}
