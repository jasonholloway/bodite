(function() {
	require('angular');
	
	angular.module('bb')
	.service('localeService', function() {
		this.getCurrent = function() {
			return { 
				code: 'LV', 
				language: {
					code: 'LV'
				},
				currency: {
					code: 'EU',
					symbol: '€',
					symbolPosition: 'before'					
				}   
			};
		}
	});	
	
})();