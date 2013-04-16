define(function (require) {

	"use strict";

	var getset = 'fillStyle font globalAlpha globalCompositeOperation lineCap lineDashOffset lineJoin lineWidth miterLimit shadowBlur shadowColor shadowOffsetX shadowOffsetY strokeStyle textAlign textBaseline'.split(' '),
		proxy = 'createImageData createLinearGradient createPattern createRadialGradient getImageData getLineDash isPointInPath isPointInStroke measureText'.split(' '),
		proxyChainable = 'arc arcTo beginPath bezierCurveTo clearRect clearShadow clip closePath drawImage drawImageFromRect fill fillRect fillText lineTo moveTo putImageData quadraticCurveTo rect restore rotate save scale setLineDash setTransform stroke strokeRect strokeText transform translate'.split(' '),
		methods, i,
		color = require("./Color"),
		vec4 = require("./math/vec4");

	methods = {
		init : function () {
			this.primary = vec4.create();
			this.secondary = vec4.create();
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
			return color.hex.apply(color, this.primary);
		},

		secondaryHex : function () {
			return color.hex.apply(color, this.secondary);
		},

		primaryRgba : function (alpha) {
			return color.rgba(this.primary[0], this.primary[1], this.primary[2], alpha);
		},

		secondaryRgba : function (alpha) {
			return color.rgba(this.secondary[0], this.secondary[1], this.secondary[2], alpha);
		},

		gradientMap : function (c) {
			var primaryLength = vec4.sqrLen(this.primary),
				secondaryLength = vec4.sqrLen(this.secondary),
				light = this.primary,
				dark = this.secondary,
				percent;

			percent = (c[0] + c[1] + c[2]) / (256 * 3);

			if (primaryLength > secondaryLength) {
				light = this.secondary;
				dark = this.primary;
			}

			return vec4.lerp([], light, dark, percent);
		},

		gradientMapHex : function (c) {
			return color.hex.apply(color, this.gradientMap(c));
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

		randXCenter : function () {
			var r = ((Math.random() * 2) - 1) * Math.random(),
				half = this.width / 2;
			return half + (half * r);
		},

		randYCenter : function () {
			var r = ((Math.random() * 2) - 1) * Math.random(),
				half = this.height / 2;
			return half + (half * r);
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
