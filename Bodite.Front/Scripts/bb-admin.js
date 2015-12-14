
(function () {    
    var ng = require('angular');
    require('angular-route');
    require('angular-dialog-service');

    var app = angular.module('BoditeAdmin', ['ngRoute', 'dialogs.main']);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/products', {
            templateUrl: 'Content/templates/admin/products.html'
        })
        .when('/categories', {
            templateUrl: 'Content/templates/admin/categories.html'
        })
        .otherwise({
            templateUrl: 'Content/templates/admin/dashboard.html'
        })

    }]);


    require('bulk-require')(__dirname, ['*.js']);

})();
