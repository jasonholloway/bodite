(function () {
    var urlJoin = require('url-join');
    var Fuse = require('../bodite_fuse');
    require('../math.uuid');

    var app = angular.module('BoditeAdmin');

    app.constant('DB_LOCATION', 'https://jasonholloway.cloudant.com/bb/');


    app.service('productRepo', ['$http', 'DB_LOCATION', function ($http, DB_LOCATION) {
        var items = new Map();
        var fuse;

        $http.get(urlJoin(DB_LOCATION, '_design/bbapp/_view/all_products'))
        .then(function (resp) {
            for(var row of resp.data.rows) {
                items.set(row.id, row.value);
            }

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
                var prod = {
                    _id: 'product/' + Math.uuidFast(),
                    name: {
                        LV: '',
                        RU: ''
                    },
                    images: []
                }

                items.set(prod._id, prod);

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
