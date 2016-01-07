require('./_global');
require('../js/directives/item-grid');             
var expect = require('chai').expect;
var _ = require('lodash');


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
        spec.numPageLinks = spec.numPageLinks || 8;
        spec.pageLinkUrlProvider = spec.pageLinkUrlProvider || function(i) { return i.toString(); };
        
        return new Promise(function(done, err) {                    
            angular.mock.inject(function($rootScope, $compile, $templateCache) {    
                scope = $rootScope.$new();
                scope.itemSource = spec.source;        
                scope.pageLinkUrlProv = spec.pageLinkUrlProvider;
        
                $templateCache.put('template.html', spec.template);
        
            
        
                var elemHTML = '<item-grid rows=' + spec.rows + ' cols=' + spec.cols + ' source="itemSource" page-index=' + spec.pageIndex + ' num-page-links=' + spec.numPageLinks + ' page-link-url-provider="pageLinkUrlProv" template-url="template.html"></item-grid>';
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
                                    
            var res = {
              items: items,
              page: page,
              pageCount: _.ceil((max - min) / page.size)
            };
                                                                                           
            return Promise.resolve(res);
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
            expect(grid.find('.row').length).to.equal(3);
            expect(grid.find('.cell').length).to.equal(3 * 2);                                    
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
           expect(grid.find('.pageLinks').length).to.be.above(0);           
           cb();
       }).catch(cb);
    });
    
    
    it('should show up to max number of page links', function(cb) {
       renderGrid({
           numPageLinks: 10
       })
       .then(function(grid) {
           expect(grid.find('.pageLink').length).to.equal(10);           
           cb();
       }).catch(cb);        
    });
    
    
    it('should show up to available number of page links', function(cb) {
       renderGrid({
           rows: 5,
           cols: 2,
           source: numSource(0, 35),
           numPageLinks: 10 //will be overriden by dearth of source items (hopefully)
       })
       .then(function(grid) {
           expect(grid.find('.pageLink').length).to.equal(4);           
           cb();
       }).catch(cb);        
    });

    it('should show non-clickable link for current page, with correct page number displayed', function(cb) {
       renderGrid({
           pageIndex: 3
       })
       .then(function(grid) {           
           var pageLinks = grid.find('.pageLink');                      
           var currPageLinks = pageLinks.filter('.currPageLink');
           
           expect(currPageLinks.length).to.equal(1);
           expect(currPageLinks.has('a').length).to.equal(0);
           expect(currPageLinks.text()).to.equal('4'); //not zero-based!
           
           cb();
       }).catch(cb);
    });
    
    it('should show non-current page links with anchors', function(cb) {
       renderGrid()
       .then(function(grid) {           
           var pageLinks = grid.find('.pageLink').filter(':not(.currPageLink)');
                      
           expect(pageLinks.has('a').length).to.equal(pageLinks.length);
                      
           cb();
       }).catch(cb);
    });

    it('should use pageLinkUrlProvider function to render pageLink URLs', function(cb) {
        renderGrid({
            pageLinkUrlProvider: function(index) {
                return 'http://j.com/' + index;
            }
        })
        .then(function(grid) {            
            var anchors = grid.find('.pageLink').has('a').find('a');
            
            anchors.each(function(i, a) {                
                expect($(a).attr('href')).to.equal('http://j.com/' + $(a).text());
            })            
            
            cb();
        }).catch(cb);
    });
    
    
});