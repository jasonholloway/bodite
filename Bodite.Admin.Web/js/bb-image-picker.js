/// <reference path="angular.js" />
/// <reference path="bodite_admin.js" />

(function () {

    var Croppic = require('./bodite_croppic');
    var pica = require('pica');
    require('angular-ui-bootstrap');
    require('angular-dialog-service');
    require('blueimp-canvas-to-blob');

    
    var app = angular.module('BoditeAdmin');


    app.directive('imagePicker', ['croppic', function (croppic) {
        var elem;

        return {
            restrict: 'E',
            scope: {
                images: '='
            },
            bindToController: true,

            controller: function ($scope) {
                this.add = function () {
                    croppic.loadAndCrop('')
                    .then(function (key) {
                        if (!this.images) {
                            this.images = [];
                        }

                        this.images.push({ key: key });
                        $scope.$apply();
                    }.bind(this),
                    function () {
                        alert('Failed to save image!');
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


    app.directive('imageSetRecord', ['imageRepo', function (imageRepo) {
        return {
            restrict: 'E',
            scope: {
                image: '=',
                images: '='
            },
            bindToController: true,

            controller: function () {
                this.remove = function () {
                    this.images = this.images.filter(function (i) {
                        return i !== this.image
                    }.bind(this));
                }

                this.url = imageRepo.getUrl(this.image.key)
            },
            controllerAs: '$c',

            template: [
                '<input type="button" value="Remove" ng-click="$c.remove()" />',
                '<img src="{{$c.url}}" crossOrigin="anonymous" />',
            ].join('')
        }

    }])


    app.service('croppic', ['$http', 'imageRepo', function ($http, imageRepo) {
        return {
            loadAndCrop: function (sourcePath) {

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
                    .then(function (blob) {
                        croppic.open(blob)
                        .then(function (spec) {
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
                                        .then(function (key) {
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
    

})();




