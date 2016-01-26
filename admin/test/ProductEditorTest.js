require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;
var $ = require('jquery');

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');

angular.module('BoditeAdmin', []);
require('../js/services/machineNames');
require('../js/directives/product');


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
   
   
    it('uses template', function() {       
        $templateCache.put('../templates/product.html', '<h1>HELLO</h1>');
                            
        var scope = $rootScope.$new();
       
        var elem = $compile('<product ng-init="product.init(prod)"></product>')(scope);        
        scope.$digest();              
                
        expect($(elem).html()).to.contain('HELLO');        
    });
   
   
   
   
   
    it('fills machine name on leaving name field', function(cb) {
        var scope = $rootScope.$new();        
        
        scope.prod = {
            name: {
                LV: '',
                RU: ''
            },
            machineName: ''
        };
        
        var elem = $compile('<product ng-init="product.init(prod)"></product>')(scope);
        scope.$digest();
        
        var elName = $(elem).find('.product LV');        
        var elMachName = $(elem).find('.machine-name input');
        
        
        elName.val('jason');
        scope.$digest();
                
        process.nextTick(function() {
            expect(elMachName.val()).to.equal('jason');
            cb();            
        });
    });
    
});