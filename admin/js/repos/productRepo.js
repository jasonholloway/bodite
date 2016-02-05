require('../BoditeAdmin');
require('./productDb');

var Fuse = require('../bodite_fuse');
var Promise = window.Promise || require('promise');
var MachineNameProvider = require('../services/MachineNameProvider');
// var urlJoin = require('url-join');        
var _ = require('lodash');
require('../math.uuid');
// var D = require('derived');

var app = angular.module('BoditeAdmin');

app.service('productRepo', function (productDb) {
    var self = this;
    
    var itemMap;
        
    var fuse = new Fuse({
        keys: ['name.LV', 'name.RU'],
        threshold: 0.45
    });
    
       
    function complete(p) {            
        p.name = p.name || {};
        p.description = p.description || {};
        p.images = p.images || [];
        return p;
    }

    function addProdToFuse(prod) {
        //normalize title here...
        //...        
        // items.push(prod);
        
        itemMap[prod._id] = prod;
    }



    this.getItems = function() {        
        function renderIterable() {
            return _.values(itemMap);
        }
                    
        if(itemMap) return Promise.resolve(renderIterable());
        
        itemMap = {};
                    
        return productDb.getAll()
                    .then(prods => {
                        prods.forEach(p => {
                            var prod = complete(p);
                            addProdToFuse(prod);
                        })
                                                
                        return renderIterable();
                    })
    };
        
    this.filter = function (term) {
        return this.getItems()
                    .then(function(items) {
                        return fuse.search(items, term); 
                    });
    };

    this.create = function () {
        var prod = complete({
            _id: 'product/' + Math.uuidFast()
        })

        addProdToFuse(prod);

        return prod;
    };


    this.save = function (prod) {        
        return productDb.save(prod)
                .then(p => {
                    if(!itemMap) itemMap = {};
                    
                    var machineNames = _.values(itemMap) //inefficient
                                        .map(i => i.machineName)
                                        .filter(n => n !== p.machineName);
                    
                    prod.machineName = new MachineNameProvider(() => machineNames).get(prod.name.LV);                                              
                    
                    return itemMap[prod._id] = prod;                        
                });                
    };
    
});
