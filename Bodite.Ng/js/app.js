(function() {		
	require('angular');
	require('angular-ui-router');
	require('es5-shim');
		
	angular.module('bb', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
		
		var globalController = function($scope, productService) {			
			$scope.featuredProducts	= productService.getFeaturedProducts;
		}
			
			
		$urlRouterProvider.otherwise('/');
						
		$stateProvider
		.state('front', {
			url: '/',
			views: {
				'content': {
					templateUrl: 'templates/front-content.html',
					controller: globalController
				}
			}
		});						
		
		
		
				
	});
		
    require('bulk-require')(__dirname, ['*.js', 'directives/*.js', 'controllers/*.js']);
	
})();