/**
 * Created by Anton on 3/20/2016.
 */

'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var should = chai.should();
var models  = require('../server/models');

chai.use(chaiHttp);

describe('Products', function() {

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        models.Product.destroy({where: {sku:['12345','22345','32345','42345','52345']}});
        done();
    });

    it('should list ALL products', function(done) {
        chai.request(server)
            .get('/products/getAll')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('code');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                done();
            });
    });

    it('should list a SINGLE product', function(done) {
        var product = {
            sku: '12345',
            name: 'category test',
            categoryId: 1,
            createdBy: 'anton'
        };

        models.Product.create({
            sku: product.sku,
            name: product.name,
            CategoryId: product.categoryId,
            status: true,
            createdBy: product.createdBy
        }).then(function(product) {
            chai.request(server)
                .get('/products/get/'+ product.id)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('code');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data[0].id.should.equal(product.id)
                    done();
                });
        })
    });

    it('should add a SINGLE product', function(done) {
        var product = {
            sku: '22345',
            name: 'category test',
            categoryId: 1,
            createdBy: 'anton'
        };

        chai.request(server)
            .post('/products/add')
            .send(product)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('code');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.id.should.not.equal(0);
                done();
            });
    });

    it('should update a SINGLE product', function(done) {
        var productAdd = {
            sku: '32345',
            name: 'category test update',
            categoryId: 1,
            createdBy: 'anton'
        };

        var productUpdate = {
            sku: '32345',
            name: 'new value',
            categoryId: 1,
            updatedBy: 'anton'
        };

        models.Product.create({
            sku: productAdd.sku,
            name: productAdd.name,
            CategoryId: productAdd.categoryId,
            status: true,
            createdBy: productAdd.createdBy
        }).then(function(product) {
            chai.request(server)
                .post('/products/update/' + product.id)
                .send(productUpdate)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('code');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.equal(1);
                    done();
                });
        })
    });

    it('should delete a SINGLE product', function(done) {
        var productAdd = {
            sku: '42345',
            name: 'category test delete',
            categoryId: 1,
            createdBy: 'anton'
        };

        models.Product.create({
            sku: productAdd.sku,
            name: productAdd.name,
            CategoryId: productAdd.categoryId,
            status: true,
            createdBy: productAdd.createdBy
        }).then(function(product) {
            chai.request(server)
                .post('/products/delete/' + product.id)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('code');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.equal(1);
                    done();
                });
        })
    });
});


