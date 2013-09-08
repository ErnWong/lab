
// A simple spring - mass system

define(["config"], function (config) {

	var
		// spring constant
		k = config.spring.k,
		// spring rest length
		l = config.spring.l,
		// spring positions
		sx =  config.spring.sx,
		sy =  config.spring.sy;

		// Cache the square root function
		msqrt = Math.sqrt;

	// Cache the pythagorus-theorem function
	function mLength(x,y) {
		return msqrt(x*x+y*y);
	}

	// getAccel():
	return function(prop) {

		var
			// get the delta positions
			dx = prop.loc[0]-sx,
			dy = prop.loc[1]-sy,
			// the distance / length of
			// stretched spring
			r = mLength(dx,dy),
			// the unit "vector"
			ex = dx/r,
			ey = dy/r,

			// Compute the acceleration
			accel = k * (l - r) / prop.m;

		// return the acceleration as vector
		return [
			accel * ex,
			accel * ey
		];
	};

});

