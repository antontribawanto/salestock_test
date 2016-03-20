/**
 * Created by Anton on 3/19/2016.
 */

"use strict";

var models  = require('../models');
var util = require('util');
var messages  = require('../messages/common');
var reqBase  = require('../messages/requestBase');
var resBase  = require('../messages/responseBase');
var express = require('express');
var router  = express.Router();
var logger = require('../utils/winstonLogger');

router.get('/getAll',getAll);
router.get('/get/:id',getById);
router.post('/add', create);
router.post('/update/:id', update);
router.post('/delete/:id', remove);

/**
 * Get all existing category
 * @param req
 * @param res
 * response will return all categories data and it's children (1 level)
 */
function getAll(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    models.Category.findAll({
        where: {
            status : true
        },
        include:[
            {
                model : models.Category,
                where : {status : true},
                required: false
            }
        ]
    }).then(function(categories) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.GET_SUCCESS,categories);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Get one existing category
 * @param req
 * required fields are id
 * @param res
 * response will return a category data (if exist) and it's children (1 level)
 */
function getById(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkParams('id', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('id').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.GET_FAILED + util.inspect(errors)));
        return;
    }

    models.Category.findAll({
        where: {
            status : true,
            id: req.params.id
        },
        include:[
            {
                model : models.Category,
                where : {status : true},
                required: false
            }
        ]
    }).then(function(category) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.GET_SUCCESS,category);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Create a new category and inserts it into database
 * @param req
 * required fields are name and createdBy
 * @param res
 * response will return new data with auto increment Id (If Success)
 */
function create(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkBody('name', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('createdBy', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('name').trim();
    req.sanitize('createdBy').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.INSERT_FAILED + util.inspect(errors)));
        return;
    }

    models.Category.create({
        name: req.body.name,
        CategoryId: req.body.categoryId,
        status: true,
        createdBy: req.body.createdBy,
    }).then(function(category) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.INSERT_SUCCESS,category);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Update existing category
 * @param req
 * required fields are id, name and updatedBy
 * @param res
 * response will return update database status
 */
function update(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkParams('id', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('name', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('updatedBy', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('id').trim();
    req.sanitize('name').trim();
    req.sanitize('categoryId').trim();
    req.sanitize('updatedBy').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.UPDATE_FAILED + util.inspect(errors)));
        return;
    }

    models.Category.update({
        name: req.body.name,
        CategoryId: req.body.categoryId,
        updatedBy: req.body.updatedBy,
    },{where: {
        id : req.params.id
    }
    }).then(function(category) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.UPDATE_SUCCESS,category)
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Delete existing category (soft delete, just update status field)
 * @param req
 * required fields are id
 * @param res
 * response will return update database status
 */
function remove(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkParams('id', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('id').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.DELETE_FAILED + util.inspect(errors)));
        return;
    }

    models.Category.update({
        status: false
    },{where: {
        id : req.params.id
    }
    }).then(function(category) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.DELETE_SUCCESS,category);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

module.exports = router;