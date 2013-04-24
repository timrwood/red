require.config({

	paths : {
		"$" : "libs/jquery",
		"box2d" : "libs/box2dweb"
	},

	waitSeconds : 15,

	shim : {
		"$" : {
			exports : "jQuery"
		},

		"box2d" : {
			exports : "Box2D"
		}
	}
});
