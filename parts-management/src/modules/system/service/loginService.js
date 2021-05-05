
let userService = require('./userService')



exports.checkUserInfo = function(username,password){
    return userService.getUserByName(username).then((users)=>{
        // console.log(users);
        if(users.length!=1){
            return "用户不存在"
        }else{
            let user = users[0]
            if (password == user.password) {
                return user
            } else {
                return "用户名或密码错误"
            }
        }
        
    })
}  