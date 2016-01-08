(function(){
    var angular = require('angular');
        
    angular.module('menuHier', [])
    .directive('menuHier', function() {        
        return {
            restrict: 'E',
            scope: {
                source: '&'
            },
            controller: function($scope) {
                $scope.source()()                
                .then(function(tree) {
                    $scope.roots = tree.roots;
                    
                    $scope.$applyAsync();
                });
            },
            template: [
                '<ul>',
                    '<li ng-repeat="root in roots">{{root.name}}</li>',
                '</ul>'
            ].join('\n')
        }
    });    
})();