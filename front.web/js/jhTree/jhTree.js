(function(){
    var angular = require('angular');
    var $ = require('jquery');
        
    var mod = angular.module('jhTree', []);
    
       
    
    mod.directive('jhTreeNode', function($compile) {
        return {
            restrict: 'A',
            scope: true,      
            controller: function($scope, $element) {                
                $element.html($scope.nodeTemplateHtml);                
                $compile($element.contents())($scope);                      
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
                                        
                    $element.html($scope.nodeTemplateHtml);
                    
                    $compile($element.contents())($scope);                    
                });
            }
        }
    });    
})();