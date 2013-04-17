define(function (require) {

	"use strict";

	var ImageCache = require("./ImageCache");

	return require("rosy/base/Class").extend({
		canvas : null,
		ctx : null,
		init : function () {
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
		},

		width : 0,
		height : 0,
		setWidthAndHeight : function (w, h) {
			this.width = w;
			this.height = h;
		},

		img : null,
		setSrc : function (src) {
			this.img = null;
			ImageCache.load(src, this.proxy(function (img) {
				this.img = img;
				this.rebuild();
			}));
		},

		scaleMode : "cover",
		setScaleMode : function (mode) {
			switch (mode) {
			case "cover":
			case "contain":
			case "fill":
				this.scaleMode = mode;
				this.rebuild();
				return;
			}
			throw mode + " scaling mode not supported";
		},

		rebuild : function () {
			if (!this.img || !this.width || !this.height) {
				return;
			}
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.ctx.clearRect(0, 0, this.width, this.height);
			this['rebuild_' + this.scaleMode]();
			this.pixels = this.ctx.getImageData(0, 0, this.width, this.height);
		},

		rebuild_cover : function () {
			var thisRatio = this.width / this.height,
				imgRatio  = this.img.width / this.img.height,
				x, y, w, h;
			x = y = w = h = 0;
			if (thisRatio > imgRatio) {
				// crop top and bottom
				w = this.width;
				h = w / imgRatio;
				y = (this.height - h) / 2;
			} else {
				// crop sides
				h = this.height;
				w = h * imgRatio;
				x = (this.width - w) / 2;
			}
			this.ctx.drawImage(this.img, x, y, w, h);
		},

		rebuild_contain : function () {
			var thisRatio = this.width / this.height,
				imgRatio  = this.img.width / this.img.height,
				x, y, w, h;
			x = y = w = h = 0;
			if (thisRatio > imgRatio) {
				// black bars on the sides
				h = this.height;
				w = h * imgRatio;
				x = (this.width - w) / 2;
			} else {
				// black bars on the top and bottom
				w = this.width;
				h = w / imgRatio;
				y = (this.height - h) / 2;
			}
			this.ctx.drawImage(this.img, x, y, w, h);
		},

		rebuild_fill : function () {
			this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
		},

		pixels : null,
		getPixel : function (x, y) {
			var i = ~~x,
				data = this.pixels && this.pixels.data;
			if (this.pixels) {
				i += (this.pixels.width * (~~y)) * 4;
			}
			i *= 4;
			if (!data || data.length < i + 4) {
				return [0, 0, 0, 0];
			}
			return [data[i], data[i + 1], data[i + 2], data[i + 3]];
		},

		getPixelClamped : function (x, y) {
			x = Math.min(this.width, Math.max(0, x));
			y = Math.min(this.height, Math.max(0, y));
			return this.getPixel(x, y);
		}
	});
});
