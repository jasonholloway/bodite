(function() {
	
	var app = angular.module('BoditeAdmin');
	
    app.directive('productSearchbox', function () {
        return {
            restrict: 'E',
            scope: true,
            template: '<input type="search" placeholder="Meklēt..." >',
            link: function (scope, elem) {
                var lastVal;

                $(elem).on("input", function (e) {
                    var val = e.target.value;

                    if (lastVal != val) {
                        lastVal = val;

                        if (scope.products) {
                            scope.$applyAsync(function () {
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

})();