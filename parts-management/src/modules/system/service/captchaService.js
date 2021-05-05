let captchaSchema = require('../Entity/captchaEntity')
let captchaModel = captchaSchema.captchaModel
exports.saveCaptcha = function(captchaEntity){
   new captchaModel(captchaEntity).save((err,doc)=>{
        if(!err){
            return true
        }else{
            console.log(err);
        }
    })
}

exports.checkCaptcha = function(captcha,uuid){
    let docsPromise = captchaModel.find({uuid:uuid},(err,docs)=>{
        if(err){
            console.log(err);
        }
    })

    return docsPromise.then(docs=>{
        if(docs.length == 1 ){
            // console.log(docs);
            // console.log(captcha);
            // 不区分大小写
            if (docs[0].code.toLowerCase == captcha.toLowerCase){
                return true
            }else{
                return false
            }
        }
    })
}

exports.removeCaptchaByUuid = function(uuid){
    captchaModel.find({uuid:uuid},(err,docs)=>{
        docs.forEach((item, index, arr)=>{
            item.remove(err=>{
                console.log(err);
            })
        })
    })
}