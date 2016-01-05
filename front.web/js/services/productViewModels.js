(function() {
	require('angular');
	require('es5-shim');
	
	var Price = require('./../Price');
	var LocalString = require('./../LocalString');
	
	angular.module('bb')
	.service('productViewModelService', function(productService, imageService, localeService) {
				
		function makeViewModel(p) {
			return {
				name: new LocalString(localeService, p.name),
				imageUrl: p.images && p.images.length ? imageService.getUrl(p.images[0].key): 'images\default.jpg',
				price: new Price(null, 'EU', 1355)
			};				
		}
				
		this.getFeaturedProducts = function(page){						
			return new Promise(function(done, fail) {				
				productService.getFeaturedProducts(page)
				.then(function(products) {					
					done(products.map(makeViewModel));
				}, fail);				
			});
		}
				
	})		
})();