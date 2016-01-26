(function () {
    var urlJoin = require('url-join');
    var Fuse = require('../bodite_fuse');
    require('../math.uuid');

    var app = angular.module('BoditeAdmin');


    app.service('productRepo', ['$http', 'DB_LOCATION', function ($http, DB_LOCATION) {
        var items = new Map();
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
            items.set(prod._id, prod);
        }


        $http.get(urlJoin(DB_LOCATION, '_design/bb/_view/all_products'))
        .then(function (resp) {            
            resp.data.rows.forEach(function(row) {
                addProdToFuse(complete(row.value));
            });
            
            fuse = new Fuse({
                keys: ['name.LV', 'name.RU'],
                threshold: 0.45
            });
        }
        );


        return {
            items: items,

            filter: function (term) {
                return fuse ? fuse.search(items, term) : [];
            },

            create: function () {
                var prod = complete({
                    _id: 'product/' + Math.uuidFast()
                })

                addProdToFuse(prod);

                return prod;
            },


            save: function (prod) {
                return new Promise(function (fulfilled, rejected) {
                    $http.put(urlJoin(DB_LOCATION, encodeURIComponent(prod._id)), prod)
                    .then(function (r) {
                        prod._rev = r.data.rev;

                        items.set(prod._id, prod);

                        fulfilled(prod);
                    }, function () {
                        rejected();
                    })
                })
            }
        }
    }
    ])

})();
