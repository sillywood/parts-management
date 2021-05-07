let express = require('express');
let router = express.Router();
const menuService = require('../service/menuService')
let appObj = null

//返回导航栏
router.get('/nav', async function (req, res) {
    //获取根目录
    await menuService.getMenus(0).then(async menus => {
        let menuNavList = await menuService.getMenuNav(menus)
        let menuList = await menuService.getMenuList()
        let permissions = []
        // console.log(appObj.SUPER_USER);
        // console.log(menuList);
        if (req.data.userId == appObj.SUPER_USER) {
            for (let index in menuList) {
                if (menuList[index].perms != '') {
                    permissions = permissions.concat(menuList[index].perms.split(','))
                }
            }
            permissions = unique(permissions)
            // console.log(permissions);
        }
        res.send({
            code: 0,
            menuList: menuNavList,
            permissions: permissions
        })
    })

})

//数组去重
function unique(arr) {
    //Set数据结构，它类似于数组，其成员的值都是唯一的
    return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
}

//返回全部菜单
router.get('/list', async function (req, res) {
    let menuList = await menuService.getMenuList()
    res.send(menuList)
})

//返回非按钮菜单
router.get('/select', async function (req, res) {
    let menus = await menuService.getMenuSelect()
    let rootMenu = {
        menuId: 0,
        parentId: -1,
        name: "一级菜单",
        open: true
    }
    // console.log(menus);
    // let menus = docs.toString()
    menus.push(rootMenu)

    res.send({
        'msg': 'success',
        'code': 0,
        'menuList': menus
    })
})

//返回菜单详情
router.get('/info/:id',async function(req,res){
    let id = req.params.id
    let menu =await menuService.getMenuById(id)
    // console.log(menu);
    res.send({
        code:0,
        menu:menu,
        msg:'success'
    })
    // console.log("======================================getMenuInfo=============================");
    // console.log(id);
})

router.post('/save',async function(req,res){
    let menu = req.body
    let isOk =await menuService.saveMenu(menu)
    if(isOk){
        res.send({
            code:0,
            msg:'success'
        })
    }else{
        res.send({
            code:500,
            msg:'保存失败'
        })
    }

})


router.post('/update',async function(req,res){
    let menu = req.body
    // console.log(menu);
    let isOk = menuService.updateMenu(menu)
    if (isOk) {
        res.send({
            code: 0,
            msg: 'success'
        })
    } else {
        res.send({
            code: 500,
            msg: '修改失败'
        })
    }
})

router.post('/delete/:id',async function(req,res){
    let id = req.params.id
    let isOk = menuService.deleteMenu(id)
    if (isOk) {
        res.send({
            code: 0,
            msg: 'success'
        })
    } else {
        res.send({
            code: 500,
            msg: '删除失败'
        })
    }
})
module.exports = function (app) {
    appObj = app
    return router
}


// let menus = [{
//     menuId: 1,
//     parentId: 0,
//     name: '系统管理',
//     url: '',
//     perms: '',
//     type: 0,
//     icon: 'system',
//     orderNum: 0
// }, {
//         menuId: 2,
//         parentId: 1,
//         name: '管理员列表',
//         url: 'sys/user',
//         perms: '',
//         type: 1,
//         icon: 'admin',
//         orderNum: 1
//     }, {
//         menuId: 3,
//         parentId: 1,
//         name: '角色管理',
//         url: 'sys/role',
//         perms: '',
//         type: 1,
//         icon: 'role',
//         orderNum: 2
//     }, {
//         menuId: 4,
//         parentId: 1,
//         name: '菜单管理',
//         url: 'sys/menu',
//         perms: '',
//         type: 1,
//         icon: 'menu',
//         orderNum: 3
//     }, {
//         menuId: 5,
//         parentId: 1,
//         name: 'SQL监控',
//         url: 'http://localhost:8080/renren-fast/druid/sql.html',
//         perms: '',
//         type: 1,
//         icon: 'sql',
//         orderNum: 4
//     }, {
//         menuId: 6,
//         parentId: 1,
//         name: '定时任务',
//         url: 'job/schedule',
//         perms: '',
//         type: 1,
//         icon: 'job',
//         orderNum: 5
//     }, {
//         menuId: 7,
//         parentId: 6,
//         name: '查看',
//         url: '',
//         perms: 'sys:schedule:list,sys:schedule:info',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 8,
//         parentId: 6,
//         name: '新增',
//         url: '',
//         perms: 'sys:schedule:save',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 9,
//         parentId: 6,
//         name: '修改',
//         url: '',
//         perms: 'sys:schedule:update',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 10,
//         parentId: 6,
//         name: '删除',
//         url: '',
//         perms: 'sys:schedule:delete',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 11,
//         parentId: 6,
//         name: '暂停',
//         url: '',
//         perms: 'sys:schedule:pause',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 12,
//         parentId: 6,
//         name: '恢复',
//         url: '',
//         perms: 'sys:schedule:resume',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 13,
//         parentId: 6,
//         name: '立即执行',
//         url: '',
//         perms: 'sys:schedule:run',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 14,
//         parentId: 6,
//         name: '日志列表',
//         url: '',
//         perms: 'sys:schedule:log',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 15,
//         parentId: 2,
//         name: '查看',
//         url: '',
//         perms: 'sys:user:list,sys:user:info',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 16,
//         parentId: 2,
//         name: '新增',
//         url: '',
//         perms: 'sys:user:save,sys:role:select',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 17,
//         parentId: 2,
//         name: '修改',
//         url: '',
//         perms: 'sys:user:update,sys:role:select',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 18,
//         parentId: 2,
//         name: '删除',
//         url: '',
//         perms: 'sys:user:delete',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 19,
//         parentId: 3,
//         name: '查看',
//         url: '',
//         perms: 'sys:role:list,sys:role:info',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 20,
//         parentId: 3,
//         name: '新增',
//         url: '',
//         perms: 'sys:role:save,sys:menu:list',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 21,
//         parentId: 3,
//         name: '修改',
//         url: '',
//         perms: 'sys:role:update,sys:menu:list',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 22,
//         parentId: 3,
//         name: '删除',
//         url: '',
//         perms: 'sys:role:delete',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 23,
//         parentId: 4,
//         name: '查看',
//         url: '',
//         perms: 'sys:menu:list,sys:menu:info',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 24,
//         parentId: 4,
//         name: '新增',
//         url: '',
//         perms: 'sys:menu:save,sys:menu:select',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 25,
//         parentId: 4,
//         name: '修改',
//         url: '',
//         perms: 'sys:menu:update,sys:menu:select',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 26,
//         parentId: 4,
//         name: '删除',
//         url: '',
//         perms: 'sys:menu:delete',
//         type: 2,
//         icon: '',
//         orderNum: 0
//     }, {
//         menuId: 27,
//         parentId: 1,
//         name: '参数管理',
//         url: 'sys/config',
//         perms: 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
//         type: 1,
//         icon: 'config',
//         orderNum: 6
//     }, {
//         menuId: 29,
//         parentId: 1,
//         name: '系统日志',
//         url: 'sys/log',
//         perms: 'sys:log:list',
//         type: 1,
//         icon: 'log',
//         orderNum: 7
//     }, {
//         menuId: 30,
//         parentId: 1,
//         name: '文件上传',
//         url: 'oss/oss',
//         perms: 'sys:oss:all',
//         type: 1,
//         icon: 'oss',
//         orderNum: 6
//     }]

// for(let index in menus){
//     menuService.saveMenu(menus[index])
// }