let menuSchema = require('../Entity/menuEntity')
let menuModel = menuSchema.menuModel

//获取根目录
exports.getMenus = function (parentId) {
    return menuModel.find({
        parentId: parentId,
        type: {
            $lt: 2
        }
    }, function (err, docs) {
        if (err) {
            console.log("=====================err in menuService=================");
            console.log(err);
        } else {
            return docs
        }
    })
}

//获取菜单列表
exports.getMenuSelect = async function () {
    let menus = []
    await menuModel.find({
        type: {
            $lt: 2
        }
    }, function (err, docs) {
        if (err) {
            console.log('===================err in menuService=========================');
            console.log(err);
        } else {
            menus = JSON.parse(JSON.stringify(docs))
        }
    })
    return menus
}

//获取菜单及按钮
exports.getMenuList = function () {
    return menuModel.find(function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            return docs
        }
    })
}

// 获取菜单栏
exports.getMenuNav = async function (menus) {
    let menuLists = JSON.parse(JSON.stringify(menus))
    for (let menuIndex in menus) {
        // console.log("menuService 19 ===============");
        // console.log(menus[menuIndex]);
        //获取子目录
        await this.getMenus(menus[menuIndex].menuId).then(async (menuChildren) => {
            let menuList = []

            if (menuChildren.length >= 1) { //如果存在子目录，则获取孙目录
                menuList = await this.getMenuNav(menuChildren)
            }
            menuLists[menuIndex].list = menuList
            // console.log("menuService 29 ==============");
            // console.log(menuList);
            // console.log("menuService 31 ==============");
            // console.log(menuLists[menuIndex]);
        })

        //     menuList.push(menus[menuIndex])
    }
    return menuLists
}

//保存菜单
exports.saveMenu = async function (menuEntity) {
    let count = 1
    let flag = false
    await new Promise((res,rej)=>{
        menuModel.aggregate([{
            $group: {
                _id: '',
                max: {
                    $max: "$menuId"
                }
            }
        }]).exec(function (err, result) {
            if (err) {
                console.log(err)
                res('err')
            } else {
                res(count = result[0].max)
            }
        })
    })
    menuEntity.menuId = count + 1
    // console.log(menuEntity.menuId);

    await new Promise((res,rej)=>{
        new menuModel(menuEntity).save((err, doc) => {
            if (err) {
                console.log(err);
                res('err')
            } else {
                // console.log(doc);
                res(flag = true)
            }
        })
    }) 
    // console.log(flag);
    return flag

}

//根据menuId获取菜单
exports.getMenuById = async function (id) {
    let menu = {}
    await menuModel.findOne({
        menuId: id
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            menu = JSON.parse(JSON.stringify(doc))
            // console.log(menu);
        }
    })
    return menu
}


exports.updateMenu = async function(menu){
    delete menu._id
    delete menu.t
    let flag = false
    await new Promise((res,rej)=>{
        menuModel.updateOne({ menuId: menu.menuId }, { $set: menu }, (err, raw) => {
            if (err) {
                console.log(err);
                res('err')
            } else if(raw.ok){
                console.log(raw);
                res(flag = true)
            }
        })
    })
    return flag 
}


exports.deleteMenu = async function(id){
    let flag = false
    await new Promise((res,rej)=>{
        menuModel.deleteOne({menuId:id},function(err,raw){
            if(err){
                console.log(err);
                res('err')
            }else{
                console.log(raw);
                res(flag = true)
            }
        })
    })
    return flag    
}