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
 * Get all existing product
 * @param req
 * @param res
 * response will return all products data
 */
function getAll(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    models.Product.findAll({
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
    }).then(function(products) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.GET_SUCCESS,products);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Get one existing product
 * @param req
 * required fields are id
 * @param res
 * response will return a product data (if exist)
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

    models.Product.findAll({
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
    }).then(function(product) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.GET_SUCCESS,product);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Create a new product and inserts it into database
 * @param req
 * required fields are sku, name, categoryId and createdBy
 * @param res
 * response will return new data with auto increment Id (If Success)
 */
function create(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkBody('sku', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('name', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('categoryId', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('createdBy', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('sku').trim();
    req.sanitize('name').trim();
    req.sanitize('description').trim();
    req.sanitize('size').trim();
    req.sanitize('color').trim();
    req.sanitize('categoryId').trim();
    req.sanitize('createdBy').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.INSERT_FAILED + util.inspect(errors)));
        return;
    }

    models.Product.create({
        sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        qty: req.body.qty == '' ? null : req.body.qty,
        price: req.body.price == '' ? null : req.body.price,
        size: req.body.size == '' ? null : req.body.size,
        color: req.body.color == '' ? null : req.body.color,
        CategoryId: req.body.categoryId,
        status: true,
        createdBy: req.body.createdBy
    }).then(function(product) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.INSERT_SUCCESS,product);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Update existing product
 * @param req
 * required fields are id, sku, name, categoryId and updatedBy
 * @param res
 * response will return update database status
 */
function update(req, res) {
    var baseReq = reqBase.reqMessage();
    logger.info(JSON.stringify(reqBase.reqLogMessage(baseReq.transId, req)));

    req.checkParams('id', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('sku', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('name', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('categoryId', messages.FIELD_CANT_BE_EMPTY).notEmpty();
    req.checkBody('updatedBy', messages.FIELD_CANT_BE_EMPTY).notEmpty();

    req.sanitize('id').trim();
    req.sanitize('sku').trim();
    req.sanitize('name').trim();
    req.sanitize('description').trim();
    req.sanitize('size').trim();
    req.sanitize('color').trim();
    req.sanitize('categoryId').trim();
    req.sanitize('updatedBy').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(messages.HTML_STATUS.BAD_REQUEST).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.FAILURE,messages.UPDATE_FAILED + util.inspect(errors)));
        return;
    }

    models.Product.update({
        sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        qty: req.body.qty == '' ? null : req.body.qty,
        price: req.body.price == '' ? null : req.body.price,
        size: req.body.size == '' ? null : req.body.size,
        color: req.body.color == '' ? null : req.body.color,
        CategoryId: req.body.categoryId,
        updatedBy: req.body.updatedBy
    },{where: {
        id : req.params.id
    }
    }).then(function(product) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.UPDATE_SUCCESS,product);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

/**
 * Delete existing product (soft delete, just update status field)
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

    models.Product.update({
        status: false
    },{where: {
        id : req.params.id
    }
    }).then(function(product) {
        var result = resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SUCCESS,messages.DELETE_SUCCESS,product);
        logger.info(resBase.resLogMessage(baseReq.transId, result));
        res.status(messages.HTML_STATUS.SUCCESS).send(result);
    }).catch (function(e) {
        logger.error(resBase.resLogMessage(baseReq.transId, e));
        res.status(messages.HTML_STATUS.INTERNAL_SERVER_ERROR).send(resBase.resMessage(messages.ACKNOWLEDGE_TYPE.SOMETHING_WENT_WRONG,messages.SOMETHING_WENT_WRONG));
    });
}

module.exports = router;