define(function() {
	//var h = 1e-6, hr = h/2;
	return function(h, prop, getAccel) {

		var 
			t1 = prop.t,
			//t2,t3,t4,
			x1 = prop.loc.slice(0),
			x2,x3,x4,
			v1 = prop.vel.slice(0),
			v2,v3,v4,
			dx, dx1, dx2, dx3, dx4,
			dv, dv1, dv2, dv3, dv4,
			a;//, h = prop.dt;

	// 1.

		dx1 = [
			h * v1[0],
			h * v1[1]
		];
		a = getAccel(prop);
		dv1 = [
			h * a[0],
			h * a[1]
		];

	// 2.

		x2 = [
			x1[0] + dx1[0]/2,
			x1[1] + dx1[1]/2
		];
		v2 = [
			v1[0] + dv1[0]/2,
			v1[1] + dv1[1]/2
		];
		prop.t = t1 + h/2;

		dx2 = [
			h * v2[0],
			h * v2[1]
		];

		prop.loc = x2;
		prop.vel = v2;
		a = getAccel(prop);

		dv2 = [
			h * a[0],
			h * a[1]
		];

	// 3.

		x3 = [
			x1[0] + dx2[0]/2,
			x1[1] + dx2[1]/2
		];
		v3 = [
			v1[0] + dv2[0]/2,
			v1[1] + dv2[1]/2
		];
		//prop.t = t1 + h/2;

		dx3 = [
			h * v3[0],
			h * v3[1]
		];

		prop.loc = x3;
		prop.vel = v3;
		a = getAccel(prop);

		dv3 = [
			h * a[0],
			h * a[1]
		];

	// 4.

		x4 = [
			x1[0] + dx3[0],
			x1[1] + dx3[1]
		];
		v4 = [
			v1[0] + dv3[0],
			v1[1] + dv3[1]
		];
		prop.t = t1 + h;

		dx4 = [
			h * v4[0],
			h * v4[1]
		];

		prop.loc = x4;
		prop.vel = v4;
		a = getAccel(prop);

		dv4 = [
			h * a[0],
			h * a[1]
		];

	// AVERAGE

		dx = [
			(dx1[0] + 2*dx2[0] + 2*dx3[0] + dx4[0]) / 6,
			(dx1[1] + 2*dx2[1] + 2*dx3[1] + dx4[1]) / 6
		];
		dv = [
			(dv1[0] + 2*dv2[0] + 2*dv3[0] + dv4[0]) / 6,
			(dv1[1] + 2*dv2[1] + 2*dv3[1] + dv4[1]) / 6
		];

		// reset the properties once we're done with tinkering with it
		prop.t = t1;
		prop.loc = x1;
		prop.vel = v1;

		return {
			"t": t1 + h,
			"loc": [
				x1[0] + dx[0],
				x1[1] + dx[1]
			],
			"vel": [
				v1[0] + dv[0],
				v1[1] + dv[1]
			]
		};

	};
});

