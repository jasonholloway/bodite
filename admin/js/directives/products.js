(function () {
    require('../math.uuid');    

    var app = angular.module('BoditeAdmin');
    

    app.directive('products', function () {
        return {
            restrict: 'E',
            scope: true,
            controller: ['productRepo', function (repo) {
                this.filteredItems = [];

                this.create = function () {
                    this.filter('');
                    this.filteredItems = [repo.create()];
                }

                this.filter = function (term) {
                    this.filteredItems = repo.filter(term);
                }
            }],
            controllerAs: 'products',
            templateUrl: 'templates/products.html'
        }
    })
    

})();







