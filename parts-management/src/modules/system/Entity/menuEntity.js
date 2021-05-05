const mongoose = require('mongoose')


// schema
let menuSchema = new mongoose.Schema({
    menuId:{
        type:Number,
        required:true
    },
    parentId: {             //父级菜单ID      
        type: Number,
        required: true
    },
    name: {                 //菜单名字
        type: String,
        required: true
    },
    url: {                 //菜单路径
        type: String
    },
    perms: {               //授权
        type: String
    },
    type: {               //类型 0目录 1菜单  2按钮
        type: Number,
        required: true
    },
    icon: {               //菜单图标
        type: String
    },
    orderNum: {          //排序
        type: Number,
        required: true
    },
})

exports.menuModel = new mongoose.model('sys_menu', menuSchema)