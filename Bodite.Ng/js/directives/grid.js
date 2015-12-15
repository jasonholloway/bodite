(function() {
	require('angular');
	
	angular.module('bb')
	.directive('grid', function() {
		return {
			restrict: 'E',
			scope: {
				'source': '&'
			},
			controller: function($scope) {				
				$scope.source({ index: 0, size: 15})
				.then(function(items) {
					$scope.items = items;
					$scope.$applyAsync();
				}, function(e) {
					throw Error(e);
				})				
			},
			template: [
				'<div>',
					'<product-teaser ng-repeat="item in items"></product-teaser>',
				'</div>'
			].join('')
		}
	});
	
})();