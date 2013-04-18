/*jshint newcap:false*/
define(function (require) {

	"use strict";

	return require("./Physics").extend({
		prepare : function () {
			this.save().setTransform(1, 0, 0, 1, 0, 0);
			this.fillStyle(this.tertiaryHex).fillRect(0, 0, this.width, this.height);
			this.restore();
			this.sup();
		},

		draw : function () {
			this.fillStyle(this.primaryHex);
			this.drawBalls();
		}
	});
});
