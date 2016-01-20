(function() {
    var angular = window.angular;
    var Translator = require('../Translator');
	var app = angular.module('BoditeAdmin');
	
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

                $scope.lang = 'LV';
                var translator = new Translator($scope);
                
                translator.add('Name', { LV: 'Vards', RU: 'Imya' });


                vm.labels = {
                    description: 'Description',
                    name: 'Name',
                    price: 'Price'
                }




                function refresh() {
                    var isPristine = angular.equals(vm.working, vm.pristine);

                    if (isPristine) {
                        elem.removeClass('dirty');
                    }
                    else {
                        elem.addClass('dirty');
                    }
                                        
                    var switchables = elem.find('.lang-switchable');                                        
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


                vm.switchLanguage = function(code) {             
                    $scope.lang = code.toUpperCase();                    
                    refresh();                                        
                }


            }]

        }
    })
	
	
})();