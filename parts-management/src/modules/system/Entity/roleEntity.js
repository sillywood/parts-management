const mongoose = require('mongoose')


// schema
let roleSchema = new mongoose.Schema({
// createUserId
// createTime
    roleId: {
        type: String,
        required: true
    },
    roleName: {
        type: String,
        required: true
    },
    remark: {
        type:String,
        required:true
    }
})

exports.roleModel = new mongoose.model('sys_role', roleSchema)