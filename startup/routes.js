const express = require('express');
const items = require('../routes/items');
const home = require('../routes/home');
const users = require('../routes/users');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static('public'));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/users/items',items);
    app.use('/',home);
    app.use('/users',users);
    app.use(error);
}