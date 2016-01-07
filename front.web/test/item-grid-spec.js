require('./_global');

require('../js/directives/item-grid');             


describe('itemGrid', function() {
        
    var elem;
    var scope;
                
                
    it('itemGridDirective should be available', function() {
        angular.mock.inject(function($injector) {
            expect($injector.has('itemGridDirective')).to.be.true;            
        });
    });               
                
                
    beforeEach(function(done) {        
        angular.mock.module('itemGrid');
                
        angular.mock.inject(function($rootScope, $compile, $templateCache) {    
            scope = $rootScope.$new();
            scope.itemSource = function(page) {                
                return new Promise(function(done) { 
                    done([1, 2, 3, 4, 5, 6]);
                });  
            };
    
            $templateCache.put('template.html', '<p id="{{item}}">Hello!</p>');
    
            var elemHTML = '<item-grid rows=3 cols=2 source="itemSource" template-url="template.html"></item-grid>';
            elem = $compile(elemHTML)(scope);
            
            scope.$digest();
            
            process.nextTick(function () {
                scope.$digest();                
                done();
            });            
        });  
    });
       
         
    
    it('should render bare cells in correct dimensions', function() {
        expect($(elem).find('.itemGridRow').length).to.equal(3);
        expect($(elem).find('.itemGridCell').length).to.equal(3 * 2);
    });
    
    
    it('should render templates within cells, bound to correct items', function() {
       var paras = $(elem).find('p');
        
       expect(paras.length).to.equal(6);

       paras.each(function(i, el) {
            expect($(el).attr('id') == i.toString());
       });        
    });
    
    
    it('should retrieve correct number of pages', function() {
        
    });
    
    
    
});