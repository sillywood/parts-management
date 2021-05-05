let svgCaptcha = require('svg-captcha')
let express = require('express');
let router = express.Router()
let captchaService = require('../service/captchaService')

router.get('/',(req,res)=>{
    let uuid = req.query.uuid
    // console.log('uuid:'+uuid);
    let codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i 
        noise: 4, // 干扰线条的数量
        height: 44
    }
    let captcha = svgCaptcha.create(codeConfig);
    let now = new Date()
    let expireTime = now.getTime()+(5*60*1000)
    let captchaEntity = {
        uuid:uuid,
        code:captcha.text,
        expireTime: expireTime
    }
     captchaService.saveCaptcha(captchaEntity)
    // .then(resolve=>{
    //     if(resolve == true){
            res.type('svg'); // 响应的类型 
            res.send(captcha.data)
    //     }else{
    //         res.send({
    //             code:500,
    //             msg:resolve
    //         })
    //     }
    // })

    // res.setHeader("Cache-Control", "no-store, no-cache");
    // res.setContentType("image/jpeg");
    
})

module.exports = router