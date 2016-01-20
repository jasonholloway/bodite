const expect = require('chai').expect,
      Translator = require('../js/Translator');


describe('Translator', function() {
		
	it('finds parent translator', function() {		
		var parentScope = {};
		var parentTranslator = parentScope.translator = new Translator(parentScope);
				
		var intermediateScope = Object.create(parentScope);
		
		var childScope = Object.create(intermediateScope);		
		childScope.translator = new Translator(childScope);
				
		// console.log(childScope);
								
		expect(childScope.translator.parent).to.equal(parentTranslator);
	})
	
	
	it('translations inherited from parent', function() {		
		var parentScope = {};
		parentScope.translator = new Translator(parentScope);
				
		var childScope = Object.create(parentScope);		
		childScope.translator = new Translator(childScope);
				
		parentScope.translator.add('name', { EN: 'Jason' })
								
		expect(childScope.translator.get('name'))
				.to.equal(parentScope.translator.get('name'));
	})
	
	
	it.skip('current inherited from parent', function() {
		throw new Error('unimplemented');
	})
	
	
	
	
})