var Fuse = require('../bodite_fuse');
var Promise = this.Promise || require('promise');
var urlJoin = require('url-join');        
require('../math.uuid');

var app = angular.module('BoditeAdmin');

app.service('productRepo', function ($http, DB_BASE_URL, DB_ALL_PRODUCTS_URL) {
    var self = this;
    
    var items, itemMap;
        
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
        
        itemMap[prod._id] = prod;
        items.push(prod);
    }



    this.getItems = function() {            
        if(items) return Promise.resolve(items);
        
        items = [];
        itemMap = {};
                    
        return $http.get(DB_ALL_PRODUCTS_URL)                        
                    .then(function (resp) {                                
                        resp.data.rows.forEach(function(row) {
                            var product = complete(row.value);                                
                            addProdToFuse(product);
                        });
                        
                        return items;
                    });                
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
        var url = urlJoin(DB_BASE_URL, prod._id);
        
        return $http.put(url, prod)
                    .then(function(r) {                        
                        prod._rev = r.data.rev;
                        
                        if(!items) {
                            items = [];
                            itemMap = {};                            
                            items.push(prod);
                        }
                                                
                        return itemMap[prod._id] = prod;
                    });                
    };
    
});
