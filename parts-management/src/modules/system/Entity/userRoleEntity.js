const mongoose = require('mongoose')
let snowId = require('../../../../utils/snowId')

// schema
let userRoleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        // required: true,
        default: function () {
            return (new snowId({
                mid: new Date()
            })).generate()
        }
    },
    userId: {
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
userRoleSchema.pre('save', function (next) {
    // console.log(this);
    this._id = (new snowId({ mid: new Date() })).generate()
    next()
})
exports.userRoleModel = new mongoose.model('sys_user_Role', userRoleSchema)