(function() {
	require('angular');
	require('es5-shim');
	
	var Price = require('./../Price');
	var LocalString = require('./../LocalString');
	
	angular.module('bb')
	.service('productViewModelService', function(productRepo, imageRepo, localeService) {
				
		function makeViewModel(p) {
			return {
				name: new LocalString(localeService, p.name),
				imageUrl: p.images && p.images.length ? imageRepo.getUrl(p.images[0].key) : 'img/empty-image.png',
				price: new Price(null, 'EU', 1355)
			};				
		}
				
		this.getFeaturedProducts = function(page) {               						
            return productRepo
                    .getFeaturedProducts({})
                    .then(function(items) {
                        return {
                            items: items.map(makeViewModel),
                            pageCount: 2,
                            page: {
                                index: 0,
                                size: 16
                            }
                        }
                    });                                                       
		}
				
	})		
})();