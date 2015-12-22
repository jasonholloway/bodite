(function () {

    require('angular');
    var AWS = require('aws-sdk');
    require('./math.uuid');

    var Fuse = require('./bodite_fuse');


    var app = angular.module('BoditeAdmin');


    app.service('imageRepo', ['aws', function (aws) {

        var createKey = function () {
            return 'prodimg/' + Math.uuidFast();
        }

        return {
            getUrl: function (key) {
                return 'https://s3.eu-central-1.amazonaws.com/bodite/' + key;
            },

            save: function (blob) {
                return new Promise(function (success, failed) {
                    var key = createKey();

                    var bucket = new AWS.S3({ params: { Bucket: 'bodite' } });

                    var params = {
                        Key: key,
                        Body: blob,
                        ACL: 'public-read',
                        ContentType: blob.type,
                        //ContentMD5: ''
                    };

                    bucket.upload(params, function (err, data) {
                        if (err) failed(err);
                        else success(key);
                    });
                })
            }
        }
    }])


    app.service('productRepo', ['$http', function ($http) {
        var items = new Map();
        var fuse;

        $http.get('http://localhost:5984/bbapp/_design/bbapp/_view/all_products')
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
                    $http.put('http://localhost:5984/bbapp/' + encodeURIComponent(prod._id), prod)
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
