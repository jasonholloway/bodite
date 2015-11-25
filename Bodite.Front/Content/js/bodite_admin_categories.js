/// <reference path="bodite_admin.js" />
/// <reference path="angular.js" />
/// <reference path="jquery.js" />
/// <reference path="fuse.js" />
/// <reference path="croppic.js" />
/// <reference path="pica.js" />
/// <reference path="math.uuid.js" />
/// <reference path="aws-sdk.js" />
/// <reference path="smap-shim.js" />
/// <reference path="jquery.fancytree-all.js" />


adminApp.service('categoryRepo', ['$http', function ($http) {
        

    this.loadCategoryTree = function () {
        return {
            roots: [{
                id: 'abc',
                name: {
                    LV: 'Jason',
                    RU: 'Jasonski'
                },
                children: [
                ]
            },
                    {
                        id: 'uyvyy',
                        name: {
                            LV: 'Vitnija',
                            RU: 'Vitters'
                        },
                        children: [
                            {
                                id: 'ppppp',
                                name: {
                                    LV: 'Wendy',
                                    RU: 'Vladimir'
                                },
                                children: []
                            }
                        ]
                    }
            ]
        }
    }





}])





adminApp.controller('categoryController', ['$scope', 'categoryRepo', function ($scope, repo) {

    var pristineTree = repo.loadCategoryTree();
    this.workingTree = angular.copy(pristineTree);
    
    this.isPristine = true;

    this.current = {};

    this.revert = function () {
        this.workingTree = angular.copy(pristineTree);
        this.isPristine = true;
        this.current = {};
    }

    this.save = function () {
        alert('Save to repo!!!');
    }

    //GRIMLY INEFFICIENT! 
    $scope.$watch(
        function() {
            return this.workingTree;
            }.bind(this),
        function() {
            $scope.$applyAsync(function() {            
                this.isPristine = angular.equals(this.workingTree, pristineTree, true);
            }.bind(this))
        }.bind(this),
        true);
}])




