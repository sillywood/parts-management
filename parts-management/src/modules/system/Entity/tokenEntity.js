const mongoose = require('mongoose')


// schema
let tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

exports.tokenModel = new mongoose.model('token', tokenSchema)