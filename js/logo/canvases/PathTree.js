define(function (require) {

	"use strict";

	var path = require("../data/Path"),
		TAU = Math.PI * 2,
		LINES = 1000;

	return require("../Canvas").extend({
		prepare : function () {
			var x = (this.bgw - this.fgw) / 2,
				y = (this.bgh - this.fgh) / 2;

			this.fillStyle(this.primaryHex);
			this.fillRect(0, 0, this.width, this.height);

			if (this.isForeground) {
				this.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				this.setTransform(1, 0, 0, 1, x, y);
			}

			this.strokeStyle(this.secondaryHex);
		},

		drawAtPercent : function (t) {
			this.makeLine(t);
		},

		drawFromPercentToPercent : function (s, e) {
			var min = ~~(LINES * s),
				max = ~~(LINES * e),
				i;

			for (i = min; i < max; i++) {
				this.makeLine(i / LINES);
			}
		},

		makeLine : function (t) {
			var len = (1 + Math.random() * 4) * this.fgh / 50,
				point = path.point(t),
				normal = path.normal(t, this.isForeground),
				x = point[0] * this.fgw,
				y = point[1] * this.fgh,
				x2 = x + normal[0] * len,
				y2 = y + normal[1] * len;

			this.beginPath().moveTo(x, y).lineTo(x2, y2).stroke();
		},

		destroy : function () {
			this.setTransform(1, 0, 0, 1, 0, 0);
		}
	});
});
