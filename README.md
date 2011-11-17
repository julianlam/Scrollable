Scrollable
==========

Small and quick implementation of a CSS-customizable Scrollbar for use in situations where a div with a fixed height contains content that overflows past its boundaries.
This implementation is based off of the scrollbar designs found in various places on Facebook, GMail, and Trello.

1. One-line instantiation means you are up and running in no time.
2. Mousewheel and click-and-drag support
3. All aspects of the scrollbar container and knob are controlled via CSS
4. Automatically detects browser resizing and adjusts all positioning and sizing accordingly.
5. Automatically adjusts for changes in content

**Note**: *Scrollable currently only works one element at a time. Future support for passing in elements selected via [$$](http://mootools.net/docs/core/Element/Element#Window:dollars) are in the pipeline.*

How to Use
----------

### Syntax

	var myScrollable = new Scrollable(element, options);

### Arguments

1. element - ([element](http://mootools.net/docs/core/Element/Element#Window:dollar)) The element to make scrollable.
2. options - ([object](http://mootools.net/docs/core/Types/Object), optional) See below.

### Options
* autoHide (truthy: defaults to true) If set to true, hides the scrollbar when the mouse is not over the target element. Otherwise, the scrollbar will stay visible at all times.
* fade (truthy: defaults to true) If set to true, a fade effect will be applied to the showing and hiding of the scrollbar.

### Example

Given a div element with a fixed height and proper overflow (that is, anything besides "scroll"/"auto"):

	var myScrollable = new Scrollable( $('elem-id') );

Screenshots
-----------

![Screenshot 1](http://i.imgur.com/ZKXbK.png)
