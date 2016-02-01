(function () {
    require('angular');
    require('../js/math.uuid');
    var urlJoin = require('url-join');

    var app = angular.module('BoditeAdmin');


    app.config(function($provide) {       
       $provide.service('imageRepo', imageRepo);        
       
       var dbBaseUrl = 'http://localhost:5984/bb';
        
       $provide.constant('DB_LOCATION', dbBaseUrl);
    
       $provide.constant('DB_BASE_URL', dbBaseUrl);
       $provide.constant('DB_ALL_PRODUCTS_URL', urlJoin(dbBaseUrl, '_design/bb/_view/all_products'));
                       
    });



    function imageRepo(aws) {
        var createKey = function () {
            return 'prodimg/' + Math.uuidFast();
        }

        return {
            getUrl: function (key) {
                return 'img/dummy-product.png';
            },

            save: function (blob) {
                return new Promise(function (success, failed) {
                    success(createKey());
                })
            }
        }        
    }

})();
