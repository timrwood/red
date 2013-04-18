define(function (require) {

	"use strict";

	return require("../Canvas").extend({
		prepare : function () {
			this.fillStyle(this.primaryHex).fillRect(0, 0, this.width, this.height);
		},

		drawFromPercentToPercent : function (s, e) {
			var min = ~~(this.width * s * 0.5),
				max = ~~(this.width * e * 0.5),
				x,
				i;

			this.lineWidth(1);

			for (i = min; i < max; i ++) {
				x = (i * 2) + 0.5;
				this.strokeStyle(this.secondaryHex).beginPath().moveTo(x, 0).lineTo(x, this.height).stroke();
			}
		}
	});
});
