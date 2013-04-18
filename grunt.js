/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		cwd = process.cwd();

	// Project configuration.
	grunt.initConfig({
		meta: {
			projectName: "logo",
			projectTitle: "RED Canvas Logo"
		}
	});

	// Robin tasks
	// Load your custom tasks *after* these
	(function () {
		var fs = require("fs");

		var dir = path.join(cwd, ".robyn"),
			files = grunt.file.expand(path.join(dir, "*"));

		if (!files.length) {
			var d = dir.replace(cwd + "/", "");

			var warn = [
				"%s is not yet initialized".replace("%s", d),
				"Run `git submodule update --init .robyn`",
				"Then try this command again."
			].join("\n       ").trim();

			grunt.fail.warn(warn);
		}

		var robynPkg = require(path.join(dir, "package.json")),
			tasks = path.join(dir, robynPkg.config.dirs.tasks),
			helpers = path.join(tasks, "helpers");

		grunt.loadTasks(tasks);
		grunt.loadTasks(helpers);

		// Customize path in robyn.json
		var pkg = require(path.join(cwd, "robyn.json")),
			local = path.join(cwd, pkg.config.dirs.tasks);

		if (fs.existsSync(local)) {
			grunt.loadTasks(local);
		}
	}());

	grunt.config.set("compass.dev", {
		http_path: "",
		sass_dir: "scss/project",
		css_dir: "css",
		additional_import_paths: ["scss/caboose"]
	});
	grunt.config.set("compass.prod", {
		http_path: "<config:compass.dev.http_path>",
		sass_dir: "<config:compass.dev.sass_dir>",
		css_dir: "<config:compass.dev.css_dir>",
		additional_import_paths: "<config:compass.dev.additional_import_paths>"
	});
	grunt.config.set("modernizr", {
		devFile : "js/libs/modernizr.js",
		outputFile : "js/libs/modernizr.min.js"
	});

};
