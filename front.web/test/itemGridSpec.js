require('./_global');

require('../js/directives/item-grid');             


describe('itemGrid', function() {
        
    var elem;
    var scope;
                
    beforeEach(function() {
        angular.mock.module('itemGrid');
    })
                
    it('itemGridDirective should be available', function() {
        angular.mock.inject(function($injector) {
            expect($injector.has('itemGridDirective')).to.be.true;            
        });
    });               
                
                
                
                
    function renderGrid(source, spec) {
        return new Promise(function(done, err) {                    
            angular.mock.inject(function($rootScope, $compile, $templateCache) {    
                scope = $rootScope.$new();
                scope.itemSource = source;
        
                $templateCache.put('template.html', spec.template);
        
                var elemHTML = '<item-grid rows=' + spec.rows + ' cols=' + spec.cols + ' source="itemSource" page-index=' + spec.pageIndex + ' template-url="template.html"></item-grid>';
                elem = $compile(elemHTML)(scope);
                
                scope.$digest();
                
                process.nextTick(function () {
                    scope.$digest();                
                    done($(elem));
                });            
            });  
        });
    }
                
                
         
    
    
    var simpleSource = function(page) {        
        var items = [];
        
        for(var i = 0; i < page.size; i++) {
            items.push(i + (page.index * page.size));
        }
                                        
        return Promise.resolve(items);
    }
    
    
    it('should render bare cells in correct dimensions', function(cb) {
        renderGrid(
            simpleSource,
            { 
                template: 'hello!',
                rows: 3,
                cols: 2,
                pageIndex: 0
            })
        .then(function(grid) {
            expect(grid.find('.itemGridRow').length).to.equal(3);
            expect(grid.find('.itemGridCell').length).to.equal(3 * 2);                                    
            cb();
        }).catch(cb);
    });
    
    
    it('should render templates within cells, bound to correct items', function(cb) {
        renderGrid(
            simpleSource, 
            {
                template: '<p id="{{item}}"></p>',
                rows: 4,
                cols: 4,
                pageIndex: 0
            })
       .then(function(grid) {           
            var paras = grid.find('p');
                
            expect(paras.length).to.equal(16);

            paras.each(function(i, el) {
                    expect($(el).attr('id') == i.toString());
            });      
                       
           cb();
       }).catch(cb);
    });
    
    
    //test paging capabilities...
    
    
    
    
    
    
    
    
});