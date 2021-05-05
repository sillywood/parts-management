let express = require('express');
let router = express.Router();

let loginService = require('../service/loginService')
let tokenService = require('../../common/token')
let captchaService = require('../service/captchaService')
let userService = require('../service/userService')
router.post("/", (req, res) => {
    let data = req.body
    let username = data.username
    let uuid = data.uuid
    let password = data.password
    let captcha = data.captcha

    
    //验证验证码是否正确
    captchaService.checkCaptcha(captcha, uuid).then(isOk => {
        // console.log(isOk);
        if (isOk == true) {
            //删除该条验证码
            // captchaService.removeCaptchaByUuid(uuid)
            //验证账号密码
            loginService.checkUserInfo(username, password).then((result) => {
                // console.log(result.toJSON().username)
                // console.log(username)
                result = result.toJSON()
                if (result.username == username) {
                    tokenService.setToken(result._id).then((token) => {
                        // console.log(token);
                        res.send({
                            code: 0,
                            msg: '',
                            data: {
                                token: token
                            }
                        })
                    })
                } else {
                    res.send({
                        code: 500,
                        msg: result
                    })
                }
            })
        }else{
            res.send({
                code:402,
                msg:'验证码有误，请刷新'
            })
        }

    })




})

module.exports = router