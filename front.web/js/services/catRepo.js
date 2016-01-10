(function() {
    require('angular');
        
    angular.module('bb')
    .service('catRepo', function($http, CATEGORY_TREE_URL) {
        
        var catTree = null;
        
        this.getCatTree = function() {
            if(catTree) return Promise.resolve(catTree);
            
            return $http.get(CATEGORY_TREE_URL)
                        .then(function(result) {                            
                            return catTree = result.data;
                        });
        };        
            
    });
    
})();