const mongoose = require('mongoose')


// schema
let roleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    // createUserId
    // createTime
    roleId: {
        type: Number,
        require: true
    },
    roleName: {
        type: String,
        required: true
    },
    remark: { //备注
        type: String
    },
    createTime:{
        type:Date
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        // updatedAt: 'updated'
    }
})

// let roleMenuSchema = new mongoose.Schema({

// })

exports.roleModel = new mongoose.model('sys_role', roleSchema)