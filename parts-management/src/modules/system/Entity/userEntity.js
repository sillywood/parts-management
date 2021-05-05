const mongoose = require('mongoose')


// schema
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {       //状态  0：禁用   1：正常
        type:Number,
        require:true
    }
})

exports.userModel = new mongoose.model('user', userSchema)