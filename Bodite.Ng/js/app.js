(function() {		
	require('angular');
	require('angular-ui-router');
	
		
	angular.module('bb', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
			
		$urlRouterProvider.otherwise('/front');
			
			
		$stateProvider
		.state('front', {
			url: '/',
			views: {
				'content-top': {
					templateUrl: 'templates/front-top.html',
					controller: function($scope) {
						$scope.message = 'Yo, Jason!'
					}
				}
			}
		});
			
			
	});
	
	
	
})();