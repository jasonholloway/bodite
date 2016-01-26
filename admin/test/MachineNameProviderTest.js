var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');

var MachineNameProvider = require('../js/services/MachineNameProvider');


describe('MachineNameProvider', function() {
      
   it('is created with existing name provider function', function() {       
       var fnExistingNames = function() {
           return ['jason', 'jolin', 'veronica', 'quailificent'];
       }
       
       new MachineNameProvider(fnExistingNames);       
   })
   
   
   
   function newProv(names) {
       return new MachineNameProvider(function() { return names || [] });
   }
   
   
   it('get() returns string', function() {
       var result = newProv().get('Jason');
       
       expect(typeof result).to.equal('string');
   })
   
   it('Decapitalizes', function() {
       var result = newProv().get('WeaSeL');
       
       expect(result).to.equal('weasel');
   })
      
   it('Replaces spaces with hyphens', function() {
       var result = newProv().get('edward the extremely weighty aardvark');
       
       expect(result).to.equal('edward-the-extremely-weighty-aardvark');        
   })
   
   it('Strips diacritics', function() {
       var result = newProv().get('mīļšvārdijūtas'); //should maybe test on more! TO DO...
       
       expect(result).to.equal('milsvardijutas');
   })
   
   it('Normalizes', function() {
       var result = newProv().get('.h]}e@l^l#o?!<£"\/\\');
       
       expect(result).to.equal('hello');
   })
   
   
   
   it('Adds simple number to name on first collision', function() {
       var prov = newProv(['brian', 'sheila', 'stumpy']);
       
       var result = prov.get('sheila');
       
       expect(result).to.equal('sheila-2');
   })
   
   it('Increments postfix number on subsequent collisions', function() {
       var prov = newProv(['brian', 'sheila', 'sheila-2', 'stumpy', 'sheila-3']);
       
       var result = prov.get('sheila');
       
       expect(result).to.equal('sheila-4');
   })
   
   
   it('nameExists() checks existing names for collision', function() {
       var prov = newProv(['brian', 'sheila', 'stumpy']);
       
       expect(prov.nameExists('sheila')).to.be.true;
       expect(prov.nameExists('tamara')).to.be.false;       
   })
   
    
});



