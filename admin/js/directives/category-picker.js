require('../BoditeAdmin');

require('jquery-ui');
require('angular-bootstrap');
require('angular-dialog-service');

var app = angular.module('BoditeAdmin')
.directive('categoryPicker', function (categoryRepo) {

    return {
        restrict: 'E',
        scope: true,
        controller: ['$scope', '$compile', function ($scope, $compile) {

            $scope.categories = [];

            categoryRepo.getCategories()
                .then(function (cats) {
                    $scope.categories = cats;
                    $scope.$applyAsync();
                }, function(err) {
                    throw err;
                });


            $scope.promptForCategory = function () {

                var dialScope = $scope.$new();

                var dialLinker = $compile([
                    '<form id="category-picker-popup">',
                        '<select>',
                            '<option ng-repeat="cat in categories" value="{{cat._id}}">{{cat.$$pathString}}</option>',
                        '</select>',
                    '</form>'
                ].join(''));

                var dialDiv = dialLinker($scope);

                dialDiv.dialog({
                    resizable: false,
                    //height: 140,
                    modal: true,
                    title: "Izvēlēties kategoriju:",
                    buttons: {
                        OK: function () {
                            var sel = $(this).find('select');
                            var catKey = sel[0].value;

                            var prod = $scope.product.working;

                            if (!prod.categoryKeys) {
                                prod.categoryKeys = [];
                            }

                            if (prod.categoryKeys.indexOf(catKey) < 0) {
                                prod.categoryKeys.push(catKey);
                                $scope.$applyAsync();
                            }

                            $(this).dialog("close");
                            dialScope.$destroy();
                        },
                        Atcelt: function () {
                            $(this).dialog("close");
                            dialScope.$destroy();
                        }
                    }
                });

            }

        }],
        controllerAs: '$c',
        template: [
            '<category-chip ng-repeat="categoryKey in product.working.categoryKeys"></category-chip>',
            '<input type="button" value="Pievienot" class="addCategoryButton" ng-click="promptForCategory()" />',
        ].join('')
    }

})




angular.module('BoditeAdmin')
.directive('categoryChip', function (categoryRepo) {
    return {
        restrict: 'E',
        scope: true,
        controller: ['$scope', function ($scope) {
            $scope.category = { $$pathString: '...' };

            $scope.delete = function () {
                $scope.product.working.categoryKeys.splice($scope.$index, 1);
            };


            $scope.categoryPath = $scope.$path

            categoryRepo.getCategoryByKey($scope.categoryKey)
                .then(function (cat) {
                    $scope.$applyAsync(function () {
                        $scope.category = cat;
                    });
                });
        }],
        template: [
            '{{category.$$pathString}}',
            '<input type="button" class="delete-product-category" ng-click="delete()" />'
        ].join('')
    }
})

