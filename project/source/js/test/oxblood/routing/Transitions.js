define(

	[
		"OxBlood",
		"rosy/base/Class",
		"rosy/views/ViewManager",
		"rosy/views/ViewNotification",
		"./routes"
	],

	function (OxBlood, Class, ViewManager, ViewNotification, routes) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		var transitions = {

			sync : [
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete",
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete"
			],

			async : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionOut",
				"transitionInComplete",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			],

			preload : [
				"load",
				"loadComplete",
				"transitionOut",
				"transitionOutComplete",
				"transitionIn",
				"transitionInComplete",
				"cleanup",
				"cleanupComplete"
			],

			reverse : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete",
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			]
		};

		var mappings = {
			"load"                  : ViewNotification.VIEW_LOAD_STARTED,
			"transitionIn"          : ViewNotification.VIEW_IN_STARTED,
			"transitionOut"         : ViewNotification.VIEW_OUT_STARTED,
			"cleanup"               : ViewNotification.VIEW_CLEANUP_STARTED,
			"loadComplete"          : ViewNotification.VIEW_LOAD_COMPLETED,
			"transitionInComplete"  : ViewNotification.VIEW_IN_COMPLETED,
			"transitionOutComplete" : ViewNotification.VIEW_OUT_COMPLETED,
			"cleanupComplete"       : ViewNotification.VIEW_CLEANUP_COMPLETED
		};


		var viewMappings = {
			"load"                  : "new-view",
			"transitionIn"          : "new-view",
			"transitionOut"         : "old-view",
			"cleanup"               : "old-view",
			"loadComplete"          : "new-view",
			"transitionInComplete"  : "new-view",
			"transitionOutComplete" : "old-view",
			"cleanupComplete"       : "old-view"
		};

		var positions = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth"];


		return function () {

			describe("Transitions", function () {

				before(function (done) {
					ViewManager.getViewGroup("main").config.useHistory = false;
					ViewManager.changeRoute("/test1", "sync", done);
				});

				for (var transition in transitions) {
					testTransition(transition);
				}

				testTransitionRefresh();
			});

			function testTransition(name) {

				var i,
					steps = [],
					subscriber,
					transition = transitions[name];

				function testTransitionStep(i) {
					it("should call " + transition[i] + " " + positions[i], function (done) {
						expect(steps[i]).to.equal(transition[i]);
						done();
					});
				}

				function subscribeToStep(m) {
					subscriber.subscribe(mappings[m], function (n) {
						steps.push(m);
						subscriber.unsubscribe(mappings[m]);
					});
				}

				describe(name, function () {

					before(function (done) {

						subscriber = new Class();

						for (var m in mappings) {
							subscribeToStep(m);
						}

						ViewManager.changeRoute("/transition/" + name,  name, function () {
							done();
						});
					});

					after(function (done) {
						steps = [];
						subscriber.unsubscribe();
						subscriber.destroy();
						done();
					});

					for (i = 0; i < transition.length; i ++) {
						testTransitionStep(i);
					}
				});
			}

			function testTransitionRefresh() {
				var i,
					steps = [],
					subscriber,
					views = {
						"new-view" : null,
						"old-view" : null
					}; // original view

				describe("on-refresh", function () {

					before(function (done) {
						ViewManager.changeRoute("/refresh/a", "sync", function () {
							views["old-view"] = ViewManager.getViewGroup("main").currentView,
							subscriber = new Class();

							for (var m in mappings) {
								subscribeToStep(m);
							}

							ViewManager.changeRoute("/refresh/b", "sync", function () {
								views["new-view"] = ViewManager.getViewGroup("main").currentView;
								done();
							});
						});
					});

					after(function (done) {
						subscriber.unsubscribe();
						subscriber.destroy();
						done();
					});

					function subscribeToStep(m) {
						subscriber.subscribe(mappings[m], function (n, obj) {
							steps[m] = {
								view : obj.view,
								type : viewMappings[m]
							};
							// some views need to be views["old-view"] and others need to be views["new-view"]
							subscriber.unsubscribe(mappings[m]);
						});
					}

					function testViewAssociation(trans) {
						it("should call " + trans + " on view associated to " + viewMappings[trans], function (done) {
							expect(steps[trans].view).to.equal(views[steps[trans].type]);
							done();
						});
					}

					it("should create new instances of the same View when 'refreshing' matched routes", function (done) {
						expect(views["new-view"]).to.not.equal(views["old-view"]);
						expect(views["new-view"].prototype).to.equal(views["old-view"].prototype); // same Class but new instance
						done();
					});


					for (var m in mappings) {
						testViewAssociation(m);
					}
				});
			}

		};
	}
);
