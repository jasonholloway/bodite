var latinize = require('latinize');


//keeping my options open with this one:
//stateless at mo, but what about some nice indexing in the future?
//hence as object. Though any indexing would have to be done more centrally...

//so this should just be a static function, with a nameExists function as input


var MachineNameProvider = function(fnNames) {
    this._fnNames = fnNames;
}


MachineNameProvider.prototype.nameExists = function(inp) {
    return this._fnNames().indexOf(inp) > -1;    
}


MachineNameProvider.prototype.get = function(s) {    
    s = s.toLowerCase();   
    s = latinize(s);
    s = s.replace(/ /g, '-');    
    s = s.replace(/[^a-z-]/g, '');
    
    
    var n = 1;
    var basic = s;
    
    while(this.nameExists(s)) {
        s = basic + '-' + (++n);        
    }
    
    return s;    
}


module.exports = MachineNameProvider;