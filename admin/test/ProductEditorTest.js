require('./_global');
require('../js/directives/productEditor');

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');
var _ = require('lodash');

describe('ProductEditor', function() {
    var $rootScope;
    var $compile;
    var $injector;
    var $templateCache;
  
  
    function compileEditor(prod) {
        prod = prod || { name: { LV: '', RU: '' }, machineName: '' };
        
        var scope = $rootScope.$new();        
        scope.prod = prod;
        
        var elem = $compile('<product-editor ng-init="editor.init(prod)"></product-editor>')(scope);
        scope.$digest();
                
        return {
            scope: scope,
            elem: $(elem)
        };
    }
  
       
    beforeEach(angular.mock.module('BoditeAdmin', 'BoditeAdminTemplates', function($provide) {
        $provide.value('productRepo', {
            getItems: sinon.stub().returns(Promise.resolve([])) 
        });        
    }));

    beforeEach(angular.mock.inject(function(_$rootScope_, _$compile_, _$injector_, _$templateCache_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $injector = _$injector_;
        $templateCache = _$templateCache_;        
    }));
        
   
   
    it('directive is available', function() {        
       expect($injector.has('productEditorDirective')).to.be.true;        
    });
   
      
    it('uses template', function() {       
        $templateCache.put('../templates/productEditor.html', '<h1>HELLO</h1>');
                            
        var x = compileEditor();
                            
        expect(x.elem.html()).to.contain('HELLO');        
    });
             
        
    
   
    
});