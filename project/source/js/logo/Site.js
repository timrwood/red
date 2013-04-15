define(

	[
		"rosy/base/Class",
		"rosy/views/ViewManager",
		"./config/routes"
	],

	function (Class, ViewManager, routes) {

		"use strict";

		var Site = Class.extend({

			initialized : false,

			initialize : function () {

				if (!this.initialized) {

					ViewManager.initialize({
						// fallbackMode			:	hard|soft|hash,
						// selectors			:	Array,
						// bubble				:	true|false,
						// container			:	String|DOMElement,
						// defaultRoute			:	String,
						// activeClass			:	String,
						// disabledClass		:	String,
						// TransitionManager	:	Class,
						aliases : routes.aliases,
						viewGroups : routes.viewGroups
					});

					this.initialized = true;
				}
			}
		});

		return new Site();
	}
);
