require('../BoditeAdmin');
require('../math.uuid');    

var app = angular.module('BoditeAdmin');

app.directive('products', function () {
    return {
        restrict: 'E',
        scope: true,
        controller: function (productRepo) {
            this.filteredItems = [];

            this.create = function () {
                this.filter('');
                this.filteredItems = [productRepo.create()];
            }

            this.filter = function (term) {
                this.filteredItems = productRepo.filter(term);
            }
        },
        controllerAs: 'products',
        templateUrl: 'templates/products.html'
    }
})
