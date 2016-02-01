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
        $httpBackend;
   
   
   function createRandomProduct() {
       return {
           _id: 'product/' + Math.ceil(Math.random() * 10000).toString(),
           name: {
               LV: Math.ceil(Math.random() * 100000).toString()
           },
           description: {},
           images: {},
           machineName: ''
       }
   }
   
   var products = _.range(10).map(function() { return createRandomProduct() });
      
   var productResponseBody = {
        rows: products.map(function(p) {
                                return { value: p };
                            })  
   };
   

   function flush() {
       process.nextTick(function() {       
           $httpBackend.flush();       
       });
   }    
   
   
   var DB_BASE_URL = 'http://blah.com/db'
   var DB_ALL_PRODUCTS_URL = DB_BASE_URL + 'all_products';
   
   
   beforeEach(module('BoditeAdmin', function($provide) {
       $provide.constant('DB_BASE_URL', DB_BASE_URL);
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
   
   
   it('fetches products from DB_ALL_PRODUCTS_URL on first get, returns array', function() {
       $httpBackend.expectGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
          
       var r = productRepo.getItems()
                .then(function(items) {
                    expect(items).to.deep.equal(products);
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
                        expect(items).to.deep.equal(products);       
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
                    var expectedProds = _.values(products).filter(function(p) {
                                                                return p.name.LV.indexOf(term) > -1;
                                                            });
                                                                            
                    expect(r).to.deep.equal(expectedProds);
                });
   });
   
   
   it('save puts to correct couchdb doc', function() {      
       
      var prod = products[0];
      
      var url = urlJoin(DB_BASE_URL, prod._id);
      
      $httpBackend.expectPUT(url)
                    .respond(200, { 'Content-Type': 'application/json'}, { _rev: 'asadasdd' });
      
      var r = productRepo.save(prod);
      
      flush();
      
      return r;       
   });
   
   
});