define(function (require) {
	"use strict";

	var $ = require('$'),
		vec2 = require("../math/vec2"),
		Path;

	Path = require("rosy/base/Class").extend({

		init : function () {
			this.R = $("#R")[0];
			this.E = $("#E")[0];
			this.D = $("#D")[0];
			this.lengthR = this.R.getTotalLength();
			this.lengthE = this.E.getTotalLength();
			this.lengthD = this.D.getTotalLength();
			this.length = this.lengthR + this.lengthE + this.lengthD;

			this.leftV = vec2.create(),
			this.rightV = vec2.create(),

			this.sup();
		},

		point : function (percent) {
			var tri = percent * 3;
			if (tri < 1) {
				return this._point(tri, this.R, this.lengthR);
			} else if (tri < 2) {
				return this._point(tri - 1, this.E, this.lengthE);
			}
			return this._point(tri - 2, this.D, this.lengthD);
		},

		_pointAt : function (percent, path, length, offset) {
			var len = (percent * length + length + (offset || 0)) % length,
				point = path.getPointAtLength(len);
			return [point.x, point.y];
		},

		_point : function (percent, path, length) {
			var point = this._pointAt(percent, path, length);
			point[0] /= 100;
			point[1] /= 34.132;
			return point;
		},

		normal : function (percent, negate) {
			var tri = percent * 3;
			if (tri < 1) {
				return this._normal(tri, this.R, this.lengthR, negate);
			} else if (tri < 2) {
				return this._normal(tri - 1, this.E, this.lengthE, negate);
			}
			return this._normal(tri - 2, this.D, this.lengthD, negate);
		},

		_normal : function (percent, path, length, negate) {
			var point = this._pointAt(percent, path, length),
				pointL = this._pointAt(percent, path, length, 1),
				pointR = this._pointAt(percent, path, length, -1),
				leftV = this.leftV,
				rightV = this.rightV,
				t;

			vec2.subtract(leftV, point, pointL);
			vec2.subtract(rightV, point, pointR);

			t = leftV[0];
			leftV[0] = leftV[1];
			leftV[1] = -t;

			t = rightV[0];
			rightV[0] = -rightV[1];
			rightV[1] = t;

			vec2.normalize(leftV, leftV);
			vec2.normalize(rightV, rightV);

			vec2.add(leftV, rightV, leftV);
			vec2.normalize(leftV, leftV);

			if (negate) {
				vec2.negate(leftV, leftV);
			}

			return leftV;
		}
	});
	return new Path();
});
