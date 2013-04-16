define(function (require) {

	"use strict";

	var getset = 'fillStyle font globalAlpha globalCompositeOperation lineCap lineDashOffset lineJoin lineWidth miterLimit shadowBlur shadowColor shadowOffsetX shadowOffsetY strokeStyle textAlign textBaseline'.split(' '),
		proxy = 'createImageData createLinearGradient createPattern createRadialGradient getImageData getLineDash isPointInPath isPointInStroke measureText'.split(' '),
		proxyChainable = 'arc arcTo beginPath bezierCurveTo clearRect clearShadow clip closePath drawImage drawImageFromRect fill fillRect fillText lineTo moveTo putImageData quadraticCurveTo rect restore rotate save scale setLineDash setTransform stroke strokeRect strokeText transform translate'.split(' '),
		methods, i,
		color = require("./Color");

	methods = {
		init : function () {
			this.primary = [0, 0, 0, 0];
			this.secondary = [0, 0, 0, 0];
		},

		destroy : function () {

		},

		width : 0,
		height : 0,

		/*******************************
			Color
		*******************************/

		primary : null,
		secondary : null,
		primaryHex : function () {
			return color.hex(this.primary[0], this.primary[1], this.primary[2]);
		},

		secondaryHex : function () {
			return color.hex(this.secondary[0], this.secondary[1], this.secondary[2]);
		},

		primaryRgba : function (alpha) {
			return color.rgba(this.primary[0], this.primary[1], this.primary[2], alpha);
		},

		secondaryRgba : function (alpha) {
			return color.rgba(this.secondary[0], this.secondary[1], this.secondary[2], alpha);
		},

		/*******************************
			Tick
		*******************************/

		prepare : function () {

		},

		/*******************************
			Random
		*******************************/

		randX : function () {
			return Math.random() * this.width;
		},

		randY : function () {
			return Math.random() * this.height;
		},

		/*******************************
			Tick
		*******************************/

		tick : function (ms) {

		},

		draw : function () {

		},

		drawAtTime : function (ms) {

		},

		drawAtPercent : function (a) {

		},

		drawFromPercentToPercent : function (a, b) {

		}
	};

	function makeGetterSetter(name) {
		methods[name] = function (a) {
			if (a !== null) {
				this.ctx[name] = a;
				return this;
			} else {
				return this.ctx[name];
			}
		};
	}

	function makeProxy(name) {
		methods[name] = function () {
			return this.ctx[name].apply(this.ctx, arguments);
		};
	}

	function makeProxyChainable(name) {
		methods[name] = function () {
			this.ctx[name].apply(this.ctx, arguments);
			return this;
		};
	}

	for (i = 0; i < getset.length; i++) {
		makeGetterSetter(getset[i]);
	}

	for (i = 0; i < proxy.length; i++) {
		makeProxy(proxy[i]);
	}

	for (i = 0; i < proxyChainable.length; i++) {
		makeProxyChainable(proxyChainable[i]);
	}

	return require("rosy/base/Class").extend(methods);
});
