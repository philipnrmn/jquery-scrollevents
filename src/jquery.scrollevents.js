/*jslint browser: true, white: true */
/*global jQuery */

/**
 * @license jQuery Scroll Events v0.1.0
 * http://github.com/philipnrmn/jquery-scrollevents
 * 
 * Copyright (c) 2013 Philip Norman
 * Dual licensed under the MIT and GPL licenses.
 */

(function($) {
    'use strict';
    var isVisible, getBoundsRelativeToViewport, getBoundsRelativeToDocument, 
        getViewportBounds, getDocumentBounds, makeBounds, getScrollFunction;
    
    isVisible = function(element) {
        var viewport, elementBounds, viewportBounds;
        viewport = $(element.data('viewport.scrollevents'));
        
        if (viewport.is(document)) {
            elementBounds = getBoundsRelativeToDocument(element);
            viewportBounds = getDocumentBounds(viewport);
        } else {
            elementBounds = getBoundsRelativeToViewport(element);
            viewportBounds = getViewportBounds(viewport);
        }
        
        return elementBounds.top < viewportBounds.bottom
            && elementBounds.right > viewportBounds.left
            && elementBounds.bottom > viewportBounds.top
            && elementBounds.left < viewportBounds.right;
    };
    
    getBoundsRelativeToViewport = function(element) {
        var position = element.position();
        return makeBounds(position.left, position.top, element.width(), element.height());
    };
    
    getBoundsRelativeToDocument = function(element) {
        var offset = element.offset();
        return makeBounds(offset.left, offset.top, element.width(), element.height());
    };
    
    getViewportBounds = function(viewport) {
        return makeBounds(0, 0, viewport.width(), viewport.height());
    };
    
    getDocumentBounds = function(viewport) {
        var screen = $(window);
        return makeBounds(viewport.scrollLeft(), viewport.scrollTop(), 
                            screen.width(), screen.height());
    };
    
    makeBounds = function(x, y, width, height) {
        return {
            top: y,
            right: x + width,
            bottom: y + height,
            left: x
        };
    };
    
    getScrollFunction = function(element, throttle) {
        var scrollFunction = function() {
            var wasVisible, nowVisible;
            wasVisible = element.data('visible.scrollevents');
            nowVisible = isVisible(element);
            
            if (!wasVisible && nowVisible) {
                element.trigger('scrollin.scrollevents');
            }
            
            if (wasVisible && !nowVisible) {
                element.trigger('scrollout.scrollevents');
            }
            
            if (wasVisible !== nowVisible) {
                element.data('visible.scrollevents', nowVisible);
            }
        };
        if (throttle > 0) {
            return $.throttle(throttle, scrollFunction);
        }
        return scrollFunction;
    };
    
    $.fn.scrollevents = function(customSettings) {
        
        var settings = $.extend({
            viewport: document,
            throttle: 200
        }, customSettings);
        
        this.each(function(index, element) {
            
            element = $(element);
            
            element.data('viewport.scrollevents', settings.viewport);
            element.data('visible.scrollevents', isVisible(element));
            
            var scrollFunction = getScrollFunction(element, settings.throttle);
            
            $(settings.viewport).on('scroll', scrollFunction);
        });
        return this;
    };
    
}(jQuery));
