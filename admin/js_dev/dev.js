require('angular');
require('../js/math.uuid');
var urlJoin = require('url-join');



window.onload = function() {
    window.dumpMachNames = function() {
        var injector = angular.element(document.getElementsByTagName('body')).injector();
        
        injector.get('productRepo').getItems()
            .then(items => {
                console.log(items.map(i => i.machineName));
            });
    }    
};


angular.module('BoditeAdmin')
.config(function($provide) {       
    var dbBaseUrl = 'http://localhost:5984/bb';
    
    $provide.constant('DB_LOCATION', dbBaseUrl);

    $provide.constant('DB_BASE_URL', dbBaseUrl);
    $provide.constant('DB_ALL_PRODUCTS_URL', urlJoin(dbBaseUrl, '_design/bb/_view/all_products'));
    
    
    
    $provide.service('imageRepo', aws => {
        var createKey = () => 'prodimg/' + Math.uuidFast();
        
        return {
            getUrl: (key) => 'img/dummy-product.png',

            save: function (blob) {
                return new Promise(function (success, failed) {
                    success(createKey());
                })
            }
        }                
    });        
                        
});
