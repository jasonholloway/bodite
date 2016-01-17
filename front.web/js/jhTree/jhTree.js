(function(){
    var angular = require('angular');
    var $ = require('jquery');
        
    var mod = angular.module('jhTree', []);
    
       
    
    mod.directive('jhTreeNode', function($compile) {
        return {
            restrict: 'A',
            scope: true,      
            controller: function($scope, $element) {
                var inner = $compile($scope.nodeTemplateHtml)($scope);                
                $($element).append(inner);                                
            }
        }
    })
    
    
    mod.directive('jhTree', function($compile, $templateRequest) {
        return {
            restrict: 'E',
            scope: {
                source: '&',
                template: '@'
            },
            controller: function($scope, $element) {
                Promise.all([
                    $templateRequest($scope.template),
                    $scope.source()()
                ])
                .then(function(r) {
                    $scope.nodeTemplateHtml = r[0];
                    $scope.node = r[1];
                    
                    var inner = $compile($scope.nodeTemplateHtml)($scope);
                                        
                    $($element).append(inner);
                });
            }
        }
    });    
})();