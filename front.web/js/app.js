(function() {		
	require('angular');
	require('angular-ui-router');
    require('angular-mocks/ngMock');
	require('es5-shim');
			
    require('./itemGrid/itemGrid');
    require('./menuHier/menuHier');
    
	var bb = angular.module('bb', ['ui.router', 'itemGrid', 'menuHier']);
            
	require('bulk-require')(__dirname, ['*.js', 'directives/*.js', 'controllers/*.js', 'services/*.js', 'filters/*.js']);	
      
        
    bb.constant('DB_LOCATION', 'https://jasonholloway.cloudant.com/bb');
        
	
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
//				'content': {
//					//templateUrl: 'templates/front-content.html',
//				},
                'content-middle': {
                    templateUrl: 'templates/front-content.html',
					controller: globalController
                },

                'content-bottom': {
                    templateUrl: 'templates/front-news.html'
                }


			}
		});						
		
		
		
				
	});
	
    
})();
