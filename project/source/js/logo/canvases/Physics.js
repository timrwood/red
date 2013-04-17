/*jshint newcap:false*/
define(function (require) {

	"use strict";

	var Box2D = require('box2d'),

		b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2MassData = Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,

		INSIDE  = require("../data/PhysicsLogoInner"),
		OUTSIDE = require("../data/PhysicsLogoOuter");

	return require("../Canvas").extend({
		world : null,
		debugDraw : null,
		init : function () {
			this.sup();
			var world = this.world = new b2World(new b2Vec2(40, 20), true),
				debugDraw = this.debugDraw = new b2DebugDraw();
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
			this.makeWalls();
			this.makeOuter();
		},

		makeOuter : function () {
			var i, j;
			for (i = 0; i < OUTSIDE.length; i++) {
				this.makeSolid(OUTSIDE[i]);
			}
		},

		makeSolid : function (p) {
			var bodyDef = new b2BodyDef(),
				fixDef = new b2FixtureDef(),
				points = [],
				i;

			for (i = 0; i < p.length; i += 2) {
				points.push(new b2Vec2(p[i], p[i + 1]));
			}

			bodyDef.type = b2Body.b2_staticBody;
			// bodyDef.type = b2Body.b2_dynamicBody;

			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.8;
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsArray(points, points.length);

			this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		},

		makeWalls : function () {
			this.makeWall(50, 54, 70, 20);
			this.makeWall(50, -20, 70, 20);
			this.makeWall(120, 17, 20, 17);
			this.makeWall(-20, 17, 20, 17);
		},

		makeWall : function (x, y, w, h) {
			var bodyDef = new b2BodyDef(),
				fixDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_staticBody;
			bodyDef.position.x = x;
			bodyDef.position.y = y;

			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsBox(w, h);

			this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		},

		prepare : function () {
			this.debugDraw.SetDrawScale(this.width / 100);
			this.debugDraw.SetSprite(this.ctx);
		},

		tick : function () {
			this.world.Step(16 / 1000, 10, 10);
		},

		draw : function () {
			this.world.DrawDebugData();
		}
	});
});
