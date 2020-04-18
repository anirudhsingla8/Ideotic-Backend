const express = require('express');
const router = express.Router();
//const asyncMiddleware = require('../middleware/async');
const {User} = require('../models/user');
const {UserPost,validPost} = require('../models/userposts')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')

router.get('/',auth,async (req,res) => {
    try{
        const result = await UserPost.find({})
        if(result.length) {
            res.status(200).send(result)
        }
        else res.send("Currently no post to display")
    }
    catch(error){
        console.log('error', error)
        res.status(400).send(error.message)
    }
});

router.get('/:id?',auth,async (req,res) => {
    try{
        const result = await UserPost.find({userId:req.params.id})
        if(result.length) {
            res.status(200).send(result)
        }
        else res.send("no record found with this User")
    }catch (error) {
        console.log('error', error)
        res.status(400).send(error.message)
    }
});

router.put('/comment',auth,async (req,res) => {
    const post_id = req.body.post_id;
    const post = await UserPost.findOne({_id:post_id})
    post.updateOne(
        {
            '$push':{'comments':req.body.comment}
        })
        .then(() => res.status(200).send('successfully updated'))
        .catch(err => res.status(400).send('error occurred'));
})

router.put('/like',auth,async (req,res)=>{
    const post_id = req.body.post_id;
    const post = await UserPost.findOne({_id:post_id})
    post.updateOne(
        {
            '$addToSet':{'like_array':req.user._id}
            //'$set':{'like':post.like_array.length}
        })
        .then(() => res.status(200).send('successfully updated'))
        .catch(err => res.status(400).send('error occurred'));

});

router.post('/add',auth,async (req,res) => {
    const result = validPost(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    else{
        const userPost = new UserPost({
            userId: req.user._id,
            post: req.body.post
        })

        userPost.save()
            .then(()=> res.status(200).send('record successfully added'))
            .catch(err => res.status(400).send('err.message'))
        // try{
        //     const result = await User.findOne({_id:req.body.userId})
        //     if(result) {
        //     await userPost.save()
        //     res.status(200).send("record successfully added")
        //     }
        //     else res.send("no user found with this ID")
        // }catch (error) {
        //     console.log('error', error)
        //     res.status(400).send(error.message)
        // }
    }
});

router.put('/update/:id',auth,async (req,res)=>{
    const result = validPost(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    else{
        const userPost = await UserPost.findOne({_id:req.params.id})
        try{
            if (userPost.userId==req.body.userId){
                userPost.post = req.body.post
                await userPost.save()
                res.status(200).send('record successfully updated')
            }else{
                res.send('sorry you are not authorised to update this record');
            }
        }catch (error) {
            res.status(400).send(error.message)
        }
        res.send(userPost);
    }
});

router.delete('/delete/:id',[auth,admin],async (req,res)=>{
    const result = validPost(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    else{
        const userPost = await UserPost.findOne({_id:req.params.id})
        try{
            if (userPost.userId==req.body.userId){
                await userPost.deleteOne()
                res.status(200).send('record successfully deleted')
            }else{
                res.send('sorry you are not authorised to delete this record')
            }
        }catch (error) {
            res.status(400).send(error.message)
        }
        res.send(userPost)
    }
    // try{
    //     const result = await UserPost.findOne({_id:req.params.id})
    //     res.status(200).send(req.body.userId)
    // }catch (error) {
    //     res.status(400).send(error.message)
    // }
});

module.exports = router;