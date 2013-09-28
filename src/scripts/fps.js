define(["events"], function(EventEmitter) {

	function FPS() {
		this.value = 0/0;
		this.interval = 30;
		this.framesPerTick =  1;
		this.count = 0;
		this.next = 0;
		this.process = null;
		this.listening = false;
		this._handler = function(){};
	}

	var proto = FPS.prototype = new EventEmitter();

	proto.startLog = function start(process) {
		if (this.listening || ! (process instanceof EventEmitter)) {
			return false;
		}
		this.process = process;
		this.next = Date.now() + this.interval;
		var self = this;
		this._handler = function handler(e) {
			self._handleTick(e);
		}
		process.addListener("tick", handler);
	};

	proto._handleTick = function handleTick() {
		var time = Date.now();
		if (time > this.next) {
			this.value = this.framesPerTick * this.count / (time - this.next);
			this.count = 0;
			this.next += this.interval;
		}
		this.count++;
	};

	proto.endLog = function end() {
		this.process.removeEventListener(this.handler);
	};

	proto.get = proto.valueOf = function valueOf() {
		return this.value;
	}

	return FPS;

});

