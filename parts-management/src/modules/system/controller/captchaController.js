let svgCaptcha = require('svg-captcha')
let express = require('express');
let router = express.Router();

router.get('/',(req,res)=>{
    let codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    }
    let captcha = svgCaptcha.create(codeConfig);
    // res.setHeader("Cache-Control", "no-store, no-cache");
    // res.setContentType("image/jpeg");
    res.type('svg'); // 响应的类型
    res.send(captcha.data)
})

module.exports = router