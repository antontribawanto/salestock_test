/**
 * Created by Anton on 3/19/2016.
 */

var fs = require('fs');
var path = require("path");
var FileStreamRotator = require('file-stream-rotator');
var winston = require('winston');

var logDirectory = path.join(__dirname, '..', '/log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var winstonLogger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});

//
// Replaces the previous transports with those in the
// new configuration wholesale.
//
winstonLogger.configure({
    level: 'info',
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: logDirectory + '/messages.log',
            json: false
        })
    ]
});

module.exports = winstonLogger;
