define({

	// The method to use to solve the
	// second order diff equation:
	"solver": "euler",

	// The system to use:
	"system": "spring",

	"stepper": "boundary",

	// settings for Spring
	"spring": {
		// spring constant
		"k": 1,
		// spring rest length
		"l": 1,
		// spring positions
		"sx": -0.5,
		"sy": 0
	},

	// settings for Gravity
	"gravity": {
		"g": -6
	},

	// initial data
	"initData": {
		"t": 0,
		"loc": [0, 0],
		"vel": [0, 0],
		"m": 1
	},

	// boundaries
	"boundaries": {
		"lower": [-3,-2],
		"upper": [3,2]
	},

	// default simulation settings
	"simulation": {

		// Simulation rate:
		// - simulation seconds per real second
		"simRate": 1,

		// Simulation steps per tick:
		"simStep": 100

	},

	// default display settings
	"display": {

		// Scale:
		//  - displayed pixels per unit
		"scale": [100,100],

		// Origin (0,0):
		// - pixels
		"origin": [400,300]

	}

});

