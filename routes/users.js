const _ = require('lodash');
//const asyncMiddleware = require('../middleware/async');
const config = require('config');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const localStorage = require('localStorage');
const {User,register_validation,login_validation} = require('../models/user');


router.get('/',async (req,res) => {
    //throw new Error('could not fetch the users');
    const users = await User.find().sort('email');
    res.send(users);
});

router.post('/register',async (req,res) => {
    const result = register_validation(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered')

    user = new User(_.pick(req.body,['firstname','lastname','email','password']))
    const salt = await bcrypt.genSalt(10);
    user.password =  await bcrypt.hash(user.password,salt);
    // user = new User({
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    user.save()
        .then(user => {
            const token = user.generateAuthToken();
            res.header('x-auth-token',token).send("user successfully registered")
        })
        .catch(err => res.send(err.message));
});

router.post('/login',async (req,res) => {
    const result = login_validation(req.body);
    if (result.error){
        res.send(result.error.details[0].message)
        return;
    }
    let user = await User.findOne({email:req.body.email});
    if (!user) res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if (!validPassword) res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    localStorage.setItem('x-auth-token',token);
    res.header('x-auth-token',token).send(token);
})

module.exports = router;
