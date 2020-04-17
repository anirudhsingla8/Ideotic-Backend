const Joi = require('joi');
const mongoose = require('mongoose');

const userItemSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    item: {type:String,required:true},
    date : {type:Date,default:Date.now},
    isCompleted: {type:Boolean,default:false}
});
const UserItem = mongoose.model('userItems',userItemSchema);

function validItem(data){
    const schema = {
        //userId:Joi.string().min(24).max(24).required(),
        item:Joi.string().required()
    }
    return Joi.validate(data,schema);
}

module.exports = {
    UserItem,
    validItem
}