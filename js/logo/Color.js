define(function (require) {

	"use strict";

	function componentToHex(c) {
		var hex = (~~c).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}

	function hex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function rgb(r, g, b) {
		return "rgb(" + r + ', ' + g + ', ' + b + ')';
	}

	function rgba(r, g, b, a) {
		return "rgba(" + r + ', ' + g + ', ' + b + ', ' + a + ')';
	}

	return {
		hex : hex,
		rgb : rgb,
		rgba : rgba
	};
});
