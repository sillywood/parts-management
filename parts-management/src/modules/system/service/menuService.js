let menuSchema = require('../Entity/menuEntity')
let menuModel = menuSchema.menuModel


exports.getMenus = function(parentId){
    return menuModel.find({parentId:parentId,type:{$lt:2}},function(err,docs){
        if(err){
            console.log("=====================err in menuService=================");
            console.log(err);
        }else{
            return docs
        }
    })
}

exports.getMenuList = function(){
    return menuModel.find(function(err,docs){
        if(err){
            console.log(err);
        }else{
            return docs
        }
    })
}


exports.getMenuNav =async function(menus){
    let menuLists = JSON.parse(JSON.stringify(menus)) 
    for (let menuIndex in menus){
        // console.log("menuService 19 ===============");
        // console.log(menus[menuIndex]);
        //获取子目录
        await this.getMenus(menus[menuIndex].menuId).then(async(menuChildren)=>{
            let menuList = []

            if (menuChildren.length >= 1) {   //如果存在子目录，则获取孙目录
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

exports.saveMenu = function(menuEntity){
    menuModel.countDocuments((err,count)=>{
        if(err){
            console.log(err);
        }else{
            menuEntity.menuId = count+1
            new menuModel(menuEntity).save((err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
    
}

