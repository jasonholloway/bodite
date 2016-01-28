global.$ = global.jQuery = require('jquery');
require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');

angular.module('BoditeAdmin', []);
require('../js/repos/productRepo');
// require('../js/directives/productEditor');

describe('productRepo', function() {
   
   var productRepo, 
        server = sinon.fakeServer.create(),
        $httpBackend;
   
   var products = [
       {
           name: {
               LV: 'Suit',
               RU: 'Blah'
           }
       },
       {
           name: {
               LV: 'Sock',
               RU: 'Blahblah'
           }
       }
   ];
   
   var productResponseBody = {
        rows: products.map(function(p) {
                    return { value: p };
                })  
   };
   
   
   var DB_ALL_PRODUCTS_URL = 'http://blah.com/data';
       
   
   beforeEach(module('BoditeAdmin', function($provide) {
       $provide.constant('DB_ALL_PRODUCTS_URL', DB_ALL_PRODUCTS_URL);
   }));
   
   beforeEach(inject(function(_productRepo_, _$httpBackend_) {
       productRepo = _productRepo_;
       $httpBackend = _$httpBackend_;
       
       server = sinon.fakeServer.create();
       server.respondImmediately = true;       
       server.autoRespond = true;
   }));
   
   
   it('fetches products from DB_ALL_PRODUCTS_URL on first get', function() {
       $httpBackend.whenGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
                    
       var r = productRepo.getItems()
                .then(function(items) {                                        
                    expect(items).to.shallowDeepEqual(products);
                    expect(server.requests.length).to.equal(1);
                });
                
       $httpBackend.flush();
                
       return r;
   });
   
   it('caches products on first fetch; doesn\'t bother server again', function() {        
       $httpBackend.whenGET(DB_ALL_PRODUCTS_URL)
                    .respond(200, productResponseBody, {'Content-Type': 'application/json'});
           
       var r = productRepo.getItems()
                .then(function(items) {                                    
                    return productRepo.getItems()
                            .then(function(items) {                
                                expect(items).to.shallowDeepEqual(products);
                                expect(server.requests.length).to.equal(1);                                
                            });
                });
                
        $httpBackend.flush();
                
        return r;
   });
   
});