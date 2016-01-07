(function() {
	require('angular');
    require('babel-polyfill');
	
	var mod = angular.module('itemGrid', []);
        
	mod.directive('itemGrid', function() {
		return {
			restrict: 'E',
			scope: {
				'source': '&',
				'cols': '=',
				'rows': '='
			},
			controller: function($scope) {
				var pageSize = ($scope.rows || 6) * ($scope.cols || 3);
				                                
				$scope.source()({ index: 0, size: pageSize })                
                .then(function(items) {                     //source should return not just items, but page specs...
					$scope.items = items;
					
					$scope.itemRows = [];
					
					var rowItems = [];
					
					for(var i = 0; i < items.length && $scope.itemRows.length < $scope.rows; i++) {							
						rowItems.push(items[i]);
										
						if(rowItems.length == $scope.cols) {
							$scope.itemRows.push(rowItems);
							rowItems = [];
						}						
					}
					
					if(rowItems.length) $scope.itemRows.push(rowItems);
					
					$scope.$applyAsync();
                    
				}, function(e) {
					throw Error(e);
				})				
			},
			template: function(elem, attr) {				
				return [
					'<div>',
						'<div class="itemGridRow" ng-repeat="row in itemRows">',
							'<div class="itemGridCell" ng-repeat="item in row" ng-include="\'' + attr.templateUrl + '\'"></div>',
						'</div>',
					'</div>'
				].join('')
			}
		}
	});
	
})();
