
// A simple linear-gravity with mass system

define(["config"], function(config) {

	// the gravitational acceleration
	var g = config.gravity.g;

	// getAccel():
	return function(prop) {

		// return the acceleration
		return [0, g];

	};

});

