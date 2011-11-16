Scrollable
==========

Small and quick implementation of a CSS-customizable Scrollbar for use in situations where a div with a fixed height contains content that overflows past the boundaries.
This implementation is based off of the scrollbar designs found in various places on Facebook, GMail, and Trello.

1. One-line instantiation means you are up and running in no time.
2. Mousewheel and click-and-drag support
3. All aspects of the scrollbar container and knob are controlled via CSS
4. Automatically detects browser resizing and adjusts all positioning and sizing accordingly.

**Note**: *Scrollable currently only works one element at a time. Future support for passing in elements selected via [$$](http://mootools.net/docs/core/Element/Element#Window:dollars) are in the pipeline.*

How to Use
----------

Given a div element with a fixed height and proper overflow (that is, anything besides "scroll"/"auto"):

	var myScrollable = new Scrollable( $('elem-id') );

Screenshots
-----------

This section is optional, but encouraged if the plugin affords it. Just a list of images, one per line. We do the resizing, so use actual size screenshots.

![Screenshot 1](http://i.imgur.com/ZKXbK.png)
