var Promise = require('promise');
var request = require('superagent');
var urlJoin = require('url-join');



function ApiRequest(baseUrl) {   
    this.baseUrl = baseUrl || '';
    this.retryAuth = false;
    
    this._token = undefined;    
    this._current = undefined;
}


ApiRequest.prototype.authorize = function(getCreds) {
    var self = this;
    
    if(self._current) return self._current;
        
    var loginUrl = urlJoin(self.baseUrl, 'login');
    
    function clearInProgress(x) {
        self._current = undefined;
        return x;
    }
        
    function attemptAuth(done, fail, count) {               
        count = count || 0;
             
        getCreds(count)
            .then(function(creds) {
                if(!creds) return done(false);
                
                request.post(loginUrl)
                        .send(creds)
                        .set('Accept', 'application/json')
                        .set('Content-Type', 'application/json')
                        .end(function(err, res) {                            
                            if(res.status === 401) { //FORBIDDEN!
                                return self.retryAuth
                                        ? attemptAuth(done, fail, count + 1)
                                        : done(false)                                            
                            } 
                                                        
                            if(err) return fail(err);
                                                        
                            self._token = res.body.token;                                                        
                            done(true);                            
                        });
            })
            .catch(fail);
    } 
        
    return self._current = 
        new Promise(function(done, fail) {            
                if(self._token) return done(true);
                                    
                attemptAuth(done, fail);
            })
            .then(clearInProgress, clearInProgress);
}


ApiRequest.prototype.getKeys = function() {
    //...
}


module.exports = ApiRequest;
