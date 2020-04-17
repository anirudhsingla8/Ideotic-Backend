const Joi = require('joi');
const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    post: {type:String,required:true},
    date : {type:Date,default:Date.now},
    isCompleted: {type:Boolean,default:false}
});
const UserPost = mongoose.model('userPosts',userPostSchema);

function validPost(data){
    const schema = {
        //userId:Joi.string().min(24).max(24).required(),
        post:Joi.string().required()
    }
    return Joi.validate(data,schema);
}

module.exports = {
    UserPost,
    validPost
}