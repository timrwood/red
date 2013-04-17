define(function (require) {

	"use strict";

	var ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		SRC = '/project/static/img/tesla.jpg';

	// preload images
	ImageCache.load(SRC);

	return require("../Canvas").extend({
		image : null,
		init : function () {
			this.image = new ImageData();
			this.image.setSrc(SRC);
			this.image.setScaleMode('cover');
			this.sup();
		},

		prepare : function () {
			this.fillStyle(this.primaryHex()).fillRect(0, 0, this.width, this.height);
		},

		drawAtPercent : function (t) {
			var size = Math.max(4, 300 - 600 * t),
				count = 5 + t * 15,
				i = -1;
			while (++i < count) {
				this.drawCircle(size);
			}
		},

		drawCircle : function (r) {
			var x = this.randXCenter(),
				y = this.randY(),
				pixel = this.image.getPixelClamped(x, y),
				grad = this.createRadialGradient(x, y, r * 0.5, x, y, r);
			grad.addColorStop(0, this.gradientMapHex(pixel));
			grad.addColorStop(1, this.gradientMapRgba(pixel, 0));
			this.fillStyle(this.gradientMapHex(pixel)).beginPath().moveTo(x, y);
			this.arc(x, y, r, 0, Math.PI * 2).fill();
		}
	});
});
