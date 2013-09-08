define(["config"], function(config) {

	var bMin = config.boundaries.lower,
		bMax = config.boundaries.upper;

	// what to do each simulation step
	function step(dt, data, solveStep, system) {

		// compute the changes
		var changes = solveStep(dt,data,system);

		// Update t
		data.t = changes.t;

		/* Boundaries (not the best choice though) */
			changes = fixBoundary(changes.loc, changes.vel, bMin, bMax);
			data.loc = changes.loc;
			data.vel = changes.vel;
		//*/

	}

	// computes corrections for perfectly elastic boundaries (rect. wall)
	function fixBoundary(loc, vel, lower, upper) {

		var
			// holds the current boundaries in which loc is over
			boundaryX, boundaryY,

			// cache x and y from loc array ("vector")
			x = loc[0], y = loc[1],

			// cache velocities x and y fron vel array
			vx = vel[0], vy = vel[1],

			// cache the lower bounds of the boundary in the coordinates
			xl = lower[0], yl = lower[1],
			// cache the upper bounds
			xu = upper[0], yu = upper[1];

		// loop while loc is still outstide boundary
		while (boundaryX !== false && boundaryY !== false) {

			// if previously outside boundary in x direction
			if (boundaryX !== false) {

				// test and find which boundary it is outside
				boundaryX = findBoundary(x, xl, xu);

				// if there is still outside,
				if (boundaryX !== false) {
					// invert about boundary and reverse velocity
					x = boundaryResolveLoc(x, boundaryX);
					vx *= -1;
				}
			}
			// if outside boundary in y direction
			if (boundaryY !== false) {

				// test and find which boundary
				boundaryY = findBoundary(y, yl, yu);

				// if still outside
				if (boundaryY !== false) {

					// do inversions
					y = boundaryResolveLoc(y,boundaryY);
					vy *= -1;
				}
			}

		}

		// return the resulting velocities after corrections
		return {
			loc: [x,y],
			vel: [vx,vy]
		};

	}

	// swaps the x around bx ("inversion about bx")
	function boundaryResolveLoc( x, bx ) {
		return 2*bx - x;
	}

	// returns the boundary (lower or upper) which x is outside of,
	// or else returns false
	function findBoundary( x, lower, upper ) {
		return x < lower? lower : x > upper? upper : false;
	}

	return step;

});
