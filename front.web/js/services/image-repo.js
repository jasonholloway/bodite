(function() {
	require('angular');
		
	angular.module('bb')
	.service('imageRepo', function() {
		this.getUrl = function(key) {
			return 'https://s3.eu-central-1.amazonaws.com/bodite/' + key;	
		}			
	});
	
	
})();