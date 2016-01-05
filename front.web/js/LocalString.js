(function() {	
	require('es5-shim');	
	require('angular');
		
	function LocalString(localeService, strings) {		
		this.strings = [];		
		
		for(var code in strings) {
			this.strings[code.toUpperCase()] = strings[code];			
		}
				
		this.getValue = function() {
			var localeCodes = localeService.getCurrentLocales().map(function(l) { return l.code; });
			
			if(!localeCodes || !localeCodes.length) {
				throw Error('No locale set!');
			}

			for(var i = 0; i < localeCodes.length; i++) {
				var code = localeCodes[i];
				
				var v = this.strings[code];
				
				if(v) {
					return v;	
				}
			}			
			
			throw Error('LocalString can\'t provide for current locale!');
		}
				
		this.toString = function() {
			return this.getValue();
		}		

	}
			
	module.exports = LocalString; 	
	
})();