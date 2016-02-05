require('./_global');
require('../js/repos/productRepo');

var module = angular.mock.module;
var inject = angular.mock.inject;

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');
var _ = require('lodash');



describe('productRepo', function() {
   
   var productRepo, productDb;
   
   function createRandomProduct() {
       var name = Math.ceil(Math.random() * 1000000).toString();
       
       return {
           _id: 'product/' + Math.ceil(Math.random() * 10000).toString(),
           name: {
               LV: name
           },
           description: {},
           images: {},
           machineName: name
       }
   }
   
   var products = _.range(10).map(function() { return createRandomProduct() });
      
   var productResponseBody = {
        rows: products.map(function(p) {
                                return { value: p };
                            })  
   };
   
   
   beforeEach(module('BoditeAdmin', function($provide) {       
       productDb = {
           getAll: sinon.stub().returns(Promise.resolve(products)),
           save: sinon.stub().returns(Promise.resolve(null))           
       }
              
       $provide.value('productDb', productDb);
   }));
   
   beforeEach(inject(function(_productRepo_, _$httpBackend_) {
       productRepo = _productRepo_;       
   }));
   
       
   it('fetches products from db on first get, returns array', function() {       
       return productRepo.getItems()
                .then(items => {
                    expect(items).to.deep.equal(products);
                });
   });
   
   
   it('caches products on first fetch; doesn\'t bother db again', function(cb) {       
       productRepo.getItems()
            .then(() => {       
                                     
                productRepo.getItems()
                    .then(items => {
                        expect(items).to.deep.equal(products);                               
                        expect(productDb.getAll.calledOnce).to.be.true;
                        cb();                         
                    })
                    .catch(cb);
                    
            })
            .catch(cb);
   });
   
   
   it('filter returns substring name.LV matches (case-insensitive), returned via promise', function() {
       productRepo.getItems = sinon.stub().returns(Promise.resolve(products));
       
       var term = products[3].name.LV.toLowerCase();
       
       return productRepo.filter(term)
                .then(function(filtered) {                    
                    var expectedProds = products.filter(p => p.name.LV.indexOf(term) > -1);
                                                                  
                    expectedProds.forEach(function(p) {                                                                                                                 
                        expect(filtered).to.deep.include(p);                        
                    });                       
                });
   });
   
   
   it('save puts to db', function() {             
      var prod = products[0];
      
      return productRepo.save(prod)
                .then(p => {
                    expect(productDb.save.callCount).to.equal(1);
                    expect(productDb.save.firstCall.calledWith(prod));
                });
   });
   
   
   it('generates machine name on product save', () => {
       var prod = createRandomProduct();
              
       return new Promise((done, err) => {                 
            productRepo.save(prod)
                .then(p => {           
                        productRepo.getItems()
                            .then(items => {
                                expect(items).to.have.lengthOf(1);                                
                                expect(items[0].machineName).to.equal(items[0].name.LV);
                                done();
                            })
                            .catch(err);
                })
                .catch(err);
       });
   });
   
   
   it('product retains same machine name on save if still valid', (cb) => {
       productRepo.getItems()
            .then(prods => {               
               //internal product map now populated               
               var prod = prods[1];
               var machName = prod.machineName;               
               
               productDb.save = sinon.stub().returns(Promise.resolve(prod));
               
               productRepo.save(prod)
                    .then(p => {
                        expect(p.machineName).to.equal(machName);
                        cb();
                    })
                    .catch(cb);
            })
            .catch(cb);
   });
   
   
   
   //should also use stateless machinenameprovider through DI? or maybe proxify?
   
   it.skip('generates unique machine name on clash', () => {
      
      //...
       
   });
   
   
   
});