adminApp.directive('categoryTree', ['$compile', function ($compile) {
    
    var mapNodes = function(nodes, fnMap) {        
        return $.map(nodes, function(n, i) { 
            var mapped = fnMap(n);
            
            if(n.children) {
                mapped.children = mapNodes(n.children, fnMap);
            }
            
            return mapped;
        })
    }
    

    //and should be some mechanism to posit a selected node on the controller...


        
    return {
        restrict: 'E',
        scope: true,
        link: function (scope, elem) {

            var projectViewRoots = function(catRoots) {
                return mapNodes(catRoots,
                            function(n) {
                                return {
                                    title: n.name.LV,
                                    catNode: n
                                }
                            });
            }



            var viewRoots = projectViewRoots(scope.categories.workingTree.roots);
            

            var fixCatNodes = function (treeNodes, catNodes) {
                //clear catNodes array and fill with catNode references of treeNodes array
                Array.prototype.splice.apply(catNodes, [0, catNodes.length]
                                                        .concat(treeNodes
                                                                    ? $.map(treeNodes, function (tn) { return tn.data.catNode; })
                                                                    : []));                
                if(treeNodes) {                                                                 
                    for(var tn of treeNodes) {
                        if (!tn.data.catNode.children) {
                            tn.data.catNode.children = [];
                        }

                        fixCatNodes(tn.children, tn.data.catNode.children);
                    }
                }
            }
            


            var renderExtras = function (node) {
                if (!$(node.li).find('.extras').length) {                    
                    var div = $('<div class="extras hidden" />');
                    
                    $('<input type="button" value="add sibling" />')
                            .click(function () {
                                node.addNode({
                                    title: 'New Node',
                                    catNode: {
                                        name: { LV: 'New Node' }
                                    }
                                }, 'after');

                                fixCatNodes(node.tree.rootNode.children, scope.categories.workingTree.roots);
                            })
                            .appendTo(div);
                            
                    $('<input type="button" value="delete" />')
                            .click(function() {
                                if(!confirm('Are you sure you want to delete category ' + node.title + ' and all of its children?')) {
                                    return;
                                }

                                node.remove();
                                fixCatNodes(node.tree.rootNode.children, scope.categories.workingTree.roots);
                            })
                            .appendTo(div);


                    div.appendTo(node.li);
                    
                    node.extrasDiv = div;
                }
            }


            var tree;

            var saveButton = $('<input type="button" value="Save" />')
                                .click(function() { 
                                    scope.categories.save(); 
                                    scope.$apply();
                                    })
                                .appendTo(elem);
            
            var revertButton = $('<input type="button" value="Revert" />')
                                .click(function() { 
                                    scope.categories.revert(); 
                                    scope.$apply();
                                    
                                    tree.fancytree('getTree').reload(projectViewRoots(scope.categories.workingTree.roots));
                                    })
                                .appendTo(elem);

            scope.$watch(
                    function() {
                        return scope.categories.isPristine;
                        }, 
                    function() {
                        if(scope.categories.isPristine) {
                            elem.removeClass('isDirty');
                            saveButton.addClass('hidden');
                            revertButton.addClass('hidden');
                       } 
                       else {
                            elem.addClass('isDirty');
                            saveButton.removeClass('hidden');
                            revertButton.removeClass('hidden');
                       }
                    });


            tree = elem.fancytree({
                source: viewRoots,
                extensions: ["dnd"],
                                
                select: function(event, data) {
                    scope.$applyAsync(function() { 
                        scope.categories.current = data.node.data.catNode;
                    });

                    if(data.node.selected) {
                        $(data.node.extrasDiv).removeClass('hidden');
                    }
                    else {
                        $(data.node.extrasDiv).addClass('hidden');
                    }
                },

                click: function(event, data) {
                    data.tree.getSelectedNodes().forEach(function(n) { n.toggleSelected(); });                    
                    data.node.toggleSelected();
                },

                keydown: function(event, data) {
                    if( event.which === 32 ) {
                        data.node.toggleSelected();
                        return false;
                    }
                },

                createNode: function(event, data) {
                    //add a listener - SHOULD STORE THIS AND REMOVE ON DELETE!
                    data.node.deregWatch = scope.$watch(
                                                function() { 
                                                    return data.node.data.catNode.name.LV; 
                                                    },
                                                function(vNew) { 
                                                    data.node.title = vNew; 
                                                    data.node.renderTitle();
                                                });
                    renderExtras(data.node);
                },

                removeNode: function(event, data) {
                    if(data.node.deregWatch) {
                        data.node.deregWatch();
                        delete data.node.deregWatch;
                    }  
                },
        

                dnd: {
                    // Available options with their default:
                    //autoExpandMS: 1000,   // Expand nodes after n milliseconds of hovering
                    //draggable: null,      // Additional options passed to jQuery UI draggable
                    //droppable: null,      // Additional options passed to jQuery UI droppable
                    //focusOnClick: false,  // Focus, although draggable cancels mousedown event (#270)
                    //preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                    //preventVoidMoves: true,      // Prevent dropping nodes 'before self', etc.
                    //smartRevert: true,    // set draggable.revert = true if drop was rejected

                    //// Events that make tree nodes draggable
                    //dragStart: null,      // Callback(sourceNode, data), return true to enable dnd
                    //dragStop: null,       // Callback(sourceNode, data)
                    //initHelper: null,     // Callback(sourceNode, data)
                    //updateHelper: null,   // Callback(sourceNode, data)

                    //// Events that make tree nodes accept draggables
                    //dragEnter: null,      // Callback(targetNode, data)
                    //dragOver: null,       // Callback(targetNode, data)
                    //dragDrop: null,       // Callback(targetNode, data)
                    //dragLeave: null       // Callback(targetNode, data)

                    dragStart: function (node, data) {
                        // This function MUST be defined to enable dragging for the tree.
                        // Return false to cancel dragging of node.
                        //    if( data.originalEvent.shiftKey ) ...          
                        //    if( node.isFolder() ) { return false; }
                        return true;
                    },
                    dragEnter: function (node, data) {
                        /* data.otherNode may be null for non-fancytree droppables.
                         * Return false to disallow dropping on node. In this case
                         * dragOver and dragLeave are not called.
                         * Return 'over', 'before, or 'after' to force a hitMode.
                         * Return ['before', 'after'] to restrict available hitModes.
                         * Any other return value will calc the hitMode from the cursor position.
                         */
                        // Prevent dropping a parent below another parent (only sort
                        // nodes under the same parent):
                        //    if(node.parent !== data.otherNode.parent){
                        //      return false;
                        //    }
                        // Don't allow dropping *over* a node (would create a child). Just
                        // allow changing the order:
                        //    return ["before", "after"];
                        // Accept everything:
                        return true;
                    },
                    dragOver: function (node, data) {
                    },
                    dragLeave: function (node, data) {
                    },
                    dragStop: function (node, data) {
                        renderExtras(node);
                    },
                    dragDrop: function (node, data) {                        
                        data.otherNode.moveTo(node, data.hitMode);
                        fixCatNodes(data.tree.rootNode.children, scope.categories.workingTree.roots);   
                    }
                },
            });

        }
    }
}])







