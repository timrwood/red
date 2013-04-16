define(function (require) {

	"use strict";

	var triangles = [],
		COS_60 = Math.cos(Math.PI / 6),
		initial,
		ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		color = require("../Color"),
		vec4 = require("../math/vec4"),
		SRC = '/project/static/img/tesla.jpg';

	function Triangle(x, y, radius, isUp) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.up = isUp ? 1 : -1;
		triangles.push(this);
	}

	Triangle.prototype = {
		center : function () {
			return [
				~~(this.x),
				~~(this.y + this.up * this.r)
			];
		},

		right : function () {
			return [
				~~(this.x + this.r * COS_60),
				~~(this.y - this.up * this.r * 0.5)
			];
		},

		left : function () {
			return [
				~~(this.x - this.r * COS_60),
				~~(this.y - this.up * this.r * 0.5)
			];
		},

		top : function () {
			if (this.up < 0) {
				return this.y - this.r;
			}
			return this.y - this.r * 0.5;
		},

		bottom : function () {
			if (this.up > 0) {
				return this.y + this.r;
			}
			return this.y + this.r * 0.5;
		},

		_containsUp : function (x, y) {
			var top = this.y - this.r,
				bot = this.y + this.r * 0.5,
				offset = y - (Math.abs(x - this.x) * COS_60 * 2);

			if (y < top || y > bot) {
				//console.log('past top or bottom', top, '<', y, '<', bot);
				return false;
			}

			if (offset < top) {
				//console.log('past side', offset, '<', top);
				return false;
			}

			return true;
		},

		_containsDown : function (x, y) {
			var top = this.y - this.r * 0.5,
				bot = this.y + this.r,
				offset = y + (Math.abs(x - this.x) * COS_60 * 2);

			if (y < top || y > bot) {
				//console.log('past top or bottom', top, '<', y, '<', bot);
				return false;
			}
			if (offset > bot) {
				//console.log('past side', offset, '<', bot);
				return false;
			}
			return true;
		},

		contains : function (x, y) {
			return this.up < 0 ? this._containsUp(x, y) : this._containsDown(x, y);
		},

		splitAt : function (x, y) {
			var split;
			// never split something so that it is smaller than 3 pixel radius
			if (this.r < 3) {
				return;
			}
			if (!this.contains(x, y)) {
				return;
			}
			if (!this.isSplit) {
				this.divide();
				return this;
			}
			for (var i = 0; i < 4; i++) {
				split = this[i].splitAt(x, y);
				if (split) {
					return split;
				}
			}
		},

		divide : function () {
			var r = this.r * 0.5,
				up = this.up !== 1;
			this[0] = new Triangle(this.x, this.y, r, up),
			this[1] = new Triangle(this.x - r * COS_60, this.y - this.up * r * 0.5, r, !up);
			this[2] = new Triangle(this.x + r * COS_60, this.y - this.up * r * 0.5, r, !up);
			this[3] = new Triangle(this.x, this.y + this.up * r, r, !up);
			this.isSplit = true;
			return this;
		}
	};

	// preload images
	ImageCache.load(SRC);

	return require("../Canvas").extend({
		image : null,
		init : function () {
			this.image = new ImageData();
			this.image.setSrc(SRC);
			this.image.setScaleMode('cover');
			this.sup();
			this.triangleColor = vec4.create();
		},

		prepare : function () {
			this.removeTriangles();
			initial = new Triangle(this.width / 2, this.height / 2, this.width * 2);
			this.fillStyle(this.primaryHex()).fillRect(0, 0, this.width, this.height);
			this.image.setWidthAndHeight(this.width, this.height);
			this.image.rebuild();
		},

		drawAtPercent : function (p) {
			var i;
			for (i = 0; i < 5; i++) {
				this.splitTriangles();
			}
		},

		splitTriangles : function () {
			var tri = initial.splitAt(this.randXCenter(), this.randYCenter());
			if (tri) {
				this.drawTriangles(tri);
			}
		},

		drawTriangles : function (tri) {
			var i;
			if (tri.isSplit) {
				for (i = 0; i < 4; i++) {
					this.drawTriangle(tri[i]);
				}
			}
		},

		triangleColor : null,
		drawTriangle : function (tri) {
			var c = tri.center(),
				l = tri.left(),
				r = tri.right();
			this.beginPath().fillStyle(this.getTriangleHex(c, l, r, tri.x, tri.y)).strokeStyle(this.secondaryHex())
				.moveTo(~~c[0] + 0.5, ~~c[1] + 0.5)
				.lineTo(~~l[0] + 0.5, ~~l[1] + 0.5)
				.lineTo(~~r[0] + 0.5, ~~r[1] + 0.5)
				.lineTo(~~c[0] + 0.5, ~~c[1] + 0.5)
				.fill();
		},

		getTriangleHex : function (c, l, r, x, y) {
			vec4.copy(this.triangleColor, this.image.getPixelClamped(c[0], c[1]));
			vec4.lerp(this.triangleColor, this.triangleColor, this.image.getPixelClamped(l[0], l[1]), 1 / 2);
			vec4.lerp(this.triangleColor, this.triangleColor, this.image.getPixelClamped(r[0], r[1]), 1 / 3);
			vec4.lerp(this.triangleColor, this.triangleColor, this.image.getPixelClamped(x, y), 1 / 4);
			return this.gradientMapHex(this.triangleColor);
		},

		removeTriangles : function () {
			var triangle;
			while (triangles.length) {
				triangle = triangles.pop();
				triangle[0] = null;
				triangle[1] = null;
				triangle[2] = null;
				triangle[3] = null;
			}
		},

		destroy : function () {
			this.removeTriangles();
			this.sup();
		}
	});
});
