/*
---
description: Unobtrusive modern scrollbar for elements with fixed heights
license: MIT
copyright: Copyright (c) 2011 by Julian Lam (julianlam).
authors:
- Julian Lam (julianlam)
requires:
- core/1.4.1: '*'
- more/1.4.0.1: [Slider, Element.measure]
provides: [Scrollable]
...
*/

var Scrollable = new Class({
	initialize: function(element, options) {
		// Renders a scrollbar over the given element
		this.element = element;
		this.active = false;
		var scrollable = this;

		// Some default options
		options = options || {};
		options.autoHide = (typeOf(options.autoHide) != 'null' ? options.autoHide : 1);
		options.fade = (typeOf(options.fade) != 'null' ? options.fade : 1);

		this.container = new Element('div', {
			'class': 'scrollbar',
			html: '<div class="knob"></div>'
		}).inject(element, 'bottom');
		this.slider = new Slider(this.container, this.container.getElement('div'), {
			mode: 'vertical',
			onChange: function(step) {
				element.scrollTop = ((element.scrollHeight - element.clientHeight) * (step / 100));
			}
		});
		this.reposition.delay(50, this);

		// Making the element scrollable via mousewheel
		element.addEvent('mouseover', function() {
			if (this.scrollHeight > this.clientHeight) {
				if (options.autoHide && options.fade) scrollable.container.fade('in');
				else if (options.autoHide && !options.fade) scrollable.container.fade('show');

				this.addEvent('mousewheel', function(event) {
					event.preventDefault();	// Stops the entire page from scrolling
					this.scrollTop = this.scrollTop - (event.wheel * 30);
					scrollable.slider.set(Math.round((this.scrollTop / (this.scrollHeight - element.clientHeight)) * 100));
				});
			}
		});
		element.addEvent('mouseout', function() {
			if (options.autoHide && options.fade) scrollable.container.fade('out');
			else if (options.autoHide && !options.fade) scrollable.container.fade('hide');

			this.removeEvents('mousewheel');
		});
		window.addEvent('resize', function() {
			scrollable.reposition.delay(50,scrollable);
		});

		// Initial hiding of the scrollbar
		if (options.autoHide) scrollable.container.fade('hide');

		return this;
	},
	reposition: function() {
		// Repositions the scrollbar by rereading the container element's dimensions/position
		var initSize = this.element.getComputedSize();
		var containerSize = this.container.getSize();
		var initPos = this.element.getPosition();
		this.container.setStyles({
			height: initSize['height'],
			top: (initPos.y+initSize['computedTop']),
			left: (initPos.x+initSize['totalWidth']-containerSize.x)
		});
		this.slider.autosize();
	}
});
