const winston = require('winston');
require('express-async-errors');
//require('winston-mongodb');

module.exports = function () {
    // process.on('uncaughtException', (err) => {
    //     winston.error(err.message,err);
    //     process.exit(1);
    // });
    // instead of using above three lines winston has this inbuilt handle Exceptions to catch exceptions
    winston.handleExceptions(
        new winston.transports.Console({colorize:true,prettyPrint:true}),
        new winston.transports.File({filename:'uncaughtExceptions.log'})
    );
    process.on('unhandledRejection', (err) => {
        throw err;
        //winston does not have method for unhandledRejection so we can use use throw err instead of below 2 lines . winston.handleExceptions will automatically catch this throw err.
        // winston.error(err.message,err);
        // process.exit(1);
    })
    winston.add(winston.transports.File,{ filename: 'logfile.log'});
    //winston.add(winston.transports.MongoDB,{db: DB_URL});
    //throw new Error('something failed during startup');
    // const p = Promise.reject(new Error('something miserable'));
    // p.then(() => console.log('done'));
}