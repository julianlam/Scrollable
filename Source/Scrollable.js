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
			this.options = options;

			// Renders a scrollbar over the given element
			this.container = new Element('div', {
				'class': options.className,
				html: '<div class="knob"></div>'
			}).inject(document.body, 'bottom');
			this.slider = new Slider(this.container, this.container.getElement('div'), {
				mode: 'vertical',
				onChange: function(step) {
					element.scrollTop = ((element.scrollHeight - element.clientHeight) * (step / 100));
				}
			});
			this.reposition();
			if (!options.autoHide) this.container.fade('show');
			this.knob = this.container.getElement('div');

			// Making the element scrollable via mousewheel
			element.addEvents({
				'mouseover': function() {
					if (this.scrollHeight > this.clientHeight) {
						scrollable.showContainer();
					}
				},
				'mouseleave': function(e) {
					if (!scrollable.isInside(e) && !scrollable.active) {
						scrollable.hideContainer();
					}
				},
				'mousewheel': function(event) {
					event.preventDefault();	// Stops the entire page from scrolling
					this.scrollTop = this.scrollTop - (event.wheel * 30);
					scrollable.slider.set(Math.round((this.scrollTop / (this.scrollHeight - element.clientHeight)) * 100));
				}
			});
			this.container.addEvent('mouseleave', function() {
				if (!scrollable.active) {
					scrollable.hideContainer();
				}
			});
			this.knob.addEvent('mousedown', function(e) {
				scrollable.active = true;
				window.addEvent('mouseup', function(e) {
					scrollable.active = false;
					if (!scrollable.isInside(e)) {
						// If mouse is outside the boundaries of the target element
						scrollable.hideContainer();
					}
					this.removeEvents('mouseup');
				});
			});
			window.addEvents({
				'resize': function() {
					scrollable.reposition.delay(50,scrollable);
				},
				'mousewheel': function() {
					scrollable.reposition();
				}
			});

			// Initial hiding of the scrollbar
			if (options.autoHide) scrollable.container.fade('hide');

			return this;
		}
	},
	reposition: function() {
		// Repositions the scrollbar by rereading the container element's dimensions/position
		(function() {
			this.size = this.element.getComputedSize();
			this.position = this.element.getPosition();
			var containerSize = this.container.getSize();

			this.container.setStyle('height', this.size['height']).setPosition({
				x: (this.position.x+this.size['totalWidth']-containerSize.x),
				y: (this.position.y+this.size['computedTop'])
			});
			this.slider.autosize();
		}).bind(this).delay(50);
	},
	isInside: function(e) {
		if (e.client.x > this.position.x && e.client.x < (this.position.x + this.size.totalWidth) && e.client.y > this.position.y && e.client.y < (this.position.y + this.size.totalHeight))
			return true;
		else return false;
	},
	showContainer: function() {
		if (this.options.autoHide && this.options.fade && !this.active) this.container.fade('in');
		else if (this.options.autoHide && !this.options.fade && !this.active) this.container.fade('show');	
	},
	hideContainer: function() {
		if (this.options.autoHide && this.options.fade && !this.active) this.container.fade('out');
		else if (this.options.autoHide && !this.options.fade && !this.active) this.container.fade('hide');
	}
});
