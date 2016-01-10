require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;

var $ = require('jquery');

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;

var _ = require('lodash');



describe('menuHier', function() {
   
    require('../js/menuHier/menuHier');
        
    beforeEach(module('menuHier'));
    
    
    function createNode(depth, branches, isRoot) {
        isRoot = isRoot !== undefined ? isRoot : true;
        
        return {
            name: Math.random().toString(),
            isRoot: isRoot,
            children: depth > 0
                        ? _.times(3).map(function(i) {
                                        return createNode(depth - 1, branches, false);
                                    })
                        : []
        };
    }
   
    function createTree(depth, branches) {
        branches = branches || 3;
        
        return {
            roots: _.times(branches).map(function(i) {
                                    return createNode(depth, branches)
                                })
        }
    }
            
    function renderMenu(spec) {
        spec = spec || {};
        spec.tree = spec.tree || createTree(4, 2);
        
        return new Promise(function(done, err) {                        
            inject(function($rootScope, $compile, $templateCache) {
                var scope = $rootScope.$new();
                
                scope.treeSource = function() {
                    return Promise.resolve(spec.tree);
                }
                
                $templateCache.put('menuItemTemplate', 'Hello!');
                
                var html = '<menu-hier source="treeSource" template="menuItemTemplate"></menu-hier>';
                
                var elem = $compile(html)(scope);
                
                scope.$digest();
                
                process.nextTick(function() {
                    scope.$digest();
                    done($(elem));    
                });            
            });
        });        
    }
    
    
    it('should be available', inject(function($injector) {
        expect($injector.has('menuHierDirective')).to.be.true;
    }));
          
   
    it('should render ul with roots', function(done) {
        renderMenu({
            tree: createTree(0, 3)
        })
        .then(function(menu) {            
            var uls = menu.find('> ul');    
            expect(uls.length).to.be.greaterThan(0);
            
            var lis = $(uls[0]).find('> li')            
            expect(lis.length).to.equal(3);
           
            done();
        }).catch(done);
    });
   
   
   
   
    it('should render full depth of tree', function(done) {
        renderMenu({
            tree: createTree(4, 2)
        })
        .then(function(menu) {
            
            //now need to crawl through rendered elements, ensuring all lists are there
            
            done();
        }).catch(done);
    });
   
   
    
});
