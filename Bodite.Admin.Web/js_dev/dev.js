(function () {
    require('angular');
    require('../js/math.uuid');

    var app = angular.module('BoditeAdmin');


    app.config(function($provide) {       
       $provide.service('imageRepo', imageRepo);        
       $provide.constant('DB_LOCATION', 'http://localhost:5984/bb');                
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
