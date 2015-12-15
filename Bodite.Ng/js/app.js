(function() {		
	require('angular');
	require('angular-ui-router');
	require('es5-shim');
		
	angular.module('bb', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
			
		$urlRouterProvider.otherwise('/');
						
		$stateProvider
		.state('front', {
			url: '/',
			views: {
				'content': {
					templateUrl: 'templates/front-content.html',
					controller: 'globalController'
				}
			}
		});								
	});
		
    require('bulk-require')(__dirname, ['*.js', 'directives/*.js', 'controllers/*.js']);
	
})();