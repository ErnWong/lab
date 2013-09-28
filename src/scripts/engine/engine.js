define(["events"], function(EventEmitter) {

	// hasOwnProperty()
	var has = (function(){
		var Has = Object.prototype.hasOwnProperty;
		return function has(obj, key) {
			Has.call(obj,key);
		}
	})();

	function Engine() {

		this.ready = false;
		this._startWhenReady = false;
		this._changesPending = {};

		this.data = {};
		this.fps = 0/0;

		this.thread = new Worker("scripts/engine/worker.js");
		var engine = this;
		this.thread.addEventListener("message", function(evt){
			engine._handleMessage(evt);
		});

	}

	// inherits EventEmitter
	var proto = Engine.prototype = new EventEmitter();

	// starts the simulation
	proto.start = function start() {
		if (!this.ready) {
			this._startWhenReady = true;
			return;
		}
		this.thread.postMessage({
			cmd: "start"
		});
	};

	// stops the simulation
	proto.stop = function stop() {
		if (!this.ready && this._startWhenReady) {
			this._startWhenReady = false;
			return;
		}
		this.thread.postMessage({
			cmd: "stop"
		});
	};

	// resets the simulation data
	proto.reset = function reset() {
		if (!this.ready) {
			var i, changes = this._changesPending;
			for ( var i in changes ) {
				if ( has(changes, i) && i.split(".")[0] === "data" ) {
					delete changes[i];
				}
			}
			return;
		}
		this.thread.postMessage({
			cmd: "reset"
		});
	};

	// sets a value in the simulation
	// e.g.
	//	set("simRate", 0.5);
	//	set("data.loc", [0,1]);
	//	set({
	//		"system": "spring",
	//		"solver": function(data){},
	//		"data": {
	//			"t": 0, "vel": [0,0]
	//		}
	//	});//
	proto.set = proto.setSetting = function set(id, value) {
		if (typeof id === "object") {
			for (var i in id) {
				if (has(id, i)) {
					this.set(i,id[i]);
				}
			}
			return;
		}
		if (!this.ready) {
			this._changesPending[id] = value;
			return;
		}
		this.thread.postMessage({
			cmd: "set",
			key: id,
			value: value
		});
	};

	// sets id-value pairs in array to simulation
	proto.setSettings = function sets(args) {
		var i = 0, len = args.length;
		for ( ; i < len; i++ ) {
			this.set( args[i].id, args[i].value );
		}
	};

	// (private) - handles a message from worker thread
	proto._handleMessage = function handleMessage(evt) {
		if (evt.data.type === "ready") {
			var changes;
			this.ready = true;
			if (this._startWhenReady) {
				this.start();
			}
			for (var i in changes) {
				if (has(changes, i)) {
					this.set(i, changes[i]);
				}
			}
			delete this._changesPending;
			return;
		}
		if (evt.data.type === "data") {
			this.data = evt.data.variables;
			this.fps = evt.data.fps;
			this.emitEvent("tick", this.data);
		}
	};

	return Engine;

});

