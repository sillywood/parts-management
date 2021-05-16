
const storageSchema = require('../modules/storageModule')
let storageModule = storageSchema.storageModel


exports.getDataList = function(params){
    let partsId = params.partsId
    let partsName = params.partsName
    let page = params.page*1
    let limit = params.limit*1
    let partsReg = new RegExp(partsId)
    let nameReg = new RegExp(partsName)
    let list = {
        total:0,
        list:[]
    }
    return new Promise((res,rej)=>{
        storageModule.find({ partsId: partsReg, partsName: nameReg }, (err, docs) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                list.total = docs.length
            }
        }).sort({_id:1}).skip((page-1)*limit).limit(limit).exec((err,docs)=>{
            if(err){
                console.log(err);
                rej(err)
            }else{
                list.list = JSON.parse(JSON.stringify(docs))
                res(list)
            }
        })
    }) 
}

exports.save = function(storageEntityList){
    return new Promise(async (res,rej)=>{
        for(let index in storageEntityList){
            await storageModule.find({_id:storageEntityList[index]._id},(err,docs)=>{
                if(err){
                    console.log(err);
                    rej(err)
                }else{
                    if(docs.length != 0){
                        let newNum = storageEntityList[index].partsNum*1 + docs[0].partsNum*1
                        storageEntityList[index].partsInPrice = ((storageEntityList[index].partsInPrice*1) * (storageEntityList[index].partsNum*1) + (docs[0].partsInPrice*1) * (docs[0].partsNum*1))/(newNum)
                        storageEntityList[index].partsNum = newNum
                    }
                    storageModule.updateOne({ _id: storageEntityList[index]._id }, { $set: storageEntityList[index] }, (err, raw) => {
                        if (err) {
                            rej(err)
                        } else {
                            console.log(raw);
                            res(true)
                        }
                    })
                }
            })
        }
    })
}

/**
 * 
 * @param {Array} details 提交的材料
 * @returns 
 */
exports.outParts = function(details){
    return new Promise(async (res,rej)=>{
        let length = details.length
        for(let i = 0;i<length;i++){
           await storageModule.findOne({partsId:details[i].partsId},(err,doc)=>{
               if(err){
                   console.log(err);
                   rej(err)
               }else{
                   doc.partsNum -= details[i].partsOutNum*1
                //    console.log(doc);
                   doc.save((err,raw)=>{
                       if(err){
                           console.log(err);
                           rej(err)
                       }else{
                           console.log(raw);
                           if(i == length-1 ){
                               res(true)
                           }
                       }
                   })
               }
           })
        }
    })
} 