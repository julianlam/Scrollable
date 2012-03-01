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
	Implements: [Options, Events],

	options: {
		autoHide: 1,
		fade: 1,
		className: 'scrollbar'/*,
		onContentHeightChange: function(){}*/
	},

	initialize: function(element, options) {
		if (typeOf(element) == 'elements') {
			var collection = [];
			element.each(function(element) {
				collection.push(new Scrollable(element, options));
			});
			return collection;
		}
		else {
			this.setOptions(options);

			var scrollable = this;
			this.element = document.id(element);
			if (!this.element) return 0;

			this.active = false;

			// Renders a scrollbar over the given element
			this.container = new Element('div', {
				'class': this.options.className,
				html: '<div class="knob"></div>'
			}).inject(document.body, 'bottom');
			this.slider = new Slider(this.container, this.container.getElement('div'), {
				mode: 'vertical',
				onChange: function(step) {
					this.element.scrollTop = ((this.element.scrollHeight - this.element.clientHeight) * (step / 100));
				}
			});
			this.reposition();
			if (!this.options.autoHide) this.container.fade('show');
			this.knob = this.container.getElement('div');

			// Making the element scrollable via mousewheel
			this.element.addEvents({
				'mouseenter': function() {
					scrollable.reposition();
				},
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
					event.preventDefault();	// Stops the entire page from scrolling when mouse is located over the element
					if ((event.wheel < 0 && this.scrollTop < (this.scrollHeight - this.offsetHeight)) || (event.wheel > 0 && this.scrollTop > 0)) {
						this.scrollTop = this.scrollTop - (event.wheel * 30);
						scrollable.readjustKnobPosition();
					}
				},
				'Scrollable:contentHeightChange': function() {
						//this scrollable:contentHeightChange could be fired on the current element in order
						//to get a custom action invoked (implemented in onContentHeightChange option)
					scrollable.fireEvent('contentHeightChange');
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
					if (scrollable.element.isVisible()) scrollable.reposition();
				}
			});

			// Initial hiding of the scrollbar
			if (this.options.autoHide) scrollable.container.fade('hide');

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

	/**
	 * Positions the knob relatively to the actual content's position
	 */
	readjustKnobPosition: function() {
		this.slider.set(Math.round((this.element.scrollTop / (this.element.scrollHeight - this.element.clientHeight)) * 100));
	},

	/**
	 * Scrolls the scrollable area to the bottommost position
	 */
	scrollBottom: function() {
		this.element.scrollTop = this.element.scrollHeight;
		this.readjustKnobPosition();
	},

	/**
	 * Scrolls the scrollable area to the topmost position
	 */
	scrollTop: function() {
		this.element.scrollTop = 0;
		this.readjustKnobPosition();
	},

	isInside: function(e) {
		if (e.client.x > this.position.x && e.client.x < (this.position.x + this.size.totalWidth) && e.client.y > this.position.y && e.client.y < (this.position.y + this.size.totalHeight))
			return true;
		else return false;
	},
	showContainer: function(force) {
		if ((this.options.autoHide && this.options.fade && !this.active) || (force && this.options.fade)) this.container.fade('in');
		else if ((this.options.autoHide && !this.options.fade && !this.active) || (force && !this.options.fade)) this.container.fade('show');
	},
	hideContainer: function(force) {
		if ((this.options.autoHide && this.options.fade && !this.active) || (force && this.options.fade)) this.container.fade('out');
		else if ((this.options.autoHide && !this.options.fade && !this.active) || (force && !this.options.fade)) this.container.fade('hide');
	},
	terminate: function() {
		this.container.destroy();
	}
});
