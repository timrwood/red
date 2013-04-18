define(function (require) {

	"use strict";

	var ImageCache = require("rosy/base/Class").extend({
		init : function () {
			this.src = {};
			this.loaded = {};
		},

		src : null,
		loaded : null,

		load : function (src, cb) {
			var img,
				start = Date.now();
			if (!this.src[src]) {
				// console.log('new image');
				this.src[src] = this.loadImage(src, cb);
			}
			// console.log('trying to load');
			if (!this.loaded[src]) {
				this.on('load_' + src, this.proxy(function () {
					// console.log('onloaded', start - Date.now());
					if (typeof cb === "function") {
						cb(this.loaded[src]);
					}
				}));
			} else {
				// console.log('loaded', start - Date.now());
				if (typeof cb === "function") {
					cb(this.loaded[src]);
				}
			}
		},

		loadImage : function (src) {
			var img = new Image();
			img.onload = this.proxy(function () {
				this.loaded[src] = img;
				this.trigger('load_' + src);
			});
			img.src = src;
			return img;
		}
	});

	return new ImageCache();
});
