// var $ = global.$ = require('jquery');
// require('angular');
var Translator = require('../Translator');
var app = angular.module('BoditeAdmin');
    
app.directive('productEditor', function($templateCache) {    
    
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '../templates/productEditor.html',
        bindToController: true,
        controllerAs: 'editor',
        controller: function ($http, $scope, $element, productRepo, machineNames) {
            var self = this;

            self.pristine = {};
            self.working = {};

            $scope.lang = 'LV';
            var translator = new Translator($scope);
            
            translator.add('Name', { LV: 'Vards', RU: 'Imya' });


            self.labels = {
                description: 'Description',
                name: 'Name',
                price: 'Price'
            }


            function refresh() {
                var isPristine = angular.equals(self.working, self.pristine);

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


            self.init = function (product) {
                self.pristine = product;
                self.working = angular.copy(self.pristine);

                $scope.$watch(
                    function () {
                        return self.working;
                    },
                    function () {
                        refresh()
                    },
                    true);                                        
            }

            self.save = function () {
                if (angular.equals(self.working, self.pristine)) return;

                productRepo.save(self.working)
                            .then(function (p) {
                                self.pristine = p;
                                self.working = angular.copy(self.pristine);
                                $scope.$apply();
                                refresh();
                            });
            }

            self.revert = function () {
                self.working = angular.copy(self.pristine);
            }


            self.switchLanguage = function(code) {             
                $scope.lang = code.toUpperCase();                    
                refresh();                                        
            }


            self.generateMachineName = function() {
                self.working.machineName = machineNames.get(self.working.name.LV);                
                $scope.$applyAsync();
            }

        }
        
    }
    
})
