(function () {
    require('angular');
    var app = angular.module('bb');


    app.config(function($provide) {       
       $provide.service('imageRepo', imageRepo);        
       $provide.constant('DB_LOCATION', 'http://localhost:5984/bb');      
       $provide.constant('CATEGORY_TREE_URL', 'http://localhost:5984/bb/categorytree');                
    });


    function imageRepo() {        
        return {
            getUrl: function (key) {                
                return 'img/dummy-product.png';
            }
        }        
    }

})();
