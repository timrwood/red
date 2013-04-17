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
			this.image.setWidthAndHeight(this.width, this.height);
			this.image.rebuild();
		},

		drawAtPercent : function (t) {
			var size = Math.sqrt(Math.max(9, 1000 - 3000 * t)),
				count = 5 + t * 500,
				i = -1;
			while (++i < count) {
				this.drawCircle(size);
			}
		},

		drawCircle : function (r) {
			var x = this.randXCenter(),
				y = this.randY();
			this.fillStyle(this.gradientMapHex(this.image.getPixelClamped(x, y)));
			this.beginPath().moveTo(x, y);
			this.arc(x, y, r, 0, Math.PI * 2).fill();
		}
	});
});
