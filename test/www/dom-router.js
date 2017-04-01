"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * URL hash to DOM router
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2017
 * @license BSD-3-Clause
 * @version 1.1.2
 */
(function (document, window) {
	var not_hash = /.*\#/,
	    contains = Array.contains || function (obj, arg) {
		return obj.indexOf(arg) > -1;
	},
	    from = Array.from || function (arg) {
		return [].slice.call(arg);
	},
	    has = function has(a, b) {
		return a in b;
	},
	    time = new Date().getTime(),
	    render = window.requestAnimationFrame || function (fn) {
		setTimeout(fn(new Date().getTime() - time), 16);
	};

	var Route = function Route(cfg) {
		_classCallCheck(this, Route);

		this.hash = cfg.hash;
		this.element = cfg.element;
		this.trigger = cfg.trigger;
		this.timestamp = new Date().toISOString();
	};

	var Router = function () {
		function Router() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref$active = _ref.active,
			    active = _ref$active === undefined ? true : _ref$active,
			    _ref$callback = _ref.callback,
			    callback = _ref$callback === undefined ? function () {} : _ref$callback,
			    _ref$css = _ref.css,
			    css = _ref$css === undefined ? { current: "dr-current", hidden: "dr-hidden" } : _ref$css,
			    _ref$ctx = _ref.ctx,
			    ctx = _ref$ctx === undefined ? document.body : _ref$ctx,
			    _ref$delimiter = _ref.delimiter,
			    delimiter = _ref$delimiter === undefined ? "/" : _ref$delimiter,
			    _ref$logging = _ref.logging,
			    logging = _ref$logging === undefined ? false : _ref$logging,
			    _ref$stop = _ref.stop,
			    stop = _ref$stop === undefined ? true : _ref$stop;

			_classCallCheck(this, Router);

			this.active = active;
			this.callback = callback;
			this.css = css;
			this.ctx = ctx;
			this.default = null;
			this.delimiter = delimiter;
			this.history = [];
			this.logging = logging;
			this.routes = [];
			this.stop = stop;
		}

		_createClass(Router, [{
			key: "current",
			value: function current() {
				return this.history[0];
			}
		}, {
			key: "hashchange",
			value: function hashchange(ev) {
				var _this = this;

				var self = this,
				    oldHash = contains(ev.oldURL, "#") ? ev.oldURL.replace(not_hash, "") : null,
				    newHash = contains(ev.newURL, "#") ? ev.newURL.replace(not_hash, "") : null;

				if (this.active) {
					if (this.stop === true && typeof ev.stopPropagation === "function") {
						ev.stopPropagation();

						if (typeof ev.preventDefault === "function") {
							ev.preventDefault();
						}
					}

					if (!contains(this.routes, newHash)) {
						this.route(this.routes.filter(function (i) {
							return contains(i, newHash);
						})[0] || this.default);
					} else {
						render(function () {
							var oldHashes = oldHash ? oldHash.split(self.delimiter) : [];
							var newHashes = newHash.split(self.delimiter);
							var newEl = void 0,
							    newTrigger = void 0;

							newHashes.forEach(function (i, idx) {
								var nth = idx + 1;
								var valid = oldHashes.length >= nth;
								var oldEl = valid ? self.select("#" + oldHashes.slice(0, nth).join(" > #"))[0] : null;
								var oldTrigger = valid ? self.select("a[href='#" + oldHashes.slice(0, nth).join(self.delimiter) + "']")[0] : null;

								newEl = self.select("#" + newHashes.slice(0, nth).join(" > #"))[0];
								newTrigger = self.select("a[href='#" + newHashes.slice(0, nth).join(self.delimiter) + "']")[0];

								self.load(oldTrigger || null, oldEl || null, newTrigger || null, newEl || null);
							}, _this);

							if (self.css.current && self.history.length > 0) {
								self.history[0].triggeobj.classList.remove(self.css.current);
							}

							var r = new Route({ element: newEl || null, hash: newHash, trigger: newTrigger || null });

							self.log(r);
							self.callback(r);
						});
					}
				}
			}
		}, {
			key: "load",
			value: function load(oldTrigger, oldEl, newTrigger, newEl) {
				if (oldTrigger && this.css.current) {
					oldTrigger.classList.remove(this.css.current);
				}

				if (oldEl && oldEl.id !== newEl.id) {
					oldEl.classList.add(this.css.hidden);
				}

				if (newTrigger && this.css.current) {
					newTrigger.classList.add(this.css.current);
				}

				if (newEl) {
					this.sweep(newEl, this.css.hidden);
				}

				return this;
			}
		}, {
			key: "log",
			value: function log(arg) {
				if (this.logging) {
					this.history.unshift(arg);
				}

				return this;
			}
		}, {
			key: "route",
			value: function route(arg) {
				document.location.hash = arg;

				return this;
			}
		}, {
			key: "select",
			value: function select(arg) {
				return from(this.ctx.querySelectorAll.call(this.ctx, arg));
			}
		}, {
			key: "scan",
			value: function scan(arg) {
				this.routes = this.select("a").filter(function (i) {
					return contains(i.href, "#");
				}).map(function (i) {
					return i.href.replace(not_hash, "");
				});
				this.default = arg || this.routes[0];

				return this;
			}
		}, {
			key: "sweep",
			value: function sweep(obj, klass) {
				from(obj.parentNode.childNodes).filter(function (i) {
					return i.nodeType === 1 && i.id && i.id !== obj.id;
				}).forEach(function (i) {
					return i.classList.add(klass);
				});
				obj.classList.remove(klass);

				return this;
			}
		}]);

		return Router;
	}();

	function factory(arg) {
		var obj = new Router(arg),
		    hash = document.location.hash.replace("#", ""),
		    facade = function facade(ev) {
			return obj.hashchange.call(obj, ev);
		};

		if ("addEventListener" in window) {
			window.addEventListener("hashchange", facade, false);
		} else {
			window.onhashchange = facade;
		}

		obj.scan(obj.default);

		if (!has(obj.css.hidden, obj.ctx.classList)) {
			if (hash !== "" && contains(obj.routes, hash)) {
				obj.hashchange({ oldURL: "", newURL: document.location.hash });
			} else {
				obj.route(obj.default);
			}
		}

		return obj;
	}

	// CJS, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = factory;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		window.router = factory;
	}
})(document, window);
