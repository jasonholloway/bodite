/// <reference path="angular.js" />
/// <reference path="jquery.js" />
/// <reference path="fuse.js" />
/// <reference path="croppic.js" />
/// <reference path="math.uuid.js" />

var adminApp = angular.module('BoditeAdmin', []);



adminApp.service('productRepo', ['$http', function($http) {
    var items = [];
    var fuse;
    
    $http.get('http://localhost:5984/bbapp/_design/bbapp/_view/all_products')
    .then(function(resp) {
        items = $.map(resp.data.rows, function(r) {
            return r.value;            
        }
        );
        fuse = new Fuse(items,{
            keys: ['name.LV', 'name.RU'],
            threshold: 0.45
        });
    }
    );
    
    
    return {
        items: items,
                
        filter: function(term) {
            return fuse ? fuse.search(term) : [];
        },
        
        create: function() {
            var prod = {
                _id: 'product/' + Math.uuidFast(),
                name: {
                    LV: '',
                    RU: ''
                },
                images: []
            }
            
            items.push(prod);
            
            return prod;
        },


        save: function (prod) {            
            return new Promise(function (fulfilled, rejected) {
                $http.put('http://localhost:5984/bbapp/' + encodeURIComponent(prod._id), prod)
                .then(function (r) {
                    prod._rev = r.data.rev;

                    //update product array here!!!
                    //...                    

                    fulfilled(prod);
                }, function() {
                    rejected();
                })                
            })            
        }
    }
}
])



adminApp.directive('productSearchbox', function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<input type="search" placeholder="Meklēt..." >',
        link: function(scope, elem) {
            var lastVal;
            
            $(elem).on("input", function(e) {
                var val = e.target.value;
                
                if (lastVal != val) {
                    lastVal = val;
                    
                    if (scope.products) {
                        scope.$applyAsync(function() {
                            scope.products.filter(val);
                        }
                        )
                    }
                }
                ;
            });
        }
    }
})



adminApp.service('croppic', function() {
    return {
        loadAndCrop: function(sourcePath) {
                       
            return new Promise(function (fulfilled, rejected) {
                var croppic = new Croppic({
                    //processInline: true,
                    modal: true,
                    cropUrl: 'images/cropandstore',
                    rotateControls: false,

                    onAfterImgCrop: function (resp) {
                        croppic.destroy();
                        fulfilled(resp.url);
                    }
                });
                
                croppic.objW = 400;
                croppic.objH = 400;
                
                croppic.load();                
            });          
        }
    }
})



adminApp.directive('imageSet', ['croppic', function(croppic) 
{
    var elem;

    return {
        restrict: 'E',
        scope: {
            images: '='
        },
        bindToController: true,

        controller: function($scope) 
        {
            this.add = function () {

                //need to fire up file-picker
                //...

                croppic.loadAndCrop('')
                .then(function (url) {
                    if(!this.images) {
                        this.images = [];
                    }

                    this.images.push({ url: url });
                    $scope.$apply();
                }.bind(this))

            }.bind(this);
        },
        controllerAs: '$ctrl',

        template: [
            '<image-set-record ng-repeat="image in $ctrl.images" image="image" images="$ctrl.images"></image-set-record>' +
            '<input type="button" value="Add..." ng-click="$ctrl.add()" />'
        ].join()
    }
}])


adminApp.directive('imageSetRecord', function() 
{
    return {
        restrict: 'E',
        scope: {
            image: '=',
            images: '='
        },
        bindToController: true,       

        controller: function() {
            this.remove = function() {
                this.images = this.images.filter(function(i) { 
                                                    return i !== this.image
                                                 }.bind(this));
            }
        },
        controllerAs: '$c',

        template: [
            '<input type="button" value="Remove" ng-click="$c.remove()" />' +
            '<img src="{{$c.image.url}}" />' 
        ].join()
    }    

})



