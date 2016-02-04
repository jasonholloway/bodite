require('angular-mocks');
var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');


describe('machineNames', function() {
        
    var itemsToReturn = [],
        machineNames;
            
    beforeEach(angular.mock.module('BoditeAdmin', function($provide) {
        $provide.value('productRepo', {
            getItems: function() { return Promise.resolve(itemsToReturn) } 
        });        
    }));
    
    beforeEach(inject(function(_machineNames_) {
        machineNames = _machineNames_;
    }));
    
    
    it('gets unique machine name given clash', function() {                
        itemsToReturn = [
            { machineName: 'jason' },
            { machineName: 'colin' },
            { machineName: 'bazza' },  
        ];
        
        return machineNames.get('bazza')
                    .then(function(n) {
                       expect(n).to.equal('bazza-2'); 
                    });
    });
    
        
});