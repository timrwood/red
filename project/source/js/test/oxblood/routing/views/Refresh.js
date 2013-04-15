define(

	[
		"./Page",
		"$"
	],

	function (Page, $) {

		"use strict";

		return Page.extend({

			hasUpdated : false,

			load : function () {
				this.sup();
			},

			update : function (argument) {
				this.hasUpdated = true; // this function should not run
				this.sup();
			},

			transitionIn : function () {
				this.sup();
			},

			transitionOut : function () {
				this.sup();
			},

			destroy : function () {
				this.sup();
			}
		});
	}
);
