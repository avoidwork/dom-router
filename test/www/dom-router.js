/**
 * URL hash DOM router
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2021
 * @license BSD-3-Clause
 * @version 3.1.6
 */

"use strict";

(function (document, window) {
	const not_hash = /.*\#/,
		includes = typeof Array.includes === "function" ? (obj, arg) => obj.includes(arg) : (obj, arg) => obj.indexOf(arg) > -1,
		from = typeof Array.from === "function" ? arg => Array.from(arg) : arg => [].slice.call(arg),
		has = (a, b) => a in b,
		time = new Date().getTime(),
		render = window.requestAnimationFrame || function (fn) { setTimeout(fn(new Date().getTime() - time), 16); };

	class Route {
		constructor (cfg) {
			this.hash = cfg.hash;
			this.element = cfg.element;
			this.trigger = cfg.trigger;
			this.timestamp = new Date().toISOString();
		}
	}

	class Router {
		constructor ({active = true, callback = function () {}, css = {current: "dr-current", hidden: "dr-hidden"}, ctx = document.body, start = null, delimiter = "/", error = function () {}, logging = false, stop = true} = {}) {
			this.active = active;
			this.callback = callback;
			this.css = css;
			this.ctx = ctx;
			this.error = error;
			this.start = start;
			this.delimiter = delimiter;
			this.history = [];
			this.logging = logging;
			this.routes = [];
			this.stop = stop;
		}

		current () {
			return this.history[0];
		}

		hashchange (ev) {
			if (this.stop) {
				if ("stopPropagation" in ev && typeof ev.stopPropagation === "function") {
					ev.stopPropagation();
				}

				if ("preventDefault" in ev && typeof ev.preventDefault === "function") {
					ev.preventDefault();
				}
			}

			this.handler(ev);
		}

		handler (ev) {
			const oldHash = includes(ev.oldURL, "#") ? ev.oldURL.replace(not_hash, "") : null,
				newHash = includes(ev.newURL, "#") ? ev.newURL.replace(not_hash, "") : null;

			if (this.active && this.valid(newHash)) {
				if (!includes(this.routes, newHash)) {
					this.route(this.routes.filter(i => includes(i, newHash))[0] || this.start);
				} else {
					const y = document.body.scrollTop;

					render(() => {
						try {
							const oldHashes = oldHash ? oldHash.split(this.delimiter) : [],
								newHashes = newHash.split(this.delimiter);
							let oldRoute = "",
								newEl, newTrigger;

							// deep links
							for (const loldHash of oldHashes) {
								oldRoute += `${oldRoute.length > 0 ? `${this.delimiter}` : ""}${loldHash}`;
								this.select(`a[href="#${oldRoute}"]`).forEach(o => o.classList.remove("is-active"));
							}

							newHashes.forEach((i, idx) => {
								const nth = idx + 1,
									valid = oldHashes.length >= nth,
									oldEl = valid ? this.select(`#${oldHashes.slice(0, nth).join(" #")}`) : void 0,
									oldTrigger = valid ? this.select(`a[href='#${oldHashes.slice(0, nth).join(this.delimiter)}']`) : void 0;

								newEl = this.select(`#${newHashes.slice(0, nth).join(" #")}`);
								newTrigger = this.select(`a[href='#${newHashes.slice(0, nth).join(this.delimiter)}']`);
								this.load(oldTrigger, oldEl, newTrigger, newEl);
							}, this);

							const r = new Route({
								element: newEl,
								hash: newHash,
								trigger: newTrigger
							});

							document.body.scrollTop = y;
							this.log(r);
							this.callback(r);
						} catch (err) {
							this.error(err);
						}
					});
				}
			}
		}

		load (oldTrigger = [], oldEl = [], newTrigger = [], newEl = []) {
			if (this.css.current.length > 0) {
				if (oldTrigger.length > 0) {
					oldTrigger.forEach(i => i.classList.remove(this.css.current));
				}

				if (oldEl.length > 0 && oldEl.id !== newEl.id) {
					oldEl.forEach(i => i.classList.add(this.css.hidden));
				}

				if (newTrigger.length > 0) {
					newTrigger.forEach(i => i.classList.add(this.css.current));
				}

				if (newEl.length > 0) {
					newEl.forEach(i => this.sweep(i, this.css.hidden));
				}
			}

			return this;
		}

		log (arg) {
			if (this.logging) {
				this.history.unshift(arg);
			}

			return this;
		}

		process () {
			const hash = document.location.hash.replace("#", "");

			this.scan(this.start);

			if (!has(this.css.hidden, this.ctx.classList)) {
				if (hash.length > 0 && includes(this.routes, hash)) {
					this.handler({oldURL: "", newURL: document.location.hash});
				} else {
					this.route(this.start);
				}
			}
		}

		route (arg = "") {
			document.location.hash = arg;

			return this;
		}

		select (arg) {
			return from(this.ctx.querySelectorAll.call(this.ctx, arg));
		}

		scan (arg) {
			this.routes = Array.from(new Set(this.select("a").filter(i => includes(i.href, "#")).map(i => i.href.replace(not_hash, "")).filter(i => i !== "")));
			this.start = arg || this.routes[0] || null;

			return this;
		}

		sweep (obj, klass) {
			from(obj.parentNode.childNodes).filter(i => i.nodeType === 1 && i.id && i.id !== obj.id).forEach(i => i.classList.add(klass));
			obj.classList.remove(klass);

			return this;
		}

		valid (arg = "") {
			return arg === "" || (/=/).test(arg) === false;
		}
	}

	function factory (arg) {
		const obj = new Router(arg);

		obj.hashchange = obj.hashchange.bind(obj);

		if ("addEventListener" in window) {
			window.addEventListener("hashchange", obj.hashchange, false);
		} else {
			window.onhashchange = obj.hashchange;
		}

		if (obj.active) {
			obj.process();
		}

		return obj;
	}

	factory.version = "3.1.6";

	// CJS, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = factory;
	} else if (typeof define === "function" && define.amd !== void 0) {
		define(() => factory);
	} else {
		window.router = factory;
	}
}(document, window));
