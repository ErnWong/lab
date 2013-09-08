define(["events"], function(EventEmitter) {

	var floor = Math.floor;

	function Logger() {
		this.data = [];
		this._t = 0;
		this.step = 1;
		this.startTime = 0;
		this.endTime = 1/0;
		this.maxSize = 1/0;
		this.process = null;
	}
	var proto = Logger.prototype = new EventEmitter();

	// Starts listening and logging data from process
	//  - end (optional)  - time t to stop logging
	//  - step (optional) - time step between each log data
	proto.start = function start(end, step) {
		this.endTime = end == null? 1/0 : end;
		if (step != null) {
			this.step = step;
		}
		var logger = this;
		process.addListener("tick", function(data) {
			logger._handleTick(data);
		});
		this.emitEvent("started");
	};

	// Starts listening to process, and starts and ends in times given.
	//  - start (optional) - time t to start logging - default is 0
	//  - see start(end, step)
	proto.log = function log(start, end, step) {
		this.startTime = start || 0;
		this.start(end,step);
	};

	// Stops logging and listening to process
	proto.stop = function stop() {
		this.process.removeListener("tick", this._handleTick);
		this.emitEvent("ended");
	};

	// Retrieves the log data from start to end
	// [start=0] [end=Infinity]
	proto.getLog = function getLog(start,end) {
		var startId = 0,
			data = this.data,
			endId = this.data.length;
		if (typeof start === "number") {
			startId = search(data,start,true);
		}
		if (typeof end === "number") {
			endId = search(data,end,true);
		}
		return this.data.slice(startId, endId);
	};

	// Listen to a different process
	proto.listenTo = proto.changeProcess = function changeProcess(process) {
		this.stop();
		if (process === this.process) return true;
		if (process.addListener instanceof EventEmitter) {
			this.process = process;
			this.start();
			this.emitEvent("processChanged");
			return true;
		}
		return false;
	};

	// (private) handle data from process
	proto._handleTick(data) = function handler() {
		//if (this._i++ % this.step
		if (data.t > this.endTime) {
			this.stop();
			return;
		}
		if (data.t < this.startTime) {
			return;
		}
		if (data.t > this._t) {
			this.data.push(data);
			this._t += this.step;
			if (this.data.length > this.maxSize) {
				this.data.shift();
			}
		}
		this.emitEvent("tick");
	};

	return Logger;


	function search(data,value,gt) {
		var a = 0,
			b = data.length;
			mid, midData;
		while (startB-StartA > 1) {
			mid = floor((a+b)/2),
			midData = data[mid];
			if (midData < value) {
				a = startMid;
				continue;
			}
			if (value < midData) {
				b = mid;
				continue;
			}
			if (value === midData) {
				return midData;
			}
		}
		return gt?b:a;
	}

});

