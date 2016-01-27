require('angular');
var MachineNameProvider = require('../services/MachineNameProvider');

var app = angular.module('BoditeAdmin');

app.service('machineNames', function(productRepo) {
    
    var fnNames = function() {        
        return productRepo.items.map(function(i) {
            return i.machineName;
        })
    }
    
    var prov = new MachineNameProvider(fnNames);
        
    return {
        get: function(n) { return prov.get(n); }  
    }
});