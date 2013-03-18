jquery-scrollevents
===================

jQuery plugin which fires an event when an element scrolls into or out of view.

Basic Usage
-----------

    // Initiate the scroll events plugin on all p tags
    $('p').scrollevents();
    // Listen for the scroll in event
    $('p').on('scrollin.scrollevents', function() {
        alert('scrolled in');
    });
    // Listen for the scroll out event
    $('p').on('scrollout.scrollevents', function() {
        alert('scrolled out');
    });

Throttling
----------

By default events are throttled to 200ms. This can be overridden:

    // Throttle to 100ms (fire ten times per second)
    $('p').scrollevents({'throttle': 100});
    // Disable throttling entirely (fire many times per second)
    $('p').scrollevents({'throttle': false});
    
Viewport
--------

By default the browser viewport is used to judge whether the element is visible. It is possible to use a custom 
viewport by passing it to the constructor:

    // Set the viewport with a DOM element
    var viewport = document.getElementById('viewport');
    $('p').scrollevents({'viewport': viewport});
    // Set the viewport with a jQuery selector
    $('p').scrollevents({'viewport': '#viewport'});
    // Set the viewport with a jQuery object
    $('p').scrollevents({'viewport': $('#viewport')});

Note that the viewport should be the offset parent of the element in question. 
