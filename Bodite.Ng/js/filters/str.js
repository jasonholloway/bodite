(function(){	
	require('angular');
		
	angular.module('bb')
	.filter('str', function() {		
		return function(o) {									
			if(o.toString) {
				return o.toString();
			}
			
			throw Error('Filter \'str\' can\'t process object without toString() method!');
		}
	});	
})();