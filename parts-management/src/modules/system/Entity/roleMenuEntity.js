const mongoose = require('mongoose')
let snowId = require('../../../../utils/snowId')

let roleMenuSchema = new mongoose.Schema({
    _id: {
        type: Number,
        // required: true,
        // default: function () {
        //     return (new snowId({
        //         mid: new Date()
        //     })).generate()
        // }
    },
    menuId: {
        type: Number,
        required: true,
        // default:this._id
    },
    roleId: {
        type: Number,
        required: true
    },
    creatTime: {
        type: Date
    },
    creator: {
        type: Number
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

roleMenuSchema.pre('save', async function(next){
    // console.log(this);
    await new Promise((res,rej)=>{
       this._id = (new snowId({ mid: new Date() })).generate()
       console.log('新数据id为' + this._id);
       res("ok")
    })
    next()
})
exports.roleMenuModel = new mongoose.model('sys_role_menu', roleMenuSchema)