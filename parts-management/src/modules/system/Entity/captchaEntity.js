const mongoose = require('mongoose')


// schema
let captchaSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
        // default: function () {
        //     return new mongoose.Types.ObjectId()
        // }
    },
    uuid: {
        type: String,
        required: true,
        // unique: true
    },
    code: { //验证码
        type: String,
        required: true
    },
    expireTime: {
        type: String,
        required: true
    }
})


exports.captchaModel = new mongoose.model('captcha', captchaSchema)