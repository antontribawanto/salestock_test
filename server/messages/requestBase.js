/**
 * Created by Anton on 3/19/2016.
 */

"use strict";

var guid  = require('../utils/common');

module.exports = {
    reqMessage: function() {
        var obj = {
            transId: guid.generateGuid()
        };

        return obj;
    },
    reqLogMessage: function(guid, req) {
        return "Req|transId: " + guid + " " + req.baseUrl + req.url + "|params: " + JSON.stringify(req.body);
        //return JSON.stringify({
        //    transId: guid.generateGuid(),
        //    req: input
        //})
    }
};