(function(){
    var angular = require('angular');
    var $ = require('jquery');
        
    var mod = angular.module('jhTree', []);
    
       
    
    mod.directive('jhTreeNode', function($compile) {
        var elem;
        
        return {
            restrict: 'A',
            scope: true,      
            link: function(el, att) {
                elem = el;
            },            
            controller: function($scope) {
                var inner = $compile($scope.nodeTemplateHtml)($scope);
                               
                console.log($scope.nodeTemplateHtml);
                               
                console.log(inner);
                                
                // inner.appendTo(elem);                
            }
        }
    })
    
    
    mod.directive('jhTree', function($templateCache, $compile) {    
        var elem;
        var nodeTemplateHtml;
            
        return {
            restrict: 'E',
            scope: {
                source: '&',
                template: '@'
            },
            link: function($scope, el, att) {                                                
                elem = el;                
            },
            template: function(tEl, tAtt) {
                nodeTemplateHtml = $templateCache.get(tAtt.nodeTemplate);
                return nodeTemplateHtml;                
            },
            controller: function($scope) {                
                $scope.nodeTemplateHtml = nodeTemplateHtml;                
                
                $scope.node = {
                    children: []
                };
                
                $scope.source()()                
                .then(function(root) {
                   $scope.node = root;                    
                   $scope.$applyAsync(); //should trigger watching child controllers...
                });
            }
        }
    });    
})();