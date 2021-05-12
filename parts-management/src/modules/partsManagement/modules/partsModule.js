const mongoose = require('mongoose')
let snowId = require('../../../../utils/snowId')

// schema
let partSchema = new mongoose.Schema({
    _id: {
        type: String,
        // required: true,
    },
    partsId:{
        type:String
    },
    partsName:{
        type:String,
        required:true
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})
partSchema.pre('save',async function (next) {
    // console.log(this);
    if(this.partsId == 0 || this.partsId == ''){
        let idPromise = new Promise((res, rej) => {
            this._id = (new snowId({ mid: new Date() })).generate()
            res('ok')
        })
        idPromise.then(result => {
            next()
        })
    }else{
        this._id = this.partsId
        next()
    }
    
})


exports.partsModel = new mongoose.model('t_parts', partSchema)