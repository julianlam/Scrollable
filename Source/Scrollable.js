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
		if (typeOf(element) == 'elements') {
			var collection = [];
			element.each(function(element) {
				collection.push(new Scrollable(element, options));
			});
			return collection;
		}
		else {
			var scrollable = this;
			this.element = element;
			this.active = false;
	
			// Some default options
			options = options || {};
			options.autoHide = (typeOf(options.autoHide) != 'null' ? options.autoHide : 1);
			options.fade = (typeOf(options.fade) != 'null' ? options.fade : 1);
			options.className = (typeOf(options.className) != 'null' ? options.className : 'scrollbar');

			// Renders a scrollbar over the given element
			this.container = new Element('div', {
				'class': options.className,
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
			element.addEvents({
				'mouseover': function() {
					if (this.scrollHeight > this.clientHeight) {
						if (options.autoHide && options.fade && !scrollable.active) scrollable.container.fade('in');
						else if (options.autoHide && !options.fade && !scrollable.active) scrollable.container.fade('show');
	
						this.addEvent('mousewheel', function(event) {
							event.preventDefault();	// Stops the entire page from scrolling
							this.scrollTop = this.scrollTop - (event.wheel * 30);
							scrollable.slider.set(Math.round((this.scrollTop / (this.scrollHeight - element.clientHeight)) * 100));
						});
					}
				},
				'mouseout': function() {
					if (options.autoHide && options.fade && !scrollable.active) scrollable.container.fade('out');
					else if (options.autoHide && !options.fade && !scrollable.active) scrollable.container.fade('hide');
	
					this.removeEvents('mousewheel');
				},
				'mousedown': function() {
					scrollable.active = true;
					window.addEvent('mouseup', function(e) {
						scrollable.active = false;
						if (e.event.x < scrollable.position.x || e.event.x > (scrollable.position.x + scrollable.size.totalWidth) || e.event.y < scrollable.position.y || e.event.y > (scrollable.position.y + scrollable.size.totalHeight)) {
							// If mouse is outside the boundaries of the target element
							if (options.autoHide && options.fade && !scrollable.active) scrollable.container.fade('out');
							else if (options.autoHide && !options.fade && !scrollable.active) scrollable.container.fade('hide');
						}
						this.removeEvents('mouseup');
					});
				}
			});
			window.addEvent('resize', function() {
				scrollable.reposition.delay(50,scrollable);
			});

			// Initial hiding of the scrollbar
			if (options.autoHide) scrollable.container.fade('hide');

			return this;
		}
	},
	reposition: function() {
		// Repositions the scrollbar by rereading the container element's dimensions/position
		this.size = this.element.getComputedSize();
		this.position = this.element.getPosition();
		var containerSize = this.container.getSize();

		this.container.setStyles({
			height: this.size['height'],
			top: (this.position.y+this.size['computedTop']),
			left: (this.position.x+this.size['totalWidth']-containerSize.x)
		});
		this.slider.autosize();
	}
});
