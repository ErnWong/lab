importScripts("../require.js");

require.config( {

	paths: {
		"config": "../config"
	}

} );

require( [
	"require",
	"config",
	"systems/spring",
	"systems/gravity",
	"solvers/euler",
	"solvers/rk4merged",
	"steppers/boundary"
], function(require, config) {


	// Clones an object (without functions) effectively
	function cloneObj(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	// returns an object with id relative to base
	// e.g. with id = "foo.bar", returns base.foo.bar
	function getObj(base, id) {
		return id.length > 1 ? getObj(base[id.shift()], id) : base[id[0]];
	}

	// sets object with id relative to base with value
	// see getObj(base, id)
	function setObj(base, id, val) {
		if (id.length === 1) {
			base[id[0]] = val;
			return;
		}
		setObj(base[id.shift()], id, val);
	}

	// hasOwnProperty()
	var has = (function(){
		var Has = Object.prototype.hasOwnProperty;
		return function has(obj, key) {
			Has.call(obj,key);
		}
	})();

	/* Converts an object into map (allows functions) */
	function createHash(data) {
		var out = Object.create? Object.create(null) : {}, i;
		for ( i in data ) {
			if (data.hasOwnProperty(i)) {
				out[i] = data[i];
			}
		}
		return out;
	}
	//*/

	// Variables:
	var
		// The data to work on (e.g. it could contain x-y position, and time)
		data = cloneObj(config.initData),

		// The initial data which data resets to
		dataInit = cloneObj(data),



	// Physical Systems
		systems = {

			// A simple spring - mass system
			"spring": require("systems/spring"),

			// A simple linear-gravity with mass system
			"gravity": require("systems/gravity")

		},
		// The current physical system
		getAccel = systems[config.system],



	// Numerical 2nd order diff eq solvers
		solvers = {

			// The Euler Method
			"euler": require("solvers/euler"),

			// The Runge-Kutta Method: RK4
			// according to https://www.youtube.com/watch?v=smfX0Jt_f0I
			"rk4merged": require("solvers/rk4merged")

		},
		// The current colver
		solveStep = solvers[config.solver],



	// Functions which provide the "step" in the simulation
		steppers = {

			"boundary": require("steppers/boundary")

		},
		step = steppers[config.stepper];



	// Timer vars:

		// # of steps to perform each tick
		simStep = config.simulation.simStep,
		// a new value to change to
		simStepNew = simStep,

		// # of simulation seconds every real second
		simRate = config.simulation.simRate,
		simRateNew = simRate,

		// update-needed flag to allow updating step/rate when available
		varNeedUpdate = false,

		// Just a variable to keep track of the previous
		// time stamp. This is to calculate time steps
		prevTime = 0,

		// stop flag: stops the loop in tick()
		_stop = false,

		// Frames per second (not really used)
		fps = 0/0;

	// Command functions:
		commands = {
			"start": start,
			"stop": stop,
			"close": function () {
				self.close();
			},
			"reset": reset,
			"set": set,
			"get": get
		},
		setItems = {
			"solver": function(val) {
				switch (typeof val) {
					case "string":
						solvers[val] && (solveStep = solvers[val]);
						break;
					case "function":
						solveStep = val;
						brea;
				}
			},
			"system": function(val) {
				switch (typeof val) {
					case "string":
						systems[val] && (getAccel = systems[val]);
						break;
					case "function":
						getAccel = val;
				}
			},
			"simStep": function(val) {
				if (typeof val !== "number") {
					return;
				}
				simStepNew = val;
				varNeedUpdate = true;
			},
			"simRate": function(rate) {
				if (typeof val !== "number") {
					return;
				}
				simRateNew = rate;
				varNeedUpdate = true;
			},
			"data": function(value) {
				if (typeof val !== "object") {
					return;
				}
				data = cloneObj(value);
			},
			"dataInit": function(value) {
				if (typeof val !== "object") {
					return;
				}
				//data = cloneObj(value);
				dataInit = cloneObj(value);
			}
		};


	/* Convert objects to "hashes" */
	systems = createHash(systems);
	solvers = createHash(solvers);
	steppers = createHash(steppers);
	commands = createHash(commands);
	setItems = createHash(setItems);
	//*/

	// get(arg)
	function get(arg) {
		//TODO
		throw "caint get anything yet until implemented";
	}

	// set() - Sets a particular value
	function set(arg) {	// TODO: very similar to onmessage handler. merge?
		var key = arg.key,
			id,
			value = arg.value,
			keyStart;
		if (!key) return;
		if (typeof key === "string") {

			id = key.split(".");

			if (has(setItems, key)) {
				setItems[key](value);
			} else if ((keyStart = id.shift()) === "data") {
				setObj(data,id,cloneObj(value));
				//data[key] = cloneObj(value);
			} else if (keyStart === "dataInit") {
				setObj(dataInit,id,cloneObj(value));
				//dataInit[key] = cloneObj(value);
			}

		} else if (typeof key.length === "number") {
			for (var i=0, len = key.length, ckey; i<len; i++) {
				ckey = key[i];
				id = ckey.split(".");
				if (has(setItems, ckey)) {
					setItems[ckey](value);
				} else if ((keyStart=id.shift()) === "data") {
					setObj(data,id,cloneObj(value));
					//data[ckey] = cloneObj(value);
				} else if (keyStart === "dataInit") {
					setObj(dataInit,id,cloneObj(value));
					//dataInit[ckey] = cloneObj(value);
				}
			}
		} else if (typeof value === "object") {
			for (var i in value) {
				if (has(value, i)) {
					set(i,value[i]);
				}
			}
		}
	}

	// reset() - Resets data with dataInit
	function reset() {
		data = cloneObj(dataInit);
	}

	// start() - starts the simulation
	function start() {
		prevTime = Date.now();
		_stop = false;
		setTimeout(tick,0);
	}

	// stop() - stops the simulation
	function stop() {
		_stop = true;
	}



	// publishes the changes back to the worker spawner
	function publishChanges() {
		self.postMessage({
			"type": "data",
			"fps": fps,
			"variables": data
		});
	}

	// onmessage - handle commands to worker
	self.addEventListener("message", function(evt) {

		// cmd: a string or array of strings specifying the command to take
		var data = evt.data, cmd = data.cmd;

		// if cmd doesn't exist return as we can't do much about it
		if (!cmd) return;

		// if cmd is string, just call command if it exists
		if (typeof cmd === "string" && has(commands, cmd)) {
			commands[cmd](data);
		} else
		// else if it looks like array, loop through and exec
		if (typeof cmd.length === "number") {

			for (var i=0, len = cmd.length; i<len; i++) {
				has(commands, cmd[i]) && commands[cmd[i]](data);
			}

		}

	});



	// tick()
	function tick() {

		if (varNeedUpdate) updateTimerVars();

		// return and do nothing if the stop flag is held true
		if (_stop) return;

		// self explanatory
		var i = 0,
			currentTime = Date.now(),
			dt = (currentTime - prevTime) * simRate / simStep / 1000;
		for ( ; i < simStep; i++ ) {
			step(dt, data, solveStep, getAccel);
		}
		prevTime = currentTime;
		fps = simRate/dt;
		publishChanges();
		setTimeout(tick,0);

	}

	// update the simulation-rate/step variables
	function updateTimerVars() {
		simRate = simRateNew;
		simStep = simStepNew;
		varNeedUpdate = false;
	}

	self.postMessage({
		type: "ready"
	});

});

