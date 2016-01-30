require('./_global');
require('../js/controllers/ProductListCtrl');

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('promise');
var _ = require('lodash');


describe('ProductListCtrl', function() {
      
   var ctrl, scope;
   var productRepo;
      
   function createRandomProduct() {
       return {
           _id: Math.ceil(Math.random() * 100000).toString(),
           name: {
               LV: Math.ceil(Math.random() * 1000000).toString() 
           }  
       };
   }
      
      
   beforeEach(angular.mock.module('BoditeAdmin', function($provide) {
       $provide.service('productRepo', function() { return {} });
   }));
   
   beforeEach(angular.mock.inject(function($rootScope, $controller, _productRepo_) {
       scope = $rootScope.$new();
       productRepo = _productRepo_;
       ctrl = $controller('ProductListCtrl', { '$scope': scope, 'productRepo': productRepo });
   }));
   
   
   it('current items exposed as array', function() {
       expect(ctrl.current).to.be.instanceOf(Array); 
   });
   
   it('when new item created, it alone appears in current', function() {
      var p = createRandomProduct();
       
      productRepo.filter = sinon.stub();
      productRepo.create = sinon.stub().returns(p);
      
      ctrl.createNewProduct();
                  
      expect(ctrl.current.length).to.equal(1);
      expect(ctrl.current[0]).to.shallowDeepEqual(p);      
   });
   
   it('filter delegates to productRepo, limits items in current', function() {
      var prods = _.range(0, 10).map(function(i) { return createRandomProduct() });
              
      productRepo.filter = sinon.stub().returns(Promise.resolve(prods));
            
      ctrl.filterProducts('blah');
            
      return new Promise(function(done) {          
          process.nextTick(function() {
              expect(productRepo.filter.calledWith('blah')).to.be.true;              
              expect(ctrl.current).to.shallowDeepEqual(prods);
              done();              
          });
      });  
   });
   
   it.skip('only first 40 products are shown', function() {
      //... 
   });
    
});