const mongoose = require('mongoose')


// schema
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

exports.userModel = new mongoose.model('user', userSchema)