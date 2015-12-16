(function() {		
	require('angular');
	require('angular-ui-router');
	require('es5-shim');
		
	var bb = angular.module('bb', ['ui.router']);
	
	require('bulk-require')(__dirname, ['*.js', 'directives/*.js', 'controllers/*.js', 'services/*.js']);
		
	
	bb.config(function($stateProvider, $urlRouterProvider) {
		
		var globalController = function($scope, productViewModelService) {			
			$scope.viewModels = {
				featuredProducts: productViewModelService.getFeaturedProducts
			}			
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
	
    
})();