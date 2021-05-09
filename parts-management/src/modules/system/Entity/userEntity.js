const mongoose = require('mongoose')


// schema
let userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    userId:{
        type:Number,
        required:true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: { //状态  0：禁用   1：正常
        type: Number,
        required: true,
        default:1
    },
    creatTime: {
        type: Date
    },
    updateTime: {
        type: Date
    },
    creator:{
        type:Number
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

exports.userModel = new mongoose.model('user', userSchema)