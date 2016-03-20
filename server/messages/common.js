/**
 * Created by Anton on 3/19/2016.
 */

"use strict";

module.exports = {
    INSERT_SUCCESS : "Success to add data",
    INSERT_FAILED : "Failed to add data",
    UPDATE_SUCCESS : "Success to update data",
    UPDATE_FAILED : "Failed to update data",
    DELETE_SUCCESS : "Success to delete data",
    DELETE_FAILED : "Failed to delete data",
    GET_SUCCESS : "Success to get data",
    GET_FAILED : "Failed to get data",
    FIELD_CANT_BE_EMPTY : "Must be filled",
    SOMETHING_WENT_WRONG: "Something went wrong",
    ACKNOWLEDGE_TYPE : {
        SUCCESS : "0000",
        FAILURE : "1000",
        SOMETHING_WENT_WRONG: "2000"
    },
    HTML_STATUS : {
      SUCCESS : 200,
      BAD_REQUEST: 400,
      INTERNAL_SERVER_ERROR: 500
    }
};
