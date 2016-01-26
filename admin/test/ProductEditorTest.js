require('angular');
require('angular-mocks');
var module = angular.mock.module;
var inject = angular.mock.inject;
var $ = require('jquery');

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');

// angular.module('BoditeAdmin', []);
require('../js/app.js');
require('../js/directives/product');


describe('ProductEditor', function() {
   
    //need to set up directive, yeah

    var $rootScope;
    var $compile;
    
    beforeEach(module('BoditeAdmin', function($provide) {
        $provide.value('productRepo', {
            items: [] 
        });        
    }));

    beforeEach(inject(function(_$rootScope_, _$compile_, $templateCache) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        
        $templateCache.put('../templates/product.html', '<h1>HELLO</h1>');       
        
    }));
   
     
   
   
    it('uses template', function() {                     
        var scope = $rootScope.$new();
       
        var elem = $compile('<product ng-init="product.init(prod)"></product>')(scope);        
        scope.$digest();              
                
        expect($(elem).html()).to.contain('HELLO');        
    });
   
   
   
   
   
    it.skip('fills machine name on leaving name field', function(cb) {
        var scope = $rootScope.$new();        
        
        scope.prod = {
            name: {
                LV: '',
                RU: ''
            }  
        };
        
        var elem = $compile('<product ng-init="product.init(prod)"></product>')(scope);
        
        console.log(elem);
        
        var elName = $(elem).find('.product LV');        
        var elMachName = $(elem).find('.machine-name input');
        
        console.log(elName);
        console.log(elMachName);
        
        
        elName.val('Jason');
                
        expect(elMachName.val()).to.equal('jason');
        
    });
    
});