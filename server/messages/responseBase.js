/**
 * Created by Anton on 3/19/2016.
 */

"use strict";

module.exports = {
    resMessage: function(code, message, data) {
        var obj = {
            code: code,
            message: message,
            data: data
        }
        return obj;
    },
    resLogMessage: function(guid, result) {
        return "Res|transId: " + guid + "|result:" + JSON.stringify(result);
    }
};