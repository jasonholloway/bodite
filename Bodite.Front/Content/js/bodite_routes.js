/// <reference path="angular.js" />
/// <reference path="bodite_admin.js" />

adminApp.config(['$routeProvider', function ($routeProvider) {

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