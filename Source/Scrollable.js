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
	initialize: function(element) {
		// Renders a scrollbar over the given element
		this.element = element;
		this.active = false;
		var scrollable = this;

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
				scrollable.container.fade('in');
				this.addEvent('mousewheel', function(event) {
					event.preventDefault();	// Stops the entire page from scrolling
					this.scrollTop = this.scrollTop - (event.wheel * 30);
					scrollable.slider.set(Math.round((this.scrollTop / (this.scrollHeight - element.clientHeight)) * 100));
				});
			}
		});
		element.addEvent('mouseout', function() {
			scrollable.container.fade('out');
			this.removeEvents('mousewheel');
		});
		window.addEvent('resize', function() {
			scrollable.reposition.delay(50,scrollable);
		});

		// Fading the container after some time
		scrollable.container.fade('hide');

		return this;
	},
	reposition: function() {
		// Repositions the scrollbar by rereading the container element's dimensions/position
		var initSize = this.element.getComputedSize();
		var initPos = this.element.getPosition();
		this.container.setStyles({
			height: initSize['height'],
			width: '21px',
			position: 'absolute',
			top: (initPos.y+initSize['computedTop'])+'px',
			left: (initPos.x+initSize['totalWidth']-21)+'px'
		});
		this.slider.autosize();
	}
});
