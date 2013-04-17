define(function (require) {

	"use strict";

	return require("../Canvas").extend({
		prepare : function () {
			this.fillStyle(this.primaryHex()).strokeStyle(this.secondaryHex());
		},

		drawAtPercent : function (t) {
			var i;

			this.fillRect(0, 0, this.width, this.height);

			this.lineWidth(1);

			for (i = 0; i < 20; i ++) {
				this.strokeStyle(this.secondaryRgba(i / 20));
				this.drawLine((5 + i) / 25, t * 1.0, 1.7, 3.9);
				this.drawLine((5 + i) / 25, t * 0.2, 5.7, 2.1);
				this.drawLine((5 + i) / 25, t * 0.5, 9.7, 3.1);
			}

			this.lineWidth(1);
		},

		drawLine : function (p, t, c, a) {
			var j,
				h = this.height / 2,
				mag = (this.width / 8) * p;
			this.beginPath().moveTo(0, h);
			for (j = -40; j < this.width + 40; j += 10) {
				this.lineTo(j, h + this.getY(j / this.width, t, c, a) * mag);
			}
			this.stroke();
		},

		sin : function (x) {
			return Math.sin(x * Math.PI);
		},

		getY : function (x, t, c, a) {
			var y = this.sin(x);
			y *= this.sin(x + t * c);
			y *= this.sin(x * a);
			return y;
		}
	});
});
