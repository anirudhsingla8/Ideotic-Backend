const mongoose = require('mongoose');
const winston = require('winston');
const DB_URL = 'mongodb+srv://anirudh:rj13sl1608@cluster0-lcda6.mongodb.net/keeps?retryWrites=true&w=majority';

module.exports = function(){
    mongoose.connect(DB_URL)
        .then(() => winston.info('successfully connected to mongo db'))
        //.catch(err => console.error("connection failed",err));
        // we have removed catch method as let this rejected promise is handled by our global error handler
}