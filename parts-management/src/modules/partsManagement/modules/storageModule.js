const mongoose = require('mongoose')
let snowId = require('../../../../utils/snowId')

let storageSchema = new mongoose.Schema({
    _id:{
        type:String
    },
    partsId:{
        type:String,
        require:true
    },
    partsName:{
        type:String,
        require:true
    },
    partsNum:{
        type:Number,
        require:true
    },
    partsInPrice:{
        type:Number,
        require:true
    },
    partsOutPrice:{
        type:Number
    }

})

storageSchema.pre('save', async function (next) {
    // console.log(this);
    if (this._id == '' || this._id == undefined) {
        this._id = (new snowId({ mid: new Date() })).generate()
    }else{
        this.isNew = false
    }
    if (this.partsOutPrice == 0 || this.partsOutPrice == undefined){
        this.partsOutPrice = this.partsInPrice
    }
    next()
})


exports.storageModel = new mongoose.model('t_storage', storageSchema)