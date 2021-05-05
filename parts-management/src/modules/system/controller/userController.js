let express = require('express');
let router = express.Router();
const userService = require('../service/userService')
const roleService = require('../service/roleService')

router.get('/info',async function(req,res){
    let user = JSON.parse(JSON.stringify(await userService.getUserById(req.data.userId)))
    let roleIdList = await roleService.getUserRoleIdList(user._id)
    user.roleList = roleIdList
    res.send({
        code:0,
        msg:'success',
        user:user
    })
    // console.log(user);
})



module.exports = router