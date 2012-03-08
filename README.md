Scrollable
==========

Small and quick implementation of a CSS-customizable Scrollbar for use in situations where a div with a fixed height contains content that overflows past its boundaries.
This implementation is based off of the scrollbar designs found in various places on Facebook, GMail, and Trello.

1. One-line instantiation means you are up and running in no time.
2. Mousewheel and click-and-drag support
3. All aspects of the scrollbar container and knob are controlled via CSS
4. Automatically detects browser resizing and adjusts all positioning and sizing accordingly.
5. Automatically adjusts for changes in content

***New**: Scrollable now accepts the [$$](http://mootools.net/docs/core/Element/Element#Window:dollars) selector in addition to the regular [$](http://mootools.net/docs/core/Element/Element#Window:dollar)*

How to Use
----------

### Syntax

	var myScrollable = new Scrollable(element/elements, options);

### Arguments

1. element - ([element/elements](http://mootools.net/docs/core/Element/Element)) The element to make scrollable. Can be selected via $ or $$
2. options - ([object](http://mootools.net/docs/core/Types/Object), optional) See below.

### Options
* autoHide (truthy: defaults to true) If set to true, hides the scrollbar when the mouse is not over the target element. Otherwise, the scrollbar will stay visible at all times.
* fade (truthy: defaults to true) If set to true, a fade effect will be applied to the showing and hiding of the scrollbar.
* className (string) If set, will change which class is assigned to the scrollable. Useful if you already have a CSS class named "scrollbar", and do not want to conflict

### Events

#### contentheightchange

Fired when the height of the target element changes

##### Signature:

    onContentHeightChange()

### Examples

Given a div element with a fixed height and proper overflow (that is, anything besides "scroll"/"auto"):

	var myScrollable = new Scrollable( $('elem-id') );

Given more than one element, by passing in a CSS selector:

	var myScrollables = new Scrollable( $$('.class') );

A more complex example (an container with multiple `ul` elements to add scrollbars to):

	var myScrollables = new Scrollable( $('container').getElements('ul') );

Changelog
---------

### v0.2.8.1
* Merged changes from afoeder into Scrollable (Implementation of Options Class, and replacement of `$()` with `document.id();`
* Added new methods `scrollBottom();` and `scrollTop();`, and new event `onContentHeightChange`
* Fixed issue with broken knob dragging ([Issue 14](https://github.com/julianlam/Scrollable/pull/14))

### v0.2.7
* Merged code submitted by zwacky, resolving issues 6 and 8
* Added "force" arguments to `showContainer();` and `hideContainer();` if the scrollbar needs to be forcibly hidden/shown (i.e. parent element of container is hidden, but the container itself is not)
* Fixed minor bug in the examples section of the readme
* Fixed issue #9 - Scrollable errors out when string is passed in as target
* Fixed issue #10 - Omission of "Sources" line in package.yml

### v0.2.6
* Fixed [issue #5](https://github.com/julianlam/Scrollable/issues/5), regarding incorrect positioning in certain circumstances involving instantiation and the page scrollbar
* Fixed bug where scrollbar was visible for a fraction of a second before being hidden/repositioned.
* Fixed issue where scrolling of the page was always blocked by a Scrollable instance, even if the target element has been scrolled to the top/bottom already
* Added "terminate();", which should be called to remove any existing instances of Scrollable

### v0.2.5
* Updated Scrollable to support target elements like `<textarea>`

### v0.2.4
* Added ability to define a custom class in the event "scrollbar" is already taken

### v0.2.3
* Added documentation regarding the fade and autoHide options, which were already present in v0.2.2
* Added ability to pass in elements selected via [getElements](http://mootools.net/docs/core/Element/Element#Element:getElements)
* Fixed [issue #2](https://github.com/julianlam/Scrollable/issues/2), regarding incorrect fading behaviour when scrollbar is in use

Screenshots
-----------

![Screenshot 1](http://i.imgur.com/ZKXbK.png)

Credits
-------

I'd like to thank the following contributors for their assistance with debugging, bugfixing, and enhancing Scrollable:

* Adrian Föder ([afoeder](https://github.com/afoeder))
* Simon ([zwacky](https://github.com/zwacky))
