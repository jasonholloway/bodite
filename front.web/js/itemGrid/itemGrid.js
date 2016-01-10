(function() {
	var angular = require('angular');
    var _ = require('lodash');
    require('babel-polyfill');
	
	var mod = angular.module('itemGrid', []);
        
	mod.directive('itemGrid', function() {
		return {
			restrict: 'E',
			scope: {
				'source': '&',
				'cols': '=',
				'rows': '=',
                'numPageLinks': '=?',
                'pageIndex': '=?',
                'pageLinkUrlProvider': '&?'
			},
			controller: function($scope) {                
                $scope.pageIndex = $scope.pageIndex || 0;
                $scope.numPageLinks = $scope.numPageLinks || 5;
                
				var pageSize = ($scope.rows || 6) * ($scope.cols || 3);
				                                
                var pageLinkUrlProvider = $scope.pageLinkUrlProvider
                                            ? $scope.pageLinkUrlProvider()
                                            : function(i) { return i; };
                                                
				$scope.source()({ index: $scope.pageIndex, size: pageSize })                
                .then(function(result) {
					$scope.items = result.items;
					
					$scope.itemRows = [];
                    
                    $scope.pageLinks = [];
                    
                    var minPage = 0;
                    var maxPage = _.min([result.pageCount, $scope.numPageLinks]);
                                        
                    for(var i = minPage; i < maxPage; i++) {
                        $scope.pageLinks.push({
                            pageIndex: i,
                            isCurrent: i == $scope.pageIndex,
                            url: pageLinkUrlProvider(i + 1) //not zero-based!
                        });
                    }
                    
					var rowItems = [];
					
					for(var i = 0; i < result.items.length && $scope.itemRows.length < $scope.rows; i++) {							
						rowItems.push(result.items[i]);
										
						if(rowItems.length == $scope.cols) {
							$scope.itemRows.push(rowItems);
							rowItems = [];
						}						
					}
					
					if(rowItems.length) $scope.itemRows.push(rowItems);
					
					$scope.$applyAsync();
                    
				}, function(e) {                    
					throw Error(e);
				})				
			},
			template: function(elem, attr) {				
				return [
					'<div class="itemGrid">',
						'<div class="row" ng-repeat="row in itemRows">',
							'<div class="cell" ng-repeat="item in row" ng-include="\'' + attr.templateUrl + '\'"></div>',
						'</div>',
                        '<div class="pageLinks">',
                            '<span class="pageLink" ng-repeat="link in pageLinks" ng-class="{currPageLink: link.isCurrent}">',
                                '<a ng-if="!link.isCurrent" href="{{link.url}}">',
                                    '{{link.pageIndex + 1}}',
                                '</a>',
                                '{{link.isCurrent ? link.pageIndex + 1 : ""}}',
                            '</span>',
                        '</div>',
					'</div>'
				].join('')
			}
		}
	});
	
})();
