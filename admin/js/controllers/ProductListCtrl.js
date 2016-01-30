var app = angular.module('BoditeAdmin');

app.controller(
    'ProductListCtrl', 
    function($scope, productRepo) {
        var self = this;
        
        this.current = [];

        this.searchTerm = '';

        this.createNewProduct = function () {
            // this.filterProducts('');
            this.current = [productRepo.create()];
        }

        this.filterProducts = function (term) {
            return productRepo.filter(term)
                      .then(function(prods) {
                          return self.current = prods; 
                      });
        }
        
        
        $scope.$watch(
            function() {
                return self.searchTerm;
            },
            function(v) {
                self.filterProducts(v);
            });
        
    });