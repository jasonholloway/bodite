/// <reference path="bodite_admin.js" />
/// <reference path="anguar.js" />


adminApp.directive('categoryPicker', ['categoryRepo', function (catRepo) {

    return {
        restrict: 'E',
        scope: true,
        controller: ['$scope', '$compile', function ($scope, $compile) {

            $scope.categories = [];

            catRepo.getCategories()
            .then(function (cats) {
                $scope.categories = cats;                
                $scope.$applyAsync();
            });


            $scope.promptForCategory = function () {

                var dialScope = $scope.$new();

                var dialLinker = $compile([
                    '<form>',
                        '<label>Category:</label>',
                        '<select>',
                            '<option ng-repeat="cat in categories" value="{{cat._id}}">{{cat.$$pathString}}</option>',
                        '</select>',
                    '</form>'
                ].join(''));
                
                var dialDiv = dialLinker($scope);

                dialDiv.dialog({
                    resizable: false,
                    height: 140,
                    modal: true,
                    buttons: {
                        OK: function () {
                            var sel = $(this).find('select');
                            var catKey = sel[0].value;
                            
                            if ($scope.product.working.categoryKeys.indexOf(catKey) < 0) {
                                $scope.product.working.categoryKeys.push(catKey);
                                $scope.$applyAsync();
                            }
                            
                            $(this).dialog("close");
                            dialScope.$destroy();
                        },
                        Cancel: function () {
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
            '<input type="button" value="add" class="addCategoryButton" ng-click="promptForCategory()" />',
        ].join('')
    }

}])


adminApp.directive('categoryChip', ['categoryRepo', function (catRepo) {
    return {
        restrict: 'E',
        scope: true,
        controller: ['$scope', function ($scope) {
            $scope.category = { $$pathString: '...' };

            $scope.delete = function() {
                $scope.product.working.categoryKeys.splice($scope.$index, 1);  
            };


            $scope.categoryPath = $scope.$path

            catRepo.getCategoryByKey($scope.categoryKey)
            .then(function (cat) {
                $scope.$applyAsync(function () {
                    $scope.category = cat;
                });
            });
        }],
        template: [
            '{{category.$$pathString}}',
            '<input type="button" value="delete" ng-click="delete()" />'
        ].join('')
    }
}])



