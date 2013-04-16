define(function (require) {

	"use strict";

	var ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		SRC = '/project/static/img/test.jpg';

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
			this.image.setWidthAndHeight(this.width, this.height);
			this.image.ctx = this.ctx;
			this.image.rebuild();
		},

		draw : function () {
		}
	});
});
