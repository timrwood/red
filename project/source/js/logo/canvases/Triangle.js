define(function (require) {

	"use strict";

	var tris = [],
		COS_60 = Math.cos(Math.PI / 6),
		initial;

	function Triangle(x, y, radius, isUp) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.up = isUp ? 1 : -1;
		tris.push(this);
	}

	Triangle.prototype = {
		center : function () {
			return [this.x, this.y + this.up * this.r];
		},

		right : function () {
			return [this.x + this.r * COS_60, this.y - this.up * this.r * 0.5];
		},

		left : function () {
			return [this.x - this.r * COS_60, this.y - this.up * this.r * 0.5];
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
			// never split something so that it is smaller than 3 pixel radius
			if (this.r < 3) {
				return;
			}
			if (!this.contains(x, y)) {
				return;
			}
			if (!this.isSplit) {
				return this.divide();
			}
			for (var i = 0; i < 4; i++) {
				if (this[i].splitAt(x, y)) {
					return this[i];
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

	return require("../Canvas").extend({
		prepare : function () {
			tris = [];
			initial = new Triangle(this.width / 2, this.height / 2, this.width * 2);
			this.fillStyle(this.primaryHex()).fillRect(0, 0, this.width, this.height);
		},

		draw : function () {
			var tri = initial.splitAt(this.randX(), this.randY());
			if (tri) {
				this.drawTriangle(tri);
			}
		},

		drawTriangle : function (tri) {
			console.log(tri);
			//draw(this.x, this.y, this.r);
			// var top = this.y + this.up * this.r,
			// 	bot = this.y - this.up * this.r * 0.5,
			// 	left = this.x + this.r * COS_60,
			// 	right = this.x - this.r * COS_60;

			// c.fillStyle(getHex(this.x, this.y));
			// c.beginPath();
			// c.globalAlpha(0.5);
			// c.moveTo(this.x, top);
			// c.lineTo(left, bot);
			// c.lineTo(right, bot);
			// c.fill();
		},

		destroy : function () {
			tris = [];
			this.sup();
		}
	});
});
