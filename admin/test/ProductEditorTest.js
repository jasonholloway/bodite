require('./_global');
require('../js/directives/productEditor');
// require('../js/services/machineNames');

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
             
        
   
    // it('fills machine name on leaving name field', function() {
    //     var x = compileEditor();   
        
    //     var elName = x.elem.find('div.names input.LV');        
    //     var elMachName = x.elem.find('div.machine-name input');
                
    //     elName.val('jason').trigger('input');
    //     x.scope.$apply();
                     
    //     elName.blur();
               
    //     return new Promise(function(done) {         
    //         process.nextTick(function() {                
    //             x.scope.$apply();
                                      
    //             expect(x.scope.$$childHead.editor.working.machineName, 'model').to.equal('jason');
    //             expect(elMachName.val(), 'view').to.equal('jason');
                
    //             done();            
    //         });
    //     })
    // });
   
   
    // it.skip('machine name is limited by mask', function() {
    //     //Apparently needs protractor, cos Karma doesn't do integration testing, apparently...
    //     //Though it surely bloody does. Can't sendkeys however without special interface to browser.
        
    //     var x = compileEditor();   
        
    //     var elMach = $(x.elem).find('div.machine-name input');
        
    //     elMach[0].clear().sendKeys('illegal name!');
    //     x.scope.$apply();
        
    //     return new Promise(function(done) {
    //         process.nextTick(function() {
    //             expect(elMach.val()).to.be.empty;
    //             done(); 
    //         });            
    //     });        
    // });
    
    
    // it.skip('manually editing machine name stops auto-creation', function(cb) {
    //     //flag to be set on product        
    //     //..
        
    //     //not entirely necessary at moment
    //     //...
    // });
    
    
   
    
});