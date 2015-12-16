(function() {
	require('angular');
	
	angular.module('bb')
	.service('localeService', function() {
		
		this.locales = {
			'LV': {
				code: 'LV',
				language: {
					code: 'LV'
				},
				currency: {
					code: 'EU',
					pattern: /€ $1/,
					ratio: 1
				}
			},	
			'RU': {
				code: 'RU',
				language: {
					code: 'RU'
				},
				currency: {
					code: 'EU',
					pattern: /€ $1/,
					ratio: 1
				}
			}
		};
				
		
		var currentLocales = [this.locales['LV']];
		
		this.setCurrentLocales = function(r) {
			currentLocales = r;
			//and reset something?
		}		
		
		this.getCurrentLocales = function() {
			return currentLocales;
		}
		
		
	});	
	
})();