adminApp.directive('productImage', function() {
    
    var loadCroppic = function(div, bt) {
        
        var onCroppedCallbacks = [];
        
        var options = {
            customUploadButtonId: bt.attr('id'),
            processInline: true,
            modal: true,
            cropUrl: 'images/cropandstore',
            rotateControls: false,
            
            onAfterImgCrop: function(resp) {
                onCroppedCallbacks.forEach(function(fn) {
                    fn(resp.url)
                }
                )
            }
        }
        
        var croppic = new Croppic(div.attr('id'),options);
        
        croppic.objW = 400;
        croppic.objH = 400;
        
        return {
            onCropped: function(fn) {
                onCroppedCallbacks.push(fn)
            }
        }
    }
    
    
    return {
        restrict: 'E',
        scope: true,
        link: function(scope, elem) {
            var uuid = Math.uuidFast();
            
            var imgDiv = $('<div id=\'productImage' + uuid + '\' />')
            .addClass('productImage')
            .appendTo(elem);
            
            var loadButton = $('<input type=\'button\' value=\'Add picture...\' id=\'imageLoadButton' + uuid + '\' />')
            .addClass('loadButton')
            .appendTo(elem);
            
            var prod = scope.product;
            
            if (prod.images && prod.images.length > 0) {
                imgDiv.css('background-image', 'url(' + prod.images[0].url + ')');
            }
            
            loadCroppic(imgDiv, loadButton)
            .onCropped(function(url) {
                scope.$applyAsync(function() {
                    if (!prod.images) {
                        prod.images = [];
                    }
                    
                    prod.images.push({
                        url: url,
                        size: 'large'
                    });
                    $(imgDiv).css('background-image', 'url(' + url + ')');
                })
            })
        }
    }
}
)


adminApp.directive('products', function () {
    return {
        restrict: 'E',
        scope: true,
        controller: ['productRepo', function (repo) {
            this.filteredItems = [];

            this.create = function () {
                this.filter('');
                this.filteredItems = [repo.create()];
            }

            this.filter = function (term) {
                this.filteredItems = repo.filter(term);
            }
        }],
        controllerAs: 'products'
    }
})



adminApp.directive('product', function () {
        
    return {
        restrict: 'E',        
        scope: true,
        bindToController: true,
        controllerAs: 'product',
        controller: ['$http', '$scope', '$element', 'productRepo', function ($http, $scope, elem, repo) {
            var vm = this;

            vm.pristine = {};
            vm.working = {};
            
            var refresh = function () {
                var isPristine = angular.equals(vm.working, vm.pristine);
                
                if (isPristine) {
                    elem.removeClass('dirty');
                }
                else {
                    elem.addClass('dirty');
                }
            }


            vm.init = function (product) {
                vm.pristine = product;
                vm.working = angular.copy(vm.pristine);
                
                $scope.$watch(
                    function () { 
                        return vm.working; 
                    },
                    function () { 
                        refresh() 
                    },
                    true);
            }

            vm.save = function () {                
                if (angular.equals(vm.working, vm.pristine)) return;

                repo.save(vm.working)
                .then(function(p) {
                    vm.pristine = p;
                    vm.working = angular.copy(vm.pristine);
                    $scope.$apply();
                    refresh();
                });
            }
            
            vm.revert = function() {
                vm.working = angular.copy(vm.pristine);
            }

        }]
    }
})






//adminApp.controller('ProductController', ['$scope', '$http', 'productRepo', function($scope, $http, repo) {
    
    
//    $scope.save = function() {
//        var prod = $scope.product;
        
//        $http.put('http://localhost:5984/bbapp/' + encodeURIComponent(prod._id), prod)
//        .then(function(r) {
//            prod._rev = r.data.rev;
            
//            $scope.$applyAsync(function() {
//                repo.dirtyItems = repo.dirtyItems.filter(function(x) {
//                    x._id != prod._id
//                }
//                );
//                //   .splice().delete(prod._id);
//            }
//            );
            
//            //trigger style changes and what-not
//            //...
//        }
//        , 
//        function() {
//            window.alert('ERROR UPDATING PRODUCT!!!');
//        }
//        );
//    }



//}
//]);
