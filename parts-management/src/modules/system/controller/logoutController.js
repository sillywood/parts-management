let express = require('express');
let router = express.Router();
let logoutService = require('../service/logoutService')

router.post('/',function(req,res){
    // console.log("logoutController 6 ====================");
    // console.log(req.data.userId);
    logoutService.logout(req.data.userId).then(result=>{
        if (result == true){
            res.send({
                code:0
            })
        }else{
            res.send({
                code:500,
                msg:'退出失败'
            })
        }
    })
})


module.exports = router