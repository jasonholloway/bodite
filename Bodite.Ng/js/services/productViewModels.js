(function() {
	require('angular');
	require('es5-shim');
	
	angular.module('bb')
	.service('productViewModelService', function(productService, imageService, localeService) {
				
		function makeViewModel(locale) {
			return function(p) {
				return {
					name: { language: locale.language, val: p.name[locale.code] },
					imageUrl: p.images && p.images.length ? imageService.getUrl(p.images[0].key): 'images\default.jpg',
					price: { currency: locale.currency, val: 1355 } //€13.55
				};				
			}
		}
				
		this.getFeaturedProducts = function(page){						
			return new Promise(function(done, fail) {				
				productService.getFeaturedProducts(page)
				.then(function(products) {
					var locale = localeService.getCurrent();					
					done(products.map(makeViewModel(locale)));
				}, fail);				
			});
		}
				
	})		
})();