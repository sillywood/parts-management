const partSchema = require('../modules/partsModule')
let partsModule = partSchema.partsModel

exports.getDataList =async function(data){
    let partsName = data.partsName
    let page = data.page
    let limit = data.limit
    let list = {
        total:0,
        list:[]
    }
    let reg = new RegExp(partsName,'gi')
    let idReg = new RegExp(data.partsId,'gi')
    return await new Promise((res,rej)=>{
        partsModule.find({ partsName: reg, partsId: idReg}, function (err, docs){
            if(err) {
                rej(err)
            }else{
                list.total = docs.length
            }
        }).sort({_id:1}).skip((page-1)*limit).limit(limit).exec((err,docs)=>{
            if(err){
                rej(err)
            }else{
                list.list = docs
                res(list)
            }
            
        })
    })
    

}

exports.save = async function(data){
    return new Promise((res,rej)=>{
        partsModule.create(data, (err, docs) => {
            if (err) {
                console.log(err);
                rej(err)
            }else{
                res(true)
            }
        })
    })
}

exports.update = async function(data){
    return new Promise((res,rej)=>{
        partsModule.updateOne({partsId:data.partsId},{$set:data},(err,raw)=>{
            if(err){
                console.log(err);
                rej(err)
            }else{
                console.log(raw);
                res(true)
            }
        })
    })
}

exports.delete = async function(id){
    return new Promise((res,rej)=>{
        partsModule.deleteOne({ _id: id }, (err, raw) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                console.log('删除配件类型成功！');
                console.log(raw);
                res(true)
            }
        })
    })
}

exports.getAllList =async function(){
    return new Promise((res,rej)=>{
        partsModule.find((err, docs) => {
            if (err) {
                console.log(err);
                rej(err)
            } else {
                res(JSON.parse(JSON.stringify(docs)))
            }
        })
    }) 
}