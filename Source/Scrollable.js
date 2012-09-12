/*
---
description: Unobtrusive modern scrollbar for elements with fixed heights
license: MIT
copyright: Copyright (c) 2011 by Julian Lam (julianlam).
authors:
- Julian Lam (julianlam)
requires:
- core/1.4.1: '*'
- more/1.4.0.1: [Slider, Element.Measure, Element.Shortcuts]
provides: [Scrollable]
...
*/

var Scrollable = new Class({
	Implements: [Options, Events],

	options: {
		autoHide: 1,
		fade: 1,
		className: 'scrollbar',
		proportional: true,
		proportionalMinHeight: 15/*,
		onContentHeightChange: function(){}*/
	},

	initialize: function(element, options) {
		this.setOptions(options);

		if (typeOf(element) == 'elements') {
			var collection = [];
			element.each(function(element) {
				collection.push(new Scrollable(element, options));
			});
			return collection;
		}
		else {
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
					this.element.scrollTop = ((this.element.scrollHeight - this.element.offsetHeight) * (step / 100));
				}.bind(this)
			});
			this.knob = this.container.getElement('div');
			this.reposition();
			if (!this.options.autoHide) this.container.fade('show');

			var self = this;
			this.element.addEvents({
				'mouseenter': function() {
					if (self.isScrollingRequired()) {
						self.showContainer();
					}
					self.reposition();
				},
				'mouseleave': function(e) {
					if (e.relatedTarget != self.container) {
						self.hideContainer();
					}
				},
					// make the element scrollable via mousewheel
				'mousewheel': function(event) {
					if (self.isScrollingRequired()) {
							// stop the entire page from scrolling when mouse is located over the element
						event.preventDefault();
					}
					if ((event.wheel < 0 && this.scrollTop < (this.scrollHeight - this.offsetHeight)) || (event.wheel > 0 && this.scrollTop > 0)) {
						this.scrollTop = this.scrollTop - (event.wheel * 30);
						self.reposition();
					}
				},
				'Scrollable:contentHeightChange': function() {
						//this scrollable:contentHeightChange could be fired on the current element in order
						//to get a custom action invoked (implemented in onContentHeightChange option)
					self.fireEvent('contentHeightChange');
				}
			});
			this.container.addEvent('mouseleave', function() {
				if (!self.active) {
					self.hideContainer();
				}
			});
			this.knob.addEvent('mousedown', function(e) {
				self.active = true;
				window.addEvent('mouseup', function(e) {
					self.active = false;
					if (!self.isInside(e)) {
						// If mouse is outside the boundaries of the target element
						self.hideContainer();
					}
					this.removeEvents('mouseup');
				});
			});
			window.addEvents({
				'resize': function() {
					self.reposition.delay(50, self);
				},
				'mousewheel': function() {
					if (self.element.isVisible()) self.reposition();
				}
			});

			// Initial hiding of the scrollbar
			if (this.options.autoHide) this.container.fade('hide');

			return this;
		}
	},

	/**
	 * Whether at the current situation scrolling is required, i.e. if the content overflows and scrollbars must be shown.
	 * @return Boolean
	 */
	isScrollingRequired: function() {
		return this.element.scrollHeight > this.element.offsetHeight;
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

		if (this.options.proportional === true) {
			if (isNaN(this.options.proportionalMinHeight) || this.options.proportionalMinHeight <= 0) {
				throw new Error('Scrollable: option "proportionalMinHeight" is not a positive number.');
			} else {
				var minHeight = Math.abs(this.options.proportionalMinHeight);
				var knobHeight = this.element.offsetHeight * (this.element.offsetHeight / this.element.scrollHeight);
				this.knob.setStyle('height', Math.max(knobHeight, minHeight));
			}
		}

		this.slider.set(Math.round((this.element.scrollTop / (this.element.scrollHeight - this.element.offsetHeight)) * 100));
	},

	/**
	 * Scrolls the scrollable area to the bottommost position
	 */
	scrollBottom: function() {
		this.element.scrollTop = this.element.scrollHeight;
		this.reposition();
	},

	/**
	 * Scrolls the scrollable area to the topmost position
	 */
	scrollTop: function() {
		this.element.scrollTop = 0;
		this.reposition();
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
