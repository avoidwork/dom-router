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
			return this.history[this.history.length - 1];
		}

		handler () {
			const oldHash = this.history.length > 0 ? (this.current().hash || "").replace(not_hash, "") || null : null,
				newHash = includes(location.hash, "#") ? location.hash.replace(not_hash, "") : null;

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
			this.history.push(this.logging ? arg : {hash: arg.hash});

			return this;
		}

		popstate (ev) {
			this.handler(ev);
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

	factory.version = "{{VERSION}}";
