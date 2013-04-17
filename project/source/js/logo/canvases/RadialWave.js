define(function (require) {

	"use strict";

	return require("../Canvas").extend({
		phex : null,
		shex : null,
		prepare : function () {
			this.setTransform(1, 0, 0, 1, this.width / 2, this.height / 2);
			this.fillStyle(this.primaryHex()).fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
			this.fillStyle(this.primaryRgba(0.1)).strokeStyle(this.secondaryHex());
			this.t = 0;
		},

		t : 0,
		drawAtPercent : function (t) {
			var astep = Math.PI * 0.01,
				dstep = 60,
				a, d,
				x, y,
				d2;

			this.beginPath().moveTo(0, 0);
			for (d = this.t; d < 500; d += dstep) {
				for (a = 0; a <= Math.PI * 2; a += astep) {
					d2 = d * (Math.sin(a * 24) * 0.25 + 0.75);
					d2 -= (a / (Math.PI * 2)) * dstep;
					d2 = Math.max(0, d2);
					x = 2 * Math.cos(a) - Math.cos(a * 2);
					y = 2 * Math.sin(a) - Math.sin(a * 2);
					x *= Math.abs(Math.sin(a));
					y *= Math.abs(Math.sin(a));
					this.lineTo(d2 * x, d2 * y);
				}
			}
			this.stroke();
			this.t++;
			if (this.t > dstep) {
				this.t = 0;
			}
			this.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		},

		destroy : function () {
			this.setTransform(1, 0, 0, 1, 0, 0);
		}
	});
});
