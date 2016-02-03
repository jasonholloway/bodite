require('../BoditeAdmin');

require('angular');
var MachineNameProvider = require('../services/MachineNameProvider');

var app = angular.module('BoditeAdmin');

app.service('machineNames', function(productRepo) {
        
    this.get = function(name) {
        return productRepo.getItems()
                .then(function(items) {                             
                    var machNames = items.map(function(p) {
                        return p.machineName;
                    })
                    
                    var prov = new MachineNameProvider(function() { return machNames });
                               
                    return prov.get(name);
                });           
    }
    
});