require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var expect = chai.expect;

var _ = require('lodash');


var $ = require('jquery');



describe('jhTree', function() {
   
    require('../js/jhTree/jhTree');
        
    beforeEach(module('jhTree'));
    
    
    function createNode(depth, branches, isRoot) {
        isRoot = isRoot || false;
        
        return {
            name: Math.random().toString(),
            isRoot: isRoot,
            children: depth > 0
                        ? _.times(branches)
                                .map(function(i) {
                                    return createNode(depth - 1, branches);
                                })
                        : []
        };        
    }
   
    function createTree(depth, branches) {
        return createNode(depth, branches === undefined ? 3 : branches, true);        
    }
    
            
    function renderMenu(spec) {
        spec = spec || {};
        spec.tree = spec.tree || createTree(4, 2);
        spec.template = spec.template || '';
                
        return new Promise(function(done, err) {                        
            inject(function($rootScope, $compile, $templateCache) {
                var scope = $rootScope.$new();
                
                scope.treeSource = function() {
                    return Promise.resolve(spec.tree);
                }
                                
                $templateCache.put('treeNodeTemplateKey', spec.template);
                
                var html = '<jh-tree source="treeSource" template="treeNodeTemplateKey"></jh-tree>';
                
                var elem = $compile(html)(scope);
                
                scope.$digest();
                
                process.nextTick(function() {
                    scope.$digest();                    
                    
                    setTimeout(function() {
                        scope.$digest();         
                        done($(elem));                        
                    }, 100);                             
                });            
            });
        });    
            
    }
    
    
    it('should be available', inject(function($injector) {
        expect($injector.has('jhTreeDirective')).to.be.true;
    }));
          
   
    it('should render ul with roots', function() {
        return renderMenu({
                    tree: createTree(1, 3),
                    template: '<ul><li ng-repeat="node in node.children" jh-tree-node></li></ul>'
                })
                .then(function(menu) {  
                    var uls = menu.find('> ul');    
                    expect(uls.length).to.be.greaterThan(0);
                    
                    var lis = $(uls[0]).find('> li')            
                    expect(lis.length).to.equal(3);
                });
    });
   
   
    it('should use template on top level', function() {
        return renderMenu({
                    tree: createTree(1, 3),
                    template: '<span>YO!</span>'
                })
                .then(function(menu) {
                    expect(menu.html()).to.contain('YO!');
                });
    })
   
   
   
   
   
    it('should render full depth of tree', function() {        
        var depth = 4;
        var branching = 4;
        
        return renderMenu({
                    tree: createTree(depth, branching),
                    template: '<ul><li ng-repeat="node in node.children" jh-tree-node></li></ul>'
                })
                .then(function(menu) {    
                    var idealItemCount = branching;
                    
                    for(var d = 1; d < depth; d++) {
                        idealItemCount += Math.pow(branching, d + 1);
                    }
                                
                    expect(menu.find('li').length).to.equal(idealItemCount);
                });
    });
   
   
   
    it('should render template without needing enclosing tags', function() {
        return renderMenu({
                    tree: createTree(1, 3),
                    template: 'Cowabunga'
                })
                .then(function(menu) {
                    expect(menu.html()).to.contain('Cowabunga');
                });
    })
    
});
