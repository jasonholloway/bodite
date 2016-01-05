(function() {
	
	function Price(currencyService, code, val) {
		this.code = code;		
		this.value = val;
		
		this.getValue = function() {
			return '€' + val / 100;
		}

		this.toString = function() {
			return this.getValue();	
		}		
		
	}
			
			
	module.exports = Price; 	
	
})();