(function() {
    
    var urlJoin = require('url-join');
    	
	var app = angular.module('BoditeAdmin');
	
    app.service('categoryRepo', function ($http, DB_LOCATION) {

        var catTree;
        var catMap;


        function buildCrawler (fn) {
            var c = function (nodes, path) {
                if (!path) path = [];

                for(var n of nodes) {
                    fn(n, path);

                    if (n.children) {
                        path.push(n);
                        c(n.children, path);
                        path.pop();
                    }
                }
            }
            
            return c;
        }


        this.getCategoryMap = function () {
            if (catMap) return new Promise(function (success) { success(catMap); });

            return this.loadCategoryTree()
            .then(function (tree) {
                catMap = new Map();

                buildCrawler(function (n, p) {
                    catMap.set(n._id, n);
                })(tree.roots);

                return catMap;
            });
        }


        this.loadCategoryTree = function () {
            if (catTree) return new Promise(function (success) { return success(catTree); });

            return $http.get(urlJoin(DB_LOCATION, 'categorytree'))
            .then(function (resp) {
                if (resp.data) {
                    buildCrawler(function (n, path) {
                        n.$$path = path.slice();
                        n.$$pathString = $.map(n.$$path, function (x) { return '/' + x.name.LV }).join('') + '/' + n.name.LV;
                    })(resp.data.roots);

                    return catTree = resp.data;
                }

                throw Error('Response without data!');
            });
        }

        this.saveCategoryTree = function (tree) {
            return $http.put(urlJoin(DB_LOCATION, 'categorytree'), tree)
            .then(function (r) {
                catMap = undefined;
                tree._rev = r.data.rev;
                return catTree = tree;
            })
        }


        this.getCategoryByKey = function (key) {
            return this.getCategoryMap()
            .then(function (map) { return map.get(key); })
        }

        this.getCategories = function () {
            return this.getCategoryMap()
            .then(function (map) {
                var r = [];

                for(var v of map.values()) {
                    r.push(v);
                }

                return r;
            });
        }
    })
	
})();