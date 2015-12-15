(function() {
	require('angular');
	
	angular.module('bb')
	.service('productService', function($http) {
		
		var featuredProducts = null;
				
		this.getFeaturedProducts = function(page){						
			return new Promise(function(done, fail) {
				if(!featuredProducts) {				
					$http.get('http://jasonholloway.cloudant.com/bb/_design/bb/_view/featured-products')
					.then(function (r) {					
						featuredProducts = [];
						
						for(var i in r.data.rows) {
							var row = r.data.rows[i];									
							featuredProducts.push(row.value.doc);
						}
						
						done(featuredProducts);
					}, fail);	
				}		
				else {
					done(featuredProducts);
				}	
			});
		}
				
	})		
})();