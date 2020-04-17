const express = require('express');
require('express-async-errors');
const winston = require('winston');
const app = express();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging');


const port = process.env.PORT || 8888;
app.listen(8888,()=>winston.info(`server created successfully at ${port}`));