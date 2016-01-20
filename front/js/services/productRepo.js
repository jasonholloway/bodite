(function() {
	require('angular');
    var urlJoin = require('url-join');
	
	angular.module('bb')
	.service('productRepo', function($http, DB_LOCATION) {
		
		var featuredProducts = null;
				
		this.getFeaturedProducts = function(page) {
            if(featuredProducts) return Promise.resolve(featuredProducts);
            
            return $http
                    .get(urlJoin(DB_LOCATION, '_design/bb/_view/featured-products'))
                    .then(function(r) {
                        featuredProducts = [];
                        
                        for(var i in r.data.rows) {
                            var row = r.data.rows[i];									
                            featuredProducts.push(row.value.doc);
                        }
                        
                        return featuredProducts;                
                    });
		};
				
	})		
})();