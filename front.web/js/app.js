(function() {		
	require('angular');
	require('angular-ui-router');
    require('angular-mocks/ngMock');
	require('es5-shim');
			
    require('./itemGrid/itemGrid');
    require('./jhTree/jhTree');
    
	var bb = angular.module('bb', ['ui.router', 'itemGrid', 'jhTree']);
            
	require('bulk-require')(__dirname, ['*.js', 'directives/*.js', 'controllers/*.js', 'services/*.js', 'filters/*.js']);	
      
        
    bb.constant('DB_LOCATION', 'https://jasonholloway.cloudant.com/bb');
    bb.constant('CATEGORY_TREE_URL', 'https://jasonholloway.cloudant.com/bb/categorytree');
      
      
    bb.run(function($templateCache, $templateRequest) {
                
        // $templateCache.put('catMenuNode', )
    });
      
	bb.config(function($stateProvider, $urlRouterProvider, $locationProvider) {		
			
        $locationProvider.html5Mode(true);
            
		$urlRouterProvider.otherwise('/');
						
		$stateProvider
		.state('front', {
			url: '/',
			views: {
//				'content': {
//					//templateUrl: 'templates/front-content.html',
//				},
                'content-middle': {
                    templateUrl: 'templates/front-content.html'
                },

                'content-bottom': {
                    templateUrl: 'templates/front-news.html'
                }


			}
		});						
		
		
		
				
	});
	
    
})();
