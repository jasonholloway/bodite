(function(){	
	require('angular');
	
	// angular.module('bb')
	// .controller('globalController', function($scope, productService) {
	// 	$scope.featuredProducts	= function() {
	// 		return productService.getFeaturedProducts();
	// 	}
	// });
        
      
    angular.module('bb')
    .controller('globalController', function($scope, productViewModelService, catRepo) {	
        $scope.viewModels = {
            featuredProducts: productViewModelService.getFeaturedProducts
        }			    
        
        $scope.getCategoryMenu = catRepo.getCatTree;
        
    })
	
})();