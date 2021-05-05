const jwt = require('jsonwebtoken');
const tokenModel = require('../system/Entity/tokenEntity')
let tokenEntity = tokenModel.tokenModel
//秘钥
let signKey = 'yhjx_token';
//生成token
exports.setToken = function (userId) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            userId: userId
        }, signKey, {
            expiresIn: 60 * 60 * 24 * 3
        });
        // let info = jwt.verify(token.split(' ')[1], signkey)
        // console.log(info);
        // console.log('token', token);
       
        let tokenItem = {
            token: token,
            userId: userId
        }
        //存进token表中
        new tokenEntity(tokenItem).save(function (err) {
            if (err) {
                console.log(err);
            }
        })

        resolve(token);
    })
}

//验证token
exports.verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, signKey, (error, decoded) => {
            if (error) {
                console.log(error.message)
                return
            }
            // console.log("decoded: =======================")
            // console.log(decoded);
            return decoded
        });
        // console.log("token 29======================================");
        // console.log(info);
        resolve(info);
    })
}


exports.removeToken = function(userId){
    return new Promise((resolves,rej)=>{
        let flag = false
        tokenEntity.find({ userId: userId }, (err, docs) => {
            if (err) {
                console.log(err);
                resolves(err)
            } else {
                // console.log("token 60============");
                // console.log(docs);
                docs.forEach((item, index, arr) => {
                    item.remove((err) => {
                        if (err) {
                            console.log(err);
                            resolves(err)
                        } else {
                            flag = true
                            // console.log("token 67 ============");
                            // console.log(flag);
                            resolves(flag)
                        }

                    })
                })
            }
        })
    })
}