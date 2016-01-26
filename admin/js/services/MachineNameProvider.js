var latinize = require('latinize');



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