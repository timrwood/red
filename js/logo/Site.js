define(function (require) {

	"use strict";

	var Player = require('./Player');

	return require("rosy/base/Class").extend({
		init : function () {
			this.player = new Player();
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 0);
		}
	});
});
