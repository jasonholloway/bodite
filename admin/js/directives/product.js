(function() {
    require('angular');
    var $ = require('jquery');
    var Translator = require('../Translator');
	var app = angular.module('BoditeAdmin');
    var MachineNameProvider = require('../services/MachineNameProvider');
    
	
    app.directive('product', function ($templateCache) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: '../templates/product.html',
            bindToController: true,
            controllerAs: 'product',
            controller: function ($http, $scope, $element, productRepo, machineNames) {
                
                var vm = this;

                vm.pristine = {};
                vm.working = {};

                $scope.lang = 'LV';
                var translator = new Translator($scope);
                
                translator.add('Name', { LV: 'Vards', RU: 'Imya' });


                vm.labels = {
                    description: 'Description',
                    name: 'Name',
                    price: 'Price'
                }


                $scope.$watch(function() {
                    return vm.working && vm.working.name ? vm.working.name.LV : '';
                },
                function(v) {
                    if(vm.working) {
                        vm.working.machineName = v.length > 0
                                                    ? machineNames.get(vm.working.name.LV)
                                                    : '';
                    }
                })


                function refresh() {
                    var isPristine = angular.equals(vm.working, vm.pristine);

                    if (isPristine) {
                        $element.removeClass('dirty');
                    }
                    else {
                        $element.addClass('dirty');
                    }
                                        
                    var switchables = $($element).find('.lang-switchable');                                        
                    switchables.not('.' + $scope.lang).hide();
                    switchables.filter('.' + $scope.lang).show();                    
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

                    productRepo.save(vm.working)
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


                vm.switchLanguage = function(code) {             
                    $scope.lang = code.toUpperCase();                    
                    refresh();                                        
                }


            }

        }
    })
	
	
})();