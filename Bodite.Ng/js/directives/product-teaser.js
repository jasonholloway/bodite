(function() {
	require('angular');
	
	angular.module('bb')
	.directive('productTeaser', function() {
		return {
			restrict: 'E',
			scope: true,
			controller: function($scope) {
				
			},
			template: '<div>Y: {{item}}</div>'
			//templateUrl: 'templates/product-teaser.html'
		}
	});
	
})();