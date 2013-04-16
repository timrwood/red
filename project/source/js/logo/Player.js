define(function (require) {

	"use strict";

	var raf = require("rosy/polyfills/request-animation-frame"),
		$ = require('$'),
		COLORS = ['red', 'black', 'white'],
		COLOR_ARRAYS = [
			[255, 0, 0],
			[0, 0, 0],
			[255, 255, 255]
		],
		ANIMATION_TIME = 2000,
		canvases = [
			require("./canvases/Pinstripe")
		];

	return require("rosy/base/Class").extend({
		init : function () {
			this.start();
		},

		fgCanvas : null,
		bgCanvas : null,
		fgCtx : null,
		bgCtx : null,
		start : function () {
			this.last = +new Date();
			this.fgCanvas = $('#fg-canvas');
			this.bgCanvas = $('#bg-canvas');
			this.fgCtx = this.fgCanvas[0].getContext('2d');
			this.bgCtx = this.bgCanvas[0].getContext('2d');
			this.logo = $('#logo');
			this.resize();
			this.nextCanvas();
			this.tick();
		},

		fgw : 0,
		fgh : 0,
		bgw : 0,
		bgh : 0,
		resize : function () {
			this.fgw = this.logo.width();
			this.fgh = this.logo.height();
			this.bgw = $(window).width();
			this.bgh = $(window).height();
			this.fgCanvas.attr({
				width: this.fgw,
				height: this.fgh
			});
			this.bgCanvas.attr({
				width: this.bgw,
				height: this.bgh
			});
			this.bgCtx.clearRect(0, 0, this.bgw, this.bgh);
			this.fgCtx.clearRect(0, 0, this.fgw, this.fgh);
		},

		/*******************************
			Choosing a canvas
		*******************************/

		canvas : null,
		canvasIndex : 0,
		nextCanvas : function () {
			this.canvasIndex = (this.canvasIndex + 1) % canvases.length;

			var Canvas = canvases[this.canvasIndex];

			if (this.canvas) {
				this.canvas.destroy();
			}
			this.canvas = new Canvas();
			this.changeColors();
		},

		/*******************************
			Updating Canvases
		*******************************/

		time : 0,
		last : +new Date(),
		canvasTime : 0,
		tick : function () {
			var diff = +new Date() - this.last,
				canvasTime = this.canvasTime + diff,
				lastCanvasTime = this.canvasTime;
			this.last += diff;
			this.canvasTime += diff;

			if (canvasTime > ANIMATION_TIME) {
				this.nextCanvas();
				canvasTime = this.canvasTime = diff;
				lastCanvasTime = 0;
			}

			this.canvas.tick(canvasTime);
			this.canvas.drawAtTime(canvasTime);
			this.canvas.drawAtPercent(canvasTime / ANIMATION_TIME);
			this.canvas.drawFromPercentToPercent(lastCanvasTime / ANIMATION_TIME, canvasTime / ANIMATION_TIME);

			raf(this.tick);
		},

		/*******************************
			Changing Colors and Foreground
		*******************************/

		colorPhase : -1,
		isForeground : false,
		changeColors : function () {
			var classes = "",
				primary, secondary, tertiary, i;

			this.colorPhase = (this.colorPhase + 1) % 6;

			primary = 2 - (this.colorPhase % 3);
			secondary = ~~(this.colorPhase / 2);
			tertiary = ~~(((this.colorPhase + 3) % 6) / 2);

			this.isForeground = !this.isForeground;
			classes += this.isForeground ? 'is-fg bg-' : 'is-bg fg-';
			classes += COLORS[primary];

			$('body').removeClass().addClass(classes);

			if (this.isForeground) {
				this.canvas.ctx = this.fgCtx;
				this.canvas.width = this.fgw;
				this.canvas.height = this.fgh;
			} else {
				this.canvas.ctx = this.bgCtx;
				this.canvas.width = this.bgw;
				this.canvas.height = this.bgh;
			}

			for (i = 0; i < 3; i++) {
				this.canvas.primary[i] = COLOR_ARRAYS[secondary][i];
				this.canvas.secondary[i] = COLOR_ARRAYS[tertiary][i];
			}
			this.bgCtx.clearRect(0, 0, this.bgw, this.bgh);
			this.fgCtx.clearRect(0, 0, this.fgw, this.fgh);

			this.canvas.prepare();
		}
	});
});
