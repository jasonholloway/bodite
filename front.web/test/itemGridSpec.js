require('./_global');

require('../js/directives/item-grid');             


describe('itemGrid', function() {
        
    var elem;
    var scope;
                
    beforeEach(function() {
        angular.mock.module('itemGrid');
    })
                
    function renderGrid(spec) {        
        spec = spec || {};
        spec.source = spec.source || numSource(0, 1000);
        spec.rows = spec.rows || 6;
        spec.cols = spec.cols || 4;
        spec.pageIndex = spec.pageIndex || 0;
        spec.template = spec.template || '';        
        
        return new Promise(function(done, err) {                    
            angular.mock.inject(function($rootScope, $compile, $templateCache) {    
                scope = $rootScope.$new();
                scope.itemSource = spec.source;
        
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
                
    
    var numSource = function(min, max) {
        return function(page) {        
            var items = [];
            
            for(var i = min; i < min + page.size && i <= max; i++) {
                items.push(i + (page.index * page.size));
            }
                                            
            return Promise.resolve(items);
        }
    }
    
              
    it('itemGridDirective should be available', function() {
        angular.mock.inject(function($injector) {
            expect($injector.has('itemGridDirective')).to.be.true;            
        });
    });               
      
      
    it('should render bare cells in correct dimensions', function(cb) {
        renderGrid({
            rows: 3,
            cols: 2
        })
        .then(function(grid) {
            expect(grid.find('.itemGridRow').length).to.equal(3);
            expect(grid.find('.itemGridCell').length).to.equal(3 * 2);                                    
            cb();
        }).catch(cb);
    });
    
    
    it('should render templates within cells, bound to correct items', function(cb) {
        renderGrid({
            template: '<p id="{{item}}"></p>',
            rows: 4,
            cols: 4
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
    
    
    it('should respect page index', function(cb) {
        renderGrid({            
            template: '<p id="{{item}}"></p>',
            rows: 4,
            cols: 4,
            pageIndex: 7
        })
       .then(function(grid) {           
            var paras = grid.find('p');
                
            expect(paras.length).to.equal(16);

            paras.each(function(i, el) {
                    expect($(el).attr('id') == (i + (7 * 16)).toString());
            });      
                       
           cb();
       }).catch(cb);
    });
    
    
    it('should show some page links', function(cb) {
       renderGrid()
       .then(function(grid) {           
           expect(grid.find('.pageLinks')[0])
           
           cb();
       }).catch(cb);
    });
    
});