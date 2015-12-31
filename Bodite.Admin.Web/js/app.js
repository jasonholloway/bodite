global.jQuery = global.$ = require('jquery');
require('angular');
require('angular-sanitize');

(function () {
    require('angular-route');
    require('angular-dialog-service');

    var app = angular.module('BoditeAdmin', ['ngRoute', 'dialogs.main']);

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


    require('bulk-require')(__dirname, ['*.js']);

})();

