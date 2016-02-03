window.jQuery = window.$ = require('jquery');
require('angular');
require('angular-bootstrap');
require('angular-sanitize');
require('angular-route');
require('angular-dialog-service');
require('ng-pattern-restrict');
var urlJoin = require('url-join');

var app = angular.module('BoditeAdmin', ['ngRoute', 'ui.bootstrap', 'dialogs.main', 'ngPatternRestrict']);

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
