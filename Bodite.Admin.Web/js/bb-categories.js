(function () {

    var app = angular.module('BoditeAdmin');


    app.service('categoryRepo', ['$http', function ($http) {

        //should cache categories...
        //only reset on successful save

        var catTree;
        var catMap;


        var buildCrawler = function (fn) {
            var crawler;

            crawler = function (nodes, path) {
                if (!path) path = [];

                for(var n of nodes) {
                    fn(n, path);

                    if (n.children) {
                        path.push(n);
                        crawler(n.children, path);
                        path.pop();
                    }
                }
            }

            return crawler;
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
            if (catTree) return new Promise(function (success) { return catTree; });

            return $http.get('http://localhost:5984/bbapp/categorytree')
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
            return $http.put('http://localhost:5984/bbapp/categorytree', tree)
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
    }])





    app.controller('categoryTreeController', ['$scope', 'categoryRepo', function ($scope, repo) {

        var pristineTree = { roots: [] }
        this.workingTree = { roots: [] };
        this.isPristine = true;

        this.revert = function () {
            this.workingTree = angular.copy(pristineTree);
            this.isPristine = true;
        }

        this.save = function () {
            repo.saveCategoryTree(this.workingTree)
            .then(function () {
                pristineTree = angular.copy(this.workingTree);
                this.isPristine = true;
            }.bind(this));
        }

        this.createCategory = function () {
            return {
                _id: 'category/' + Math.uuidFast(),
                name: {
                    LV: 'New Category',
                    RU: undefined
                },
                children: []
            }
        }

        //GRIMLY INEFFICIENT!
        $scope.$watch(
            function () {
                return this.workingTree;
            }.bind(this),
            function () {
                $scope.$applyAsync(function () {
                    this.isPristine = angular.equals(this.workingTree, pristineTree, true);
                }.bind(this))
            }.bind(this),
            true);

        //how about, categories stored and served normalised
        //but then a special serverside view would aggregate them all into a tree
        //...

        repo.loadCategoryTree()
        .then(function (tree) {
            pristineTree = tree;
            this.workingTree = angular.copy(pristineTree);
            this.isPristine = true;
        }.bind(this))


    }])



    app.controller('categoryController', ['$scope', function ($scope) {
        this.category = $scope.$parent.category;
    }])




    //
    // app.directive('categoryTree', ['$compile', function ($compile) {
    //
    //     var mapNodes = function (nodes, fnMap) {
    //         return $.map(nodes, function (n, i) {
    //             var mapped = fnMap(n);
    //
    //             if (n.children) {
    //                 mapped.children = mapNodes(n.children, fnMap);
    //             }
    //
    //             return mapped;
    //         })
    //     }
    //
    //
    //     //and should be some mechanism to posit a selected node on the controller...
    //
    //
    //
    //     return {
    //         restrict: 'E',
    //         scope: true,
    //         link: function (scope, elem) {
    //
    //             var fixCatNodes = function (treeNodes, catNodes) {
    //                 //clear catNodes array and fill with catNode references of treeNodes array
    //                 Array.prototype.splice.apply(catNodes, [0, catNodes.length]
    //                                                         .concat(treeNodes
    //                                                                     ? $.map(treeNodes, function (tn) { return tn.data; })
    //                                                                     : []));
    //                 if (treeNodes) {
    //                     for(var tn of treeNodes) {
    //                         if (!tn.data.children) {
    //                             tn.data.children = [];
    //                         }
    //
    //                         fixCatNodes(tn.children, tn.data.children);
    //                     }
    //                 }
    //             }
    //
    //
    //
    //
    //             var forEachNode = function (fn, nodes) {
    //                 if (!nodes) nodes = tree.rootNode.children;
    //
    //                 nodes.forEach(function (n) {
    //                     fn(n);
    //
    //                     if (n.children) {
    //                         forEachNode(fn, n.children);
    //                     }
    //                 })
    //             }
    //
    //
    //
    //
    //             var renderExtrasRight = function (node) {
    //
    //                 $(node.divBefore)
    //                     .addClass('extrasRight')
    //                     .append('<input ng-model="category.name.LV">')
    //                     .append('<input ng-model="category.name.RU">')
    //                     .append('<span class="key">{{category._id}}</span>')
    //                     .append(
    //                         $('<input type="button" value="delete" />')
    //                             .click(function () {
    //                                 if (!confirm('Are you sure you want to delete category ' + node.data.name.LV + ' and all of its children?')) {
    //                                     return;
    //                                 }
    //
    //                                 node.remove();
    //                                 fixCatNodes(node.tree.rootNode.children, scope.categories.workingTree.roots);
    //                                 scope.$apply();
    //                             })
    //                             )
    //             }
    //
    //
    //             var renderExtrasBelow = function (node) {
    //                 $(node.divAfter).addClass('extrasBelow');
    //
    //                 $('<input type="button" value="add" />')
    //                     .click(function () {
    //                         var n = node.addNode(scope.categories.createCategory(), 'over');
    //
    //                         node.setExpanded(true);
    //
    //                         fixCatNodes(node.tree.rootNode.children, scope.categories.workingTree.roots);
    //                     })
    //                     .appendTo(node.divAfter);
    //             }
    //
    //             var tree;
    //
    //
    //
    //
    //             var saveButton = $('<input type="button" value="Save" />')
    //                                 .click(function () {
    //                                     scope.categories.save();
    //                                     scope.$apply();
    //                                 })
    //                                 .appendTo(elem);
    //
    //             var revertButton = $('<input type="button" value="Revert" />')
    //                                 .click(function () {
    //                                     scope.categories.revert();
    //                                     scope.$apply();
    //                                 })
    //                                 .appendTo(elem);
    //
    //
    //             scope.$watch(
    //                     function () {
    //                         return scope.categories.workingTree;
    //                     },
    //                     function (v) {
    //                         tree.fancytree('getTree').reload(v.roots);
    //                     })
    //
    //             scope.$watch(
    //                     function () {
    //                         return scope.categories.isPristine;
    //                     },
    //                     function (v) {
    //                         if (v) {
    //                             elem.removeClass('isDirty');
    //                             saveButton.addClass('hidden');
    //                             revertButton.addClass('hidden');
    //                         }
    //                         else {
    //                             elem.addClass('isDirty');
    //                             saveButton.removeClass('hidden');
    //                             revertButton.removeClass('hidden');
    //                         }
    //                     });
    //
    //
    //             tree = elem.fancytree({
    //                 source: scope.categories.workingTree.roots,
    //                 extensions: ["dnd", "bodite_fancytree"],
    //                 keyboard: false,
    //
    //                 //must be better callback than select...
    //
    //                 select: function (event, data) {
    //                     if (data.node.selected) {
    //                         $(data.node.divBefore).removeClass('hidden');
    //
    //                         for (var n = data.node; n && n.title !== 'root'; n = n.parent) {
    //                             $(n.divAfter).removeClass('hidden');
    //                         }
    //
    //                     }
    //                     else {
    //                         $(data.node.divBefore).addClass('hidden');
    //
    //                         for (var n = data.node; n && n.title !== 'root'; n = n.parent) {
    //                             $(n.divAfter).addClass('hidden');
    //                         }
    //                     }
    //                 },
    //
    //                 click: function (event, data) {
    //                     data.tree.getSelectedNodes().forEach(function (n) { n.setSelected(false); });
    //
    //                     data.node.setSelected(true);
    //                 },
    //
    //                 keydown: function (event, data) {
    //                     if (event.which === 32) {
    //                         data.node.toggleSelected();
    //                         return false;
    //                     }
    //                 },
    //
    //                 createNode: function (event, data) {
    //
    //                     data.node.setTitle('{{category.name.LV}}');
    //
    //                     renderExtrasRight(data.node);
    //                     renderExtrasBelow(data.node);
    //
    //                     data.node.scope = scope.$new();
    //                     data.node.scope.category = data.node.data;
    //
    //                     var linker = $compile(data.node.li);
    //                     linker(data.node.scope);
    //
    //                     data.node.setSelected(true);
    //                     data.node.setSelected(false);
    //                 },
    //
    //                 init: function (event, data) {
    //                     var nRoot = data.tree.rootNode;
    //
    //                     if (data.tree.divAfter) {
    //                         data.tree.divAfter.empty();
    //                     }
    //                     else {
    //                         data.tree.divAfter = $('<div>').insertAfter(nRoot.ul);
    //                     }
    //
    //                     nRoot.divAfter = data.tree.divAfter;
    //
    //                     renderExtrasBelow(nRoot);
    //
    //                     var deselect = function (nodes) {
    //                         for(var n of nodes) {
    //                             $(n.divAfter).addClass('hidden');
    //
    //                             if (n.divBefore) {
    //                                 $(n.divBefore).addClass('hidden');
    //                             }
    //
    //                             if (n.children) deselect(n.children);
    //                         }
    //                     }
    //
    //                     deselect(nRoot.children);
    //                 },
    //
    //                 removeNode: function (event, data) {
    //                     if (data.node.scope) {
    //                         data.node.scope.$destroy();
    //                     }
    //                 },
    //
    //                 dnd: {
    //                     // Available options with their default:
    //                     //autoExpandMS: 1000,   // Expand nodes after n milliseconds of hovering
    //                     //draggable: null,      // Additional options passed to jQuery UI draggable
    //                     //droppable: null,      // Additional options passed to jQuery UI droppable
    //                     //focusOnClick: false,  // Focus, although draggable cancels mousedown event (#270)
    //                     //preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
    //                     //preventVoidMoves: true,      // Prevent dropping nodes 'before self', etc.
    //                     //smartRevert: true,    // set draggable.revert = true if drop was rejected
    //
    //                     //// Events that make tree nodes draggable
    //                     //dragStart: null,      // Callback(sourceNode, data), return true to enable dnd
    //                     //dragStop: null,       // Callback(sourceNode, data)
    //                     //initHelper: null,     // Callback(sourceNode, data)
    //                     //updateHelper: null,   // Callback(sourceNode, data)
    //
    //                     //// Events that make tree nodes accept draggables
    //                     //dragEnter: null,      // Callback(targetNode, data)
    //                     //dragOver: null,       // Callback(targetNode, data)
    //                     //dragDrop: null,       // Callback(targetNode, data)
    //                     //dragLeave: null       // Callback(targetNode, data)
    //
    //                     dragStart: function (node, data) {
    //                         // This function MUST be defined to enable dragging for the tree.
    //                         // Return false to cancel dragging of node.
    //                         //    if( data.originalEvent.shiftKey ) ...
    //                         //    if( node.isFolder() ) { return false; }
    //                         return true;
    //                     },
    //                     dragEnter: function (node, data) {
    //                         /* data.otherNode may be null for non-fancytree droppables.
    //                          * Return false to disallow dropping on node. In this case
    //                          * dragOver and dragLeave are not called.
    //                          * Return 'over', 'before, or 'after' to force a hitMode.
    //                          * Return ['before', 'after'] to restrict available hitModes.
    //                          * Any other return value will calc the hitMode from the cursor position.
    //                          */
    //                         // Prevent dropping a parent below another parent (only sort
    //                         // nodes under the same parent):
    //                         //    if(node.parent !== data.otherNode.parent){
    //                         //      return false;
    //                         //    }
    //                         // Don't allow dropping *over* a node (would create a child). Just
    //                         // allow changing the order:
    //                         //    return ["before", "after"];
    //                         // Accept everything:
    //                         return !!data.otherNode;
    //                     },
    //                     dragOver: function (node, data) {
    //                     },
    //                     dragLeave: function (node, data) {
    //                     },
    //                     dragStop: function (node, data) {
    //                         // renderExtras(node);
    //                     },
    //                     dragDrop: function (node, data) {
    //                         var n = data.otherNode;
    //
    //                         n.moveTo(node, data.hitMode);
    //                         fixCatNodes(data.tree.rootNode.children, scope.categories.workingTree.roots);
    //                         scope.$apply();
    //
    //                         node.setExpanded(true);
    //
    //                         n.setSelected(false);
    //                         n.setSelected(true);
    //                     }
    //                 },
    //             });
    //
    //         }
    //     }
    // }])


})();
