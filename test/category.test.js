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

describe('Categories', function() {
    it('should list ALL categories', function(done) {
        chai.request(server)
            .get('/categories/getAll')
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

    it('should list a SINGLE category', function(done) {
        var category = {
            name: 'category test',
            categoryId: null,
            createdBy: 'anton'
        };

        models.Category.create({
            name: category.name,
            CategoryId: category.categoryId,
            status: true,
            createdBy: category.createdBy
        }).then(function(category) {
            chai.request(server)
                .get('/categories/get/'+ category.id)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('code');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data[0].id.should.equal(category.id)
                    done();
                });
        })
    });

    it('should add a SINGLE category', function(done) {
        var category = {
            name: 'category test',
            categoryId: null,
            createdBy: 'anton'
        };

        chai.request(server)
            .post('/categories/add')
            .send(category)
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

    it('should update a SINGLE category', function(done) {
        var categoryAdd = {
            name: 'category test update',
            categoryId: null,
            createdBy: 'anton'
        };

        var categoryUpdate = {
            name: 'new value',
            categoryId: null,
            updatedBy: 'anton'
        };

        models.Category.create({
            name: categoryAdd.name,
            CategoryId: categoryAdd.categoryId,
            status: true,
            createdBy: categoryAdd.createdBy
        }).then(function(category) {
            chai.request(server)
                .post('/categories/update/' + category.id)
                .send(categoryUpdate)
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

    it('should delete a SINGLE category', function(done) {
        var categoryAdd = {
            name: 'category test delete',
            categoryId: null,
            createdBy: 'anton'
        };

        models.Category.create({
            name: categoryAdd.name,
            CategoryId: categoryAdd.categoryId,
            status: true,
            createdBy: categoryAdd.createdBy
        }).then(function(category) {
            chai.request(server)
                .post('/categories/delete/' + category.id)
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


