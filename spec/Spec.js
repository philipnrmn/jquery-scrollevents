/*jslint browser: true, white: true, sloppy: true */

describe('jQuery scroll events plugin', function() {
    
    var squares, viewport;
    
    beforeEach(function() {
        loadFixtures('fixture.html');
        squares = $('.square');
        viewport = $('.viewport');
    });
    
    describe('initiator', function() {
    
        it('returns the original jQuery object for chaining', function() {
            expect(squares.scrollevents()).toBe(squares);
        });
        
        it('iterates over all selected elements', function() {
            squares.scrollevents();
            expect($('.square:last')).toHaveData('visible.scrollevents');
        });
        
        it('marks elements in the viewport as visible', function() {
            squares.scrollevents({'viewport': viewport});
            expect($('.square.north.west')).toHaveData('visible.scrollevents', true);
        });
        
        it('marks elements not in the viewport as not visible', function() {
            squares.scrollevents({'viewport': viewport});
            expect($('.square.south.east')).toHaveData('visible.scrollevents', false);
        });
        
    });
    
    describe('viewport', function() {
        
        it('defaults to the document', function() {
            squares.scrollevents();
            expect(squares).toHaveData('viewport.scrollevents', document);
        });
        
        it('is configurable', function() {
            squares.scrollevents({'viewport': viewport});
            expect(squares).toHaveData('viewport.scrollevents', viewport);
        });
        
    });
    
    describe('scroll in event', function() {
        
        var west, scrollSpy;
        
        beforeEach(function() {
            west = $('.square.west').not('.north, .south');
            scrollSpy = jasmine.createSpy('scrollSpy');
            west.scrollevents({'viewport': viewport, 'throttle':false});
            west.on('scrollin.scrollevents', scrollSpy);
        });
        
        it('is fired when the element scrolls into view vertically', function() {
            viewport.scrollTop(200).trigger('scroll');
            expect(scrollSpy).toHaveBeenCalled();
        });
        
        it('is fired when the element scrolls into view horizontally', function() {
            viewport.scrollLeft(200).scrollTop(200).trigger('scroll').scrollLeft(0).trigger('scroll');
            expect(scrollSpy).toHaveBeenCalled();
        });
        
        it('is only fired once', function() {
            viewport.scrollTop(200).trigger('scroll').trigger('scroll');
            expect(scrollSpy.callCount).toEqual(1);
        });
        
        it('is not fired if the element is not in view', function() {
            viewport.trigger('scroll');
            expect(scrollSpy).not.toHaveBeenCalled();
        });
        
    });
    
    describe('scroll out event', function() {
        
        var northWest, scrollSpy;
        
        beforeEach(function() {
            northWest = $('.square.north.west');
            scrollSpy = jasmine.createSpy('scrollSpy');
            northWest.scrollevents({'viewport': viewport, 'throttle':false});
            northWest.on('scrollout.scrollevents', scrollSpy);
        });
        
        it('is fired when the element scrolls out of view vertically', function() {
            viewport.scrollTop(200).trigger('scroll');
            expect(scrollSpy).toHaveBeenCalled();
        });
        
        it('is fired when the element scrolls out of view horizontally', function() {
            viewport.scrollLeft(200).trigger('scroll');
            expect(scrollSpy).toHaveBeenCalled();
        });
        
        it('is only fired once', function() {
            viewport.scrollTop(200).trigger('scroll').trigger('scroll');
            expect(scrollSpy.callCount).toEqual(1);
        });
        
        it('is not fired if the element is in view', function() {
            viewport.trigger('scroll');
            expect(scrollSpy).not.toHaveBeenCalled();
        });
        
    });
    
    describe('throttling', function() {
        
        beforeEach(function() {
            spyOn($, 'throttle');
        });
        
        it('defaults to 200ms', function() {
            squares.scrollevents({'viewport': viewport});
            expect($.throttle).toHaveBeenCalledWith(200, jasmine.any(Function));
        });
        
        it('is configurable', function() {
            squares.scrollevents({throttle: 100});
            expect($.throttle).toHaveBeenCalledWith(100, jasmine.any(Function));
        });
        
        it('can be disabled', function() {
            squares.scrollevents({throttle: false});
            expect($.throttle).not.toHaveBeenCalled();
        });
        
    });
    
    describe('with viewport set to document', function() {
        
        beforeEach(function() {
            viewport.css({'overflow':'visible'});
            $('html, body').css({'height':'10000px', 'width':'10000px'});
        });
        
        describe('offset', function() {
            var scrollSpy;
            
            beforeEach(function() {
                scrollSpy = jasmine.createSpy('scrollSpy');
                squares.scrollevents({'throttle': false});
                squares.on('scrollout.scrollevents', scrollSpy);
            });
            
            it('is correctly detected vertically', function() {
                $(document).scrollTop(1000).trigger('scroll');
                expect(scrollSpy).toHaveBeenCalled();
            });
            
            it('is correctly detected horizontally', function() {
                $(document).scrollLeft(1000).trigger('scroll');
                expect(scrollSpy).toHaveBeenCalled();
            });
            
        });
        
        describe('viewport', function() {
            
            it('is correctly measured vertically', function() {
                viewport.css({'top':'9000px'});
                squares.scrollevents();
                expect(squares).toHaveData('visible.scrollevents', false);
            });
            
            it('is correctly measured vertically', function() {
                viewport.css({'left':'9000px'});
                squares.scrollevents();
                expect(squares).toHaveData('visible.scrollevents', false);
            });
        });
        
        afterEach(function() {
            $(document).scrollLeft(0).scrollTop(0);
            $('html, body').css({'height':'auto', 'width':'auto'});
        });
        
    });
    
    afterEach(function() {
        $(document).off('scroll');
        viewport.off('scroll');
    });
    
});
