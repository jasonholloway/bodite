(function(){	
	require('angular');
	
	angular.module('bb')
	.controller('globalController', function($scope, productService) {
		$scope.featuredProducts	= function() {
			return productService.getFeaturedProducts();
		}
	});
	
})();