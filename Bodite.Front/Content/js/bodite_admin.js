/// <reference path="angular.js" />
/// <reference path="jquery.js" />
/// <reference path="fuse.js" />
/// <reference path="croppic.js" />
/// <reference path="pica.js" />
/// <reference path="math.uuid.js" />
/// <reference path="aws-sdk.js" />
/// <reference path="smap-shim.js" />

var adminApp = angular.module('BoditeAdmin', []);



adminApp.service('aws', [function () {
    AWS.config.update({
        accessKeyId: 'AKIAJBNPCUXVCW3HFRHA',
        secretAccessKey: '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'
    });

    AWS.config.region = 'eu-central-1';

    return AWS;
}])




adminApp.service('imageRepo', ['aws', function (aws) {
    
    var createKey = function() {
        return 'prodimg/' + Math.uuidFast();
    }

    return {
        getUrl: function(key) {
            return 'https://s3.eu-central-1.amazonaws.com/bodite/' + key;
        },
                
        save: function(blob) {
            return new Promise(function(success, failed) {                                
                var key = createKey();

                var bucket = new AWS.S3({params: {Bucket: 'bodite'}});

                var params = {
                    Key: key,
                    Body: blob,
                    ACL: 'public-read',
                    ContentType: blob.type,
                    //ContentMD5: ''
                };

                bucket.upload(params, function (err, data) {
                    if(err) failed(err);
                    else success(key);
                });          
            })
        }
    }
}])


adminApp.service('productRepo', ['$http', function($http) {
    var items = new Map();
    var fuse;
    
    $http.get('http://localhost:5984/bbapp/_design/bbapp/_view/all_products')
    .then(function (resp) {        
        for(var row of resp.data.rows) {
            items.set(row.id, row.value);
        }
        
        fuse = new Fuse({
            keys: ['name.LV', 'name.RU'],
            threshold: 0.45
        });
    }
    );
    
    
    return {
        items: items,
                
        filter: function(term) {
            return fuse ? fuse.search(items, term) : [];
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
            
            items.set(prod._id, prod);
            
            return prod;
        },


        save: function (prod) {            
            return new Promise(function (fulfilled, rejected) {
                $http.put('http://localhost:5984/bbapp/' + encodeURIComponent(prod._id), prod)
                .then(function (r) {
                    prod._rev = r.data.rev;

                    items.set(prod._id, prod);

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



adminApp.service('croppic', ['$http', 'imageRepo', function($http, imageRepo) {
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
                
                croppic.getLocalFile()
                .then(function(blob) {
                    croppic.open(blob)
                    .then(function(spec) {
                        croppic.destroy();

                        var canvSource = document.createElement('canvas');
                        canvSource.width = spec.image.width;
                        canvSource.height = spec.image.height;
                        
                        var canvResized = document.createElement('canvas');
                        canvResized.width = spec.resizeWidth;
                        canvResized.height = spec.resizeHeight;
                        
                        var ctxSource = canvSource.getContext('2d');
                        ctxSource.drawImage(spec.image, 0, 0);

                        pica.resizeCanvas(
                            canvSource,
                            canvResized,
                            {
                                unsharpAmount: 0, 
                                unsharpRadius: 0.6, 
                                unsharpThreshop: 2 
                            },
                            function (err) {
                                if (err) { rejected() }
                                
                                var canvCropped = canvSource;
                                canvCropped.width = spec.cropWidth;
                                canvCropped.height = spec.cropHeight;

                                var ctxCropped = canvCropped.getContext('2d');
                                ctxCropped.drawImage(canvResized, spec.cropX, spec.cropY, spec.cropWidth, spec.cropHeight, 0, 0, spec.cropWidth, spec.cropHeight);
                                                                
                                canvCropped.toBlob(function (blob) {
                                    imageRepo.save(blob)
                                    .then(function(key) {
                                        fulfilled(key);
                                    }, function () {
                                        rejected();
                                    })
                                }, "image/jpeg", 0.8);
                            });


                    })
                });
            });          
        }
    }
}])



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
                .then(function (key) {
                    if(!this.images) {
                        this.images = [];
                    }

                    this.images.push({ key: key });
                    $scope.$apply();
                }.bind(this),
                function () {
                    alert('FAILURE!');
                })

            }.bind(this);
        },
        controllerAs: '$ctrl',

        template: [
            '<image-set-record ng-repeat="image in $ctrl.images" image="image" images="$ctrl.images"></image-set-record>' +
            '<input type="button" value="Add..." ng-click="$ctrl.add()" />'
        ].join()
    }
}])


adminApp.directive('imageSetRecord', ['imageRepo', function(imageRepo) 
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

            this.url = imageRepo.getUrl(this.image.key)
        },
        controllerAs: '$c',

        template: [
            '<input type="button" value="Remove" ng-click="$c.remove()" />' +
            '<img src="{{$c.url}}" crossOrigin="anonymous" />' 
        ].join()
    }    

}])




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




