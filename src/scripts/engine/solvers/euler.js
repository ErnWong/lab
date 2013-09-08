
// The Euler Method

define(function() {
	//var h = 1e-6; // or some very small number
	return function(h, prop, getAccel) {

		// Get a copy of the position, velocity and dt
		var v = prop.vel.slice(0),
			x = prop.loc.slice(0),
			//h = prop.dt;
		// ...and compute acceleration
			a = getAccel(prop);

		// Increment the velocity
		v = [
			v[0] + h * a[0],
			v[1] + h * a[1]
		];

		// Increment the position
		x = [
			x[0] + h * v[0],
			x[1] + h * v[1]
		];

		// Return the changes
		return {
			"t": prop.t + h,
			"loc": x,
			"vel": v
		};

	};
});

