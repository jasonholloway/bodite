require('../BoditeAdmin');
var urlJoin = require('url-join');
    
var app = angular.module('BoditeAdmin');

app.service('categoryRepo', function ($http, DB_LOCATION) {

    var catTree;
    var catMap;


    function buildCrawler (fn) {
        return function crawl(nodes, path) {
                    if (!path) path = [];

                    nodes.forEach(function(n) {
                        fn(n, path);

                        if (n.children) {
                            path.push(n);
                            crawl(n.children, path);
                            path.pop();
                        }                    
                    });
                }
    }


    this.getCategoryMap = function () {
        if (catMap) return Promise.resolve(catMap);

        return this.loadCategoryTree()
        .then(function (tree) {
            catMap = new Map();

            buildCrawler(function (n, p) {
                catMap.set(n._id, n);
            })(tree.children);

            return catMap;
        });
    }


    this.loadCategoryTree = function () {
        if (catTree) return Promise.resolve(catTree);

        return $http.get(urlJoin(DB_LOCATION, 'categorytree'))
                    .then(function (resp) {
                        if (resp.data) {
                            buildCrawler(function (n, path) {
                                n.$$path = path.slice();
                                n.$$pathString = $.map(n.$$path, function (x) { return '/' + x.name.LV }).join('') + '/' + n.name.LV;
                            })(resp.data.children);

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
                        
                        map.forEach(function(v) {                    
                            r.push(v);                    
                        });

                        return r;
                    });
    }
})
