(function() {		
	require('angular');
	require('angular-ui-router');
	
		
	angular.module('bb', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
			
		$urlRouterProvider.otherwise('/');
						
		$stateProvider
		.state('front', {
			url: '/',
			views: {
				'content': {
					templateUrl: 'templates/front-content.html',
					controller: function($scope) {
						$scope.message = 'Yo, Jason!'
					}
				}
			}
		});
					
			
	});
	
	
	
})();