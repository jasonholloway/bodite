(function () {
    require('./math.uuid');
    var ng = require('angular');
    var $ = require('jquery');
    

    var app = ng.module('BoditeAdmin');


    app.directive('productSearchbox', function () {
        return {
            restrict: 'E',
            scope: true,
            template: '<input type="search" placeholder="Meklēt..." >',
            link: function (scope, elem) {
                var lastVal;

                $(elem).on("input", function (e) {
                    var val = e.target.value;

                    if (lastVal != val) {
                        lastVal = val;

                        if (scope.products) {
                            scope.$applyAsync(function () {
                                scope.products.filter(val);
                            }
                            )
                        }
                    }
                    ;
                });
            }
        }
    })
    

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
            controllerAs: 'products'
        }
    })
    

    app.directive('product', function () {
        return {
            restrict: 'E',
            scope: true,
            bindToController: true,
            controllerAs: 'product',
            controller: ['$http', '$scope', '$element', 'productRepo', function ($http, $scope, elem, repo) {
                var vm = this;

                vm.pristine = {};
                vm.working = {};

                var refresh = function () {
                    var isPristine = angular.equals(vm.working, vm.pristine);

                    if (isPristine) {
                        elem.removeClass('dirty');
                    }
                    else {
                        elem.addClass('dirty');
                    }
                }


                vm.init = function (product) {
                    vm.pristine = product;
                    vm.working = angular.copy(vm.pristine);

                    $scope.$watch(
                        function () {
                            return vm.working;
                        },
                        function () {
                            refresh()
                        },
                        true);
                }

                vm.save = function () {
                    if (angular.equals(vm.working, vm.pristine)) return;

                    repo.save(vm.working)
                    .then(function (p) {
                        vm.pristine = p;
                        vm.working = angular.copy(vm.pristine);
                        $scope.$apply();
                        refresh();
                    });
                }

                vm.revert = function () {
                    vm.working = angular.copy(vm.pristine);
                }

            }]

        }
    })
    

})();







