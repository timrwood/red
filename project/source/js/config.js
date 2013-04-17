require.config({

	paths : {
		"$" : "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
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
