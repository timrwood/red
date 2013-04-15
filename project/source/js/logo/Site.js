define(function (require) {

	"use strict";

	var $ = require('$'),
		COLORS = ['red', 'black', 'white'];

	return require("rosy/base/Class").extend({
		init : function () {
			$(window).click(this.change).click();
		},

		colorPhase : -1,
		isForeground : false,
		change : function () {
			var classes = "",
				primary, secondary, tertiary;

			this.colorPhase = (this.colorPhase + 1) % 6;

			primary = 2 - (this.colorPhase % 3);
			secondary = ~~(this.colorPhase / 2);
			tertiary = ~~(((this.colorPhase + 3) % 6) / 2);

			console.log(primary, secondary, tertiary, primary + secondary + tertiary, this.colorPhase);

			this.isForeground = !this.isForeground;
			classes += this.isForeground ? 'is-fg bg-' : 'is-bg fg-';

			classes += COLORS[primary];

			$('body').removeClass().addClass(classes);
		}
	});
});
