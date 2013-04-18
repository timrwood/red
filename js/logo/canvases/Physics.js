/*jshint newcap:false*/
define(function (require) {

	"use strict";

	var Box2D = require('box2d'),

		b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,

		world = new b2World(new b2Vec2(0, 0), true),
		debugDraw = new b2DebugDraw(),
		solids = [],
		balls = [],

		INSIDE  = require("../data/PhysicsLogoInner"),
		OUTSIDE = require("../data/PhysicsLogoOuter");

	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

	return require("../Canvas").extend({
		world : null,
		debugDraw : null,
		init : function () {
			this.sup();
		},

		/***********************************
			Logo Shape
		***********************************/

		clearSolids : function () {
			while (solids.length) {
				world.DestroyBody(solids.pop());
			}
		},

		clearBalls : function () {
			while (balls.length) {
				world.DestroyBody(balls.pop());
			}
		},

		makeOuter : function () {
			var i, j;
			for (i = 0; i < OUTSIDE.length; i++) {
				this.makeSolid(OUTSIDE[i]);
			}
		},

		makeInner : function () {
			var i, j;
			for (i = 0; i < INSIDE.length; i++) {
				this.makeSolid(INSIDE[i]);
			}
		},

		makeSolid : function (p) {
			var bodyDef = new b2BodyDef(),
				body,
				i;

			bodyDef.type = b2Body.b2_staticBody;
			body = world.CreateBody(bodyDef);
			solids.push(body);

			for (i = 0; i < p.length; i ++) {
				body.CreateFixture(this.makeFixture(p[i]));
			}
		},

		makeFixture : function (p) {
			var fixDef = new b2FixtureDef(),
				points = [],
				i;

			for (i = 0; i < p.length; i += 2) {
				points.push(new b2Vec2(p[i], p[i + 1]));
			}

			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsArray(points, points.length);

			return fixDef;
		},

		makeWallsOuter : function () {
			this.makeWall(50, 54, 70, 20);
			this.makeWall(50, -20, 70, 20);
			this.makeWall(120, 17, 20, 17);
			this.makeWall(-20, 17, 20, 17);
		},

		makeWallsInner : function () {
			var rw = this.fgw / 50,
				rh = this.fgh / 17,
				p = 1,
				w = 50,
				h = 17,
				x = (this.bgw - this.fgw) / rw,
				y = (this.bgh - this.fgh) / rh;
			this.makeWall(50,           34 + y + p,  50 + x + p, p);
			this.makeWall(-(x + p),     17,          p,          34 + y);
			this.makeWall(50,           -(y + p),    50 + x + p, p);
			this.makeWall(100 + x + p,  17,          p,          34 + y);
		},

		makeWall : function (x, y, w, h) {
			var bodyDef = new b2BodyDef(),
				body,
				fixDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_staticBody;
			bodyDef.position.x = x;
			bodyDef.position.y = y;

			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsBox(w, h);

			body = world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);
			solids.push(body);
		},

		/***********************************
			Balls
		***********************************/

		makeBalls : function () {
			var i;
			for (i = 0; i < 100; i++) {
				this.makeBall(Math.random() * 100, Math.random() * 34, 0.5 + Math.random());
			}
		},

		makeBall : function (x, y, r) {
			var bodyDef = new b2BodyDef(),
				body,
				fixDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			bodyDef.position.x = x;
			bodyDef.position.y = y;

			fixDef.density = 1.0;
			fixDef.friction = 0.1;
			fixDef.restitution = 0.7;
			fixDef.shape = new b2CircleShape(r);

			body = world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);
			body.radius = r;
			balls.push(body);
		},

		drawBalls : function () {
			var i;
			for (i = 0; i < balls.length; i++) {
				this.drawBall(balls[i]);
			}
		},

		drawBall : function (body) {
			var pos = body.GetWorldCenter(),
				ratio = this.fgw / 100,
				r = body.radius * ratio,
				x = pos.x * ratio,
				y = pos.y * ratio;
			this.beginPath().moveTo(x, y);
			this.arc(x, y, r, 0, Math.PI * 2).fill();
		},

		/***********************************
			Prep / Destroy
		***********************************/

		prepare : function () {
			var x = (this.bgw - this.fgw) / 2,
				y = (this.bgh - this.fgh) / 2;
			debugDraw.SetDrawScale(this.fgw / 100);
			debugDraw.SetSprite(this.ctx);
			this.clearSolids();
			if (this.isForeground) {
				this.setTransform(1, 0, 0, 1, 0, 0);
				this.makeOuter();
				this.makeWallsOuter();
			} else {
				this.setTransform(1, 0, 0, 1, x, y);
				this.makeInner();
				this.makeWallsInner();
			}
			this.clearBalls();
			this.makeBalls();
		},

		destroy : function () {
			this.setTransform(1, 0, 0, 1, 0, 0);
		},

		/***********************************
			Tick
		***********************************/

		tick : function () {
			world.Step(16 / 1000, 10, 10);
		},

		drawAtPercent : function (p) {
			var r = Math.PI * 2 * p;
			world.SetGravity(new b2Vec2(Math.sin(r) * 100, Math.cos(r) * 100));
		},

		draw : function () {
			this.save().setTransform(1, 0, 0, 1, 0, 0);
			this.fillStyle(this.primaryRgba(0.4));
			this.fillRect(0, 0, this.width, this.height);
			this.restore();
			// world.DrawDebugData();
			this.fillStyle(this.secondaryHex);
			this.drawBalls();
		}
	});
});
