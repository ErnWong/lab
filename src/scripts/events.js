define(function() {

	function EventEmitter() {}

	function getBlankObj() {
		return Object.create? Object.create(null) : {};
	}

	var proto = EventEmitter.prototype;

	proto._getEvents = function getEvents() {
		return this._events || (this._events = getBlankObj());
	}

	proto.addListener = function addListener(evt, listener) {
		var events = this._getEvents();
		(events[evt] || (events[evt] = [])).push(listener);
	}

	proto.removeListener = function removeListener(evt, listener) {
		var events = this._getEvents();
		if (!events.hasOwnProperty(evt)) return;
		var listeners = events[evt];
		listeners.splice(listeners.indexOf(listener),1);
	}

	proto.emitEvent = function emitEvent(evt, arg) {
		var events = this._getEvents(),
			listeners = events[evt], i=0;
		if (!listeners) return;
		for ( var len=listeners.length; i<len; i++ ) {
			listeners[i](arg);
		}
	}

	return EventEmitter;

});

