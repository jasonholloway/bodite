(function() {
	
	var setPrototypeOf = require('setprototypeof');	
	
	function Translator($scope) {
		this.$scope = $scope;						
		this.parent = $scope.translator;
				
		this.translations = {};
		if(this.parent) { setPrototypeOf(this.translations, this.parent.translations) }
				
		this.current = {};
		if(this.parent) { setPrototypeOf(this.current, this.parent.current) }		
		
		$scope.translator = this;
		//$scope.t = this.translate.bind(this);	
	}	
	
	Translator.prototype.add = function(key, tran) {
		this.translations[key] = tran;		
	}	
	
	Translator.prototype.get = function(key) {		
		//merge translations above...
		
		return this.translations[key];
	}
	
	Translator.prototype.translate = function(key, lang) {		
		lang = lang || this.$scope.lang;		
		var tran = this.get(key);		
		return (tran ? tran[lang] : null) || key;
	}
	
	
	module.exports = Translator;	
	
})();