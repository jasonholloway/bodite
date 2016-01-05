(function() {
	require('angular');
		
	angular.module('bb')
	.service('imageService', function() {
		this.getUrl = function(key) {
			return 'https://s3.eu-central-1.amazonaws.com/bodite/' + key;	
		}			
	});
	
	
})();