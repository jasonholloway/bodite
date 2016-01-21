var Promise = require('promise');
var request = require('superagent');
var urlJoin = require('url-join');



function ApiRequest(baseUrl) {   
    this.baseUrl = baseUrl || '';
    this.token = undefined;    
    this.inProgress = undefined;
}


ApiRequest.prototype.authorize = function(getCreds) {
    var self = this;
    
    if(self.inProgress) return self.inProgress;
    
    function clearInProgress(x) {
        self.inProgress = undefined;
        return x;
    }
    
    return self.inProgress = 
        new Promise(function(done, fail) {
                if(self.token) return done(true);
            
                getCreds()
                    .then(function(creds) {                
                        if(!creds) return done(false);
                        
                        var loginUrl = urlJoin(self.baseUrl, 'login');
                                        
                        request.post(loginUrl)
                                .send(creds)
                                .set('Accept', 'application/json')
                                .set('Content-Type', 'application/json')
                                .end(function(err, res) {                            
                                    if(res.status === 401) return done(false);                            
                                    if(err) return fail(err);
                                    
                                    self.token = res.body.token;                                                        
                                    done(true);                            
                                });                       
                    })
                    .catch(fail);        
            })
            .then(clearInProgress, clearInProgress);
}


ApiRequest.prototype.getKeys = function() {
    //...
}


module.exports = ApiRequest;
