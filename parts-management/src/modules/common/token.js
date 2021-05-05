const jwt = require('jsonwebtoken');

//秘钥
let signKey = 'yhjx_token';
//生成token
exports.setToken = function (userId) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            userId: userId
        }, signKey, { expiresIn: 60 * 60 * 24 * 3 });
        // let info = jwt.verify(token.split(' ')[1], signkey)
        // console.log(info);
        console.log('token', token);
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
            console.log(decoded)
        });
        resolve(info);
    })
}