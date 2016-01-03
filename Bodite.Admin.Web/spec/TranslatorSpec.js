describe('Translator', function() {
	var Translator = require('../js/Translator');
		
	it('finds parent translator', function() {		
		var parentScope = {};
		var parentTranslator = parentScope.translator = new Translator(parentScope);
				
		var intermediateScope = Object.create(parentScope);
		
		var childScope = Object.create(intermediateScope);		
		childScope.translator = new Translator(childScope);
				
		console.log(childScope);
				
				
		expect(childScope.translator.parent).toBe(parentTranslator);
	})
	
	
	it('translations inherited from parent', function() {		
		var parentScope = {};
		parentScope.translator = new Translator(parentScope);
				
		var childScope = Object.create(parentScope);		
		childScope.translator = new Translator(childScope);
				
		parentScope.translator.add('name', { EN: 'Jason' })
								
		expect(childScope.translator.get('name'))
				.toBe(parentScope.translator.get('name'));
	})
	
	
	it('current inherited from parent', function() {
		fail('unimplemented');
	})
	
	
	
	
})