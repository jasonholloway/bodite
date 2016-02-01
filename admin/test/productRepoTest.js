require('./_global');
require('../js/repos/productRepo');

var module = angular.mock.module;
var inject = angular.mock.inject;

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');
var _ = require('lodash');


describe('productRepo', function() {
   
   var productRepo, 
        // server = sinon.fakeServer.create(),
        $httpBackend;
   
   
   function createRandomProduct() {
       return {
           _id: Math.ceil(Math.random() * 10000).toString(),
           name: {
               LV: Math.ceil(Math.random() * 100000).toString()
           },
           description: {},
           images: {},
           machineName: ''
       }
   }
   
   var products = _.range(10).map(function(i) { return createRandomProduct() });
   
   var productResponseBody = {
        rows: products.map(function(p) {
                    return { value: p };
                })  
   };
   
   var productMap = {};
   products.forEach(function(p) {
       productMap[p._id] = p;
   });
   
   
   
   
   var DB_ALL_PRODUCTS_URL = 'http://blah.com/data';
   
   
   beforeEach(module('BoditeAdmin', function($provide) {
       $provide.constant('DB_ALL_PRODUCTS_URL', DB_ALL_PRODUCTS_URL);
   }));
   
   beforeEach(inject(function(_productRepo_, _$httpBackend_) {
       productRepo = _productRepo_;
       $httpBackend = _$httpBackend_;       
   }));
       
   afterEach(function() {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
   });


   function flush() {
       process.nextTick(function() {       
           $httpBackend.flush();       
       });
   }    
   
   
   it('fetches products from DB_ALL_PRODUCTS_URL on first get, returns array', function() {
       $httpBackend.expectGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
          
       var r = productRepo.getItems()
                .then(function(items) { 
                    expect(items).to.shallowDeepEqual(products);
                });           
       
       flush();
           
       return r;
   });
   
   
   it('caches products on first fetch; doesn\'t bother server again', function(cb) {        
       $httpBackend.expectGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
           
       productRepo.getItems()
            .then(function(_) {       
                                     
                productRepo.getItems()
                    .then(function(items) {
                        expect(items).to.shallowDeepEqual(products);       
                        cb();                         
                    })
                    .catch(cb);
                    
            })
            .catch(cb);
          
       flush();
   });
   
   
   it('filter returns substring name.LV matches (case-insensitive), returned via promise', function() {
       productRepo.getItems = sinon.stub().returns(Promise.resolve(products));
       
       var term = products[3].name.LV.toLowerCase();
       
       return productRepo.filter(term)
                .then(function(r) {                    
                    var expectedProds = products.filter(function(p) {
                                                            return p.name.LV.indexOf(term) > -1;
                                                        });
                                                                            
                    expect(r).to.shallowDeepEqual(expectedProds);
                });
   });
   
});