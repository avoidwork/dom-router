class Route {
	constructor (cfg) {
		this.hash = cfg.hash;
		this.element = cfg.element;
		this.trigger = cfg.trigger;
		this.timestamp = new Date().toISOString();
	}
}

export function route (cfg = {element: null, hash: "", trigger: null}) {
	return new Route(cfg);
}
