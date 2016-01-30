var Fuse = require('../bodite_fuse');
var Promise = this.Promise || require('promise');        
require('../math.uuid');

var app = angular.module('BoditeAdmin');

app.service('productRepo', function ($http, DB_ALL_PRODUCTS_URL) {
    var self = this;
    
    var items;
    var fuse;

    function complete(p) {            
        p.name = p.name || {};
        p.description = p.description || {};
        p.images = p.images || [];
        return p;
    }

    function addProdToFuse(prod) {
        //normalize title here...
        //...
        
        items[prod._id] = prod;
    }



    this.getItems = function() {            
        if(items) {
            return Promise.resolve(items);
        }
        
        items = {};
                    
        return $http.get(DB_ALL_PRODUCTS_URL)                        
                    .then(function (resp) {                                
                        resp.data.rows.forEach(function(row) {
                            var product = complete(row.value);                                
                            addProdToFuse(product);
                        });
                        
                        fuse = new Fuse({
                            keys: ['name.LV', 'name.RU'],
                            threshold: 0.45
                        });
                        
                        return items;
                    });                
    };
        
    this.filter = function (term) {
        return this.getItems()
                    .then(function(items) {
                        return fuse ? fuse.search(items, term) : []; 
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
        throw Error('SAVING CURRENTLY UNIMPLEMENTED!');
        
        // return new Promise(function (fulfilled, rejected) {
        //     $http.put(urlJoin(DB_LOCATION, encodeURIComponent(prod._id)), prod)
        //     .then(function (r) {
        //         prod._rev = r.data.rev;

        //         items.set(prod._id, prod);

        //         fulfilled(prod);
        //     }, function () {
        //         rejected();
        //     })
        // })
    };
    
});