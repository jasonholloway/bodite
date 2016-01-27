global.$ = global.jQuery = require('jquery');
require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');

angular.module('BoditeAdmin', []);
require('../js/services/machineNames');
require('../js/directives/productEditor');


describe('ProductEditor', function() {

    var $rootScope;
    var $compile;
    var $templateCache;
    
    beforeEach(module('BoditeAdmin', function($provide) {
        $provide.value('productRepo', {
            items: [] 
        });        
    }));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$templateCache_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $templateCache = _$templateCache_;        
    }));
   
          
        
    function compileProduct(prod) {
        prod = prod || { name: { LV: '', RU: '' }, machineName: '' };
        
        var scope = $rootScope.$new();        
        scope.prod = prod;
        
        var elem = $compile('<product-editor ng-init="product.init(prod)"></product-editor>')(scope);
        scope.$digest();
        
        return {
            scope: scope,
            elem: $(elem)
        };
    }
   
   
   
    it('uses template', function() {       
        $templateCache.put('../templates/productEditor.html', '<h1>HELLO</h1>');
                            
        var x = compileProduct();
                            
        expect(x.elem.html()).to.contain('HELLO');        
    });
             
        
   
    it('fills machine name on leaving name field', function() {
        var x = compileProduct();   
        
        var elName = x.elem.find('div.names input.LV');        
        var elMachName = x.elem.find('div.machine-name input');
        
        elName.val('jason').trigger('input');
        x.scope.$apply();
                     
        elName.blur();
        x.scope.$apply();                     
                     
        return new Promise(function(done) {         
            process.nextTick(function() {            
                expect(x.scope.$$childHead.product.working.machineName, 'model').to.equal('jason');
                expect(elMachName.val(), 'view').to.equal('jason');
                done();            
            });
        })
    });
   
   
    it.skip('machine name is limited by mask', function() {
        //Apparently needs protractor, cos Karma doesn't do integration testing, apparently...
        //Though it surely bloody does. Can't sendkeys however without special interface to browser.
        
        var x = compileProduct();   
        
        var elMach = $(x.elem).find('div.machine-name input');
        
        elMach[0].clear().sendKeys('illegal name!');
        x.scope.$apply();
        
        return new Promise(function(done) {
            process.nextTick(function() {
                expect(elMach.val()).to.be.empty;
                done(); 
            });            
        });        
    });
    
    
    it.skip('manually editing machine name stops auto-creation', function(cb) {
        //flag to be set on product        
        //..
        
        //not entirely necessary at moment
        //...
    });
    
    
   
    
});