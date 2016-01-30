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


describe('productRepo', function() {
   
   var productRepo, 
        // server = sinon.fakeServer.create(),
        $httpBackend;
   
   var products = [
       {
           _id: '1',
           name: {
               LV: 'Suit',
               RU: 'Blah'
           }
       },
       {
           _id: '2',
           name: {
               LV: 'Sock',
               RU: 'Blahblah'
           }
       },
       {
           _id: '3',
           name: {
               LV : 'Sockette',
               RU: 'asdad'
           }
       }
   ];
   
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
   
   
   it('fetches products from DB_ALL_PRODUCTS_URL on first get', function() {
       $httpBackend.expectGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
          
       var r = productRepo.getItems()
                .then(function(items) {
                    expect(items).to.shallowDeepEqual(productMap);
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
                        expect(items).to.shallowDeepEqual(productMap);       
                        cb();                         
                    })
                    .catch(cb);
                    
            })
            .catch(cb);
          
       flush();
   });
   
   
   it('filter returns substring name.LV matches (case-insensitive), returned via promise', function() {
       productRepo.getItems = sinon.stub().returns(Promise.resolve(products));
       
       return productRepo.filter('sock')
                .then(function(r) {
                    expect(r).to.shallowDeepEqual(products
                                                    .filter(function(p) {
                                                        return p.name.LV.indexOf('sock') > -1;
                                                    }));
                });
   });
   
});