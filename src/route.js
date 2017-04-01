	class Route {
		constructor (cfg) {
			this.hash = cfg.hash;
			this.element = cfg.element;
			this.trigger = cfg.trigger;
			this.timestamp = new Date().toISOString();
		}
	}
