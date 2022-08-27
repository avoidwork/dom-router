'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cssCurrent = "dr-current";
const cssHidden = "dr-hidden";
const delimiter = "/";
const empty = "";
const hash = "#";
const notHash = /.*\#/;
const render = window.requestAnimationFrame;
const selectorHasHash = "a[href=*'#']";

class Route {
	constructor (cfg) {
		this.hash = cfg.hash;
		this.element = cfg.element;
		this.trigger = cfg.trigger;
		this.timestamp = new Date().toISOString();
	}
}

function route (cfg = {element: null, hash: "", trigger: null}) {
	return new Route(cfg);
}

class Router {
	constructor ({active = true, callback = function () {}, css = {current: cssCurrent, hidden: cssHidden}, ctx = document.body, start = null, delimiter: delimiter$1 = delimiter, logging = false, stickyPos = true, stickyRoute = true, stop = true, storage = "session", storageKey = "lastRoute"} = {}) {
		this.active = active;
		this.callback = callback;
		this.css = css;
		this.ctx = ctx;
		this.delimiter = delimiter$1;
		this.history = [];
		this.logging = logging;
		this.routes = [];
		this.stickyPos = stickyPos;
		this.stickyRoute = stickyRoute;
		this.storage = storage === "session" ? sessionStorage : localStorage;
		this.storageKey = storageKey;
		this.stop = stop;
		this.start = this.stickyRoute ? this.storage.getItem(this.storageKey) || start : start;
	}

	current () {
		return this.history[this.history.length - 1];
	}

	handler () {
		const oldHash = this.history.length > 0 ? (this.current().hash || empty).replace(notHash, empty) || null : null,
			newHash = location.hash.includes(hash) ? location.hash.replace(notHash, empty) : null;

		if (this.active && this.valid(newHash)) {
			if (!this.routes.includes(newHash)) {
				this.route(this.routes.filter(i => i.includes(newHash))[0] || this.start);
			} else {
				const y = document.body.scrollTop,
					oldHashes = oldHash ? oldHash.split(this.delimiter) : [],
					newHashes = newHash.split(this.delimiter),
					remove = [];
				let oldRoute = empty;

				for (const loldHash of oldHashes) {
					oldRoute += `${oldRoute.length > 0 ? `${this.delimiter}` : empty}${loldHash}`;
					remove.push(...this.select(`a[href="#${oldRoute}"]`));
				}

				render(() => {
					let newEl, newTrigger;

					for (const i of remove) {
						i.classList.remove(this.css.current);
					}

					for (const idx of newHashes.keys()) {
						const nth = idx + 1,
							valid = oldHashes.length >= nth,
							oldEl = valid ? this.select(`#${oldHashes.slice(0, nth).join(" #")}`) : void 0,
							oldTrigger = valid ? this.select(`a[href='#${oldHashes.slice(0, nth).join(this.delimiter)}']`) : void 0;

						newEl = this.select(`#${newHashes.slice(0, nth).join(" #")}`);
						newTrigger = this.select(`a[href='#${newHashes.slice(0, nth).join(this.delimiter)}']`);
						this.load(oldTrigger, oldEl, newTrigger, newEl);
					}

					if (this.stickyRoute) {
						this.storage.setItem(this.storageKey, newHash);
					}

					if (this.stickyPos) {
						document.body.scrollTop = y;
					}

					const r = route({
						element: newEl,
						hash: newHash,
						trigger: newTrigger
					});

					this.log(r);
					this.callback(r);
				});
			}
		}

		return this;
	}

	load (oldTrigger = [], oldEl = [], newTrigger = [], newEl = []) {
		for (const i of oldTrigger) {
			i.classList.remove(this.css.current);
		}

		if (oldEl.length > 0 && oldEl.id !== newEl.id) {
			for (const i of oldEl) {
				i.classList.add(this.css.hidden);
			}
		}

		for (const i of newTrigger) {
			i.classList.add(this.css.current);
		}

		if (oldEl.length > 0 && oldEl.id !== newEl.id) {
			for (const i of oldEl) {
				i.classList.add(this.css.hidden);
			}
		}

		return this;
	}

	log (arg) {
		this.history.push(this.logging ? arg : {hash: arg.hash});

		return this;
	}

	popstate (ev) {
		this.handler(ev);

		return this;
	}

	process () {
		const lhash = document.location.hash.replace(hash, empty);

		this.scan(this.start);

		if (!this.ctx.classList.contains(this.css.hidden)) {
			if (lhash.length > 0 && this.routes.includes(lhash)) {
				this.handler();
			} else {
				this.route(this.start);
			}
		}

		return this;
	}

	route (arg = empty) {
		document.location.hash = arg;

		return this;
	}

	select (arg) {
		return Array.from(this.ctx.querySelectorAll.call(this.ctx, arg)).filter(i => i !== null);
	}

	scan (arg = empty) {
		this.routes = Array.from(new Set(this.select(selectorHasHash).map(i => i.href.replace(notHash, empty)).filter(i => i !== empty)));

		if (arg.length > 0) {
			this.routes.push(arg);
			this.routes = Array.from(new Set(this.routes));
		}

		this.start = arg || this.routes[0] || null;

		return this;
	}

	sweep (obj, klass) {
		render(() => {
			Array.from(obj.parentNode.childNodes).filter(i => i.nodeType === 1 && i.id && i.id !== obj.id).forEach(i => i.classList.add(klass));
			obj.classList.remove(klass);
		});

		return this;
	}

	valid (arg = empty) {
		return arg === empty || (/=/).test(arg) === false;
	}
}

function router (arg) {
	const obj = new Router(arg);

	obj.popstate = obj.popstate.bind(obj);

	if ("addEventListener" in window) {
		window.addEventListener("popstate", obj.popstate, false);
	} else {
		window.onpopstate = obj.popstate;
	}

	if (obj.active) {
		obj.process();
	}

	return obj;
}

exports.router = router;