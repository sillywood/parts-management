let tokenService = require('../../common/token')

exports.logout = function(userId){
    // console.log("logoutService 4 ===========");
    // console.log(userId);
    return tokenService.removeToken(userId).then(res=>{
        if(res == true){
            return true
        }else{
            return res
        }
    })
}