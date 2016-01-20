require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;
var _ = require('lodash');


describe('catRepo', function() {
        
    angular.module('bb', []);

    require('../js/services/catRepo');
   
    
    beforeEach(module('bb', function($provide) {
                                    $provide.constant('CATEGORY_TREE_URL', 'http://tree');
                                }));

    afterEach(inject(function($httpBackend, $rootScope) {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    }));


    it('should be available', inject(function(catRepo) {   
        expect(catRepo).is.not.undefined;
    }));


    it('serves category tree by promise', function(cb) {                
        inject(function(catRepo, $httpBackend, CATEGORY_TREE_URL) {  
            var catTree = { roots: [{ name: 'blah' }] };
            
            $httpBackend.expectGET(CATEGORY_TREE_URL);
            
            $httpBackend.whenGET(CATEGORY_TREE_URL)
                        .respond(catTree);
                                                                
            catRepo.getCatTree()
                    .then(function(tree) {
                        expect(tree).to.shallowDeepEqual(catTree);
                        cb();                        
                    }).catch(cb);
                    
            $httpBackend.flush();
        });      
    });

    
});