define(["events", function(EventEmitter) {

	function Simulation() {

	}

	var proto = Simulation.prototype = new EventEmitter();

	proto.setEnvironment( div ) {
		this.environment = div;
	}

	

	return Simulation;

});

