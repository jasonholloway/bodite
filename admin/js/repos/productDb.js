require('../BoditeAdmin');
var urlJoin = require('url-join');        

angular.module('BoditeAdmin')
.service('productDb', ($http, DB_ALL_PRODUCTS_URL, DB_BASE_URL) => {        
    return {
        getAll() {
            return $http.get(DB_ALL_PRODUCTS_URL)
                        .then(res => {                        
                            return res.data.rows.map(r => r.value);                        
                        })
        },
            
        save(prod) {        
            var url = urlJoin(DB_BASE_URL, encodeURIComponent(prod._id));
                    
            return $http.put(url, prod)
                        .then(res => {
                        prod._rev = res.data.rev;
                        return prod; 
                        });
        }
    }    
});