var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('promise');
var urlJoin = require('url-join');
var request = require('superagent');
var ApiClient = require('../js/ApiClient');



function throwIfCalled() {
    throw new Error('Unintended function call!');
}


describe('ApiClient', function() {
    
    var api;
    var server;    
    var exampleUser = { name: 'Jason', password: 'marmoset' }
        
    
    beforeEach(function() {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        
        api = new ApiClient('http://blah');
    });
    
    
    afterEach(function() {
        api = undefined;        
        server.restore()        
    })
    
    
    describe('authorize', function() {
    
        function serverReturnsToken(tok) {            
            server.respondWith(
                        urlJoin(api.baseUrl, 'login'),
                        [200, { 'Content-Type': 'application/json' }, JSON.stringify({ token: tok})]
                    ); 
        }            
        
    
        it('returns true via promise if any token in place', function(cb) {           
            api.token = 'asdasdsadsad';
                                        
            api.authorize(throwIfCalled)
                .then(function(result) {
                    expect(result).to.be.true;                   
                    cb(); 
                })
                .catch(cb);
        });
    
        
        it('if no token, seeks credentials from callback, which supplies them via promise', function(cb) {            
            serverReturnsToken('asdf');
                    
            var getCreds = sinon.stub().returns(Promise.resolve(exampleUser));
                        
            api.authorize(getCreds)
                .then(function() {
                    expect(getCreds.calledOnce).to.be.true
                    cb();
                })
                .catch(cb);
        });
    
    
        it('if no token, posts credentials to api', function(cb) {                    
            serverReturnsToken('asdf');
            
            api.authorize(sinon.stub().returns(Promise.resolve(exampleUser)))
                .then(function(res) {
                    expect(server.requests.length).to.equal(1);
                    
                    var req = server.requests[0];                    
                    expect(req.method).to.equal('POST');
                    expect(req.url).to.equal(urlJoin(api.baseUrl, 'login'));
                    expect(req.requestHeaders).to.haveOwnProperty('Content-Type', 'application/json;charset=utf8');
                    expect(req.requestBody).to.equal(JSON.stringify(exampleUser));
                    
                    cb();
                })
                .catch(cb);
        });
        
        
        it('returns true via promise on success', function(cb) {             
            serverReturnsToken('asdf');
            
            api.authorize(sinon.stub().returns(Promise.resolve(exampleUser)))
                .then(function(res) {
                    expect(res).to.be.true;
                    
                    cb();                    
                }) 
                .catch(cb);
        });
        
    
        it('sets token on success', function(cb) {             
            serverReturnsToken('hello');
            
            api.authorize(sinon.stub().returns(Promise.resolve(exampleUser)))
                .then(function(res) {
                    expect(api.token).to.equal('hello');                    
                    cb();                    
                }) 
                .catch(cb);
        });
        
        
        it('returns false via promise if not authorised', function(cb) {
            server.respondWith([401, {}, '']);
            
            api.authorize(sinon.stub().returns(Promise.resolve(exampleUser)))
                .then(function(res) {
                    expect(res).to.be.false;          
                    expect(api.token).to.be.undefined;          
                    cb();                    
                }) 
                .catch(cb);
        });
    
    
        it('waits on current authorisation if in progress', function(cb) {           
            serverReturnsToken('sprout');
           
            var getCredsSlowly = sinon.stub().returns(new Promise(function(done, fail) {
                                                                    setTimeout(function() { done(exampleUser) }, 1000);
                                                                }));                      
            api.authorize(getCredsSlowly)
                .catch(cb);
            
            api.authorize(throwIfCalled)
                .then(function(r) {
                    expect(r).to.be.true;
                    expect(api.token).to.equal('sprout');
                    
                    expect(getCredsSlowly.calledOnce).to.be.true;                    
                    expect(server.requests.length).to.equal(1);
                    
                    cb();                    
                })
                .catch(cb);
        });
    
    
        
    });
    
    
    
});







