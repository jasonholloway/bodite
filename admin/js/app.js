global.jQuery = global.$ = require('jquery');
require('angular');
require('angular-sanitize');
require('ng-pattern-restrict');
var urlJoin = require('url-join');

(function () {
    require('angular-route');
    require('angular-dialog-service');

    var app = angular.module('BoditeAdmin', ['ngRoute', 'dialogs.main', 'ngPatternRestrict']);

    var dbBaseUrl = 'https://jasonholloway.cloudant.com/bb/';
    
    app.constant('DB_BASE_URL', dbBaseUrl);
    app.constant('DB_ALL_PRODUCTS_URL', urlJoin(dbBaseUrl, '_design/bb/_view/all_products'));


    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/products', {
            templateUrl: 'templates/products.html'
        })
        .when('/categories', {
            templateUrl: 'templates/categories.html'
        })
        .otherwise({
            templateUrl: 'templates/dashboard.html'
        })

    }]);


    require('bulk-require')(__dirname, ['**/*.js']);   

})();

