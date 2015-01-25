"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * URL hash to DOM router
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2015 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/dom-router/master/LICENSE>
 * @link http://avoidwork.github.io/dom-router
 * @module dom-router
 * @version 1.1.0
 */
Array.from = Array.from || function (arg) {
  return [].slice.call(arg);
};

(function (document, window) {
  var not_hash = /.*\#/;
  var time = new Date().getTime();

  var contains = function (obj, arg) {
    return obj.indexOf(arg) > -1;
  };

  var render = window.requestAnimationFrame || function (fn) {
    var offset = new Date().getTime() - time;

    setTimeout(function () {
      fn(offset);
    }, 16);
  };

  var Route = function Route(options) {
    this.hash = options.hash;
    this.element = options.element;
    this.trigger = options.trigger;
    this.timestamp = new Date().toISOString();
  };

  var route = function (arg) {
    return new Route(arg);
  };

  var Router = (function () {
    function Router() {
      this.active = true;
      this.callback = function () {};
      this.css = { current: "current", hidden: "hidden" };
      this.ctx = document.body;
      this["default"] = null;
      this.delimiter = "/";
      this.history = [];
      this.logging = false;
      this.routes = [];
      this.stop = true;
    }

    _prototypeProperties(Router, null, {
      current: {
        value: function current() {
          return this.history[0];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      hashchange: {
        value: function hashchange(ev) {
          var _this = this;
          var self = this;
          var oldHash = contains(ev.oldURL, "#") ? ev.oldURL.replace(not_hash, "") : null;
          var newHash = contains(ev.newURL, "#") ? ev.newURL.replace(not_hash, "") : null;

          if (this.active) {
            if (this.stop === true && typeof ev.preventDefault == "function") {
              ev.preventDefault();
              ev.stopPropagation();
            }

            if (!contains(this.routes, newHash)) {
              return this.route(this.routes.filter(function (i) {
                return contains(i, newHash);
              })[0] || this["default"]);
            }

            render(function () {
              var oldHashes = oldHash ? oldHash.split(self.delimiter) : [];
              var newHashes = newHash.split(self.delimiter);
              var newEl = undefined,
                  newTrigger = undefined;

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
                self.history[0].trigger.classList.remove(self.css.current);
              }

              var r = route({ element: newEl || null, hash: newHash, trigger: newTrigger || null });
              self.log(r);
              self.callback(r);
            });
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      load: {
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
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      log: {
        value: function log(arg) {
          if (this.logging) {
            this.history.unshift(arg);
          }

          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      route: {
        value: function route(arg) {
          document.location.hash = arg;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      select: {
        value: function select(arg) {
          return Array.from(this.ctx.querySelectorAll.call(this.ctx, arg));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scan: {
        value: function scan(arg) {
          this.routes = this.select("a").filter(function (i) {
            return contains(i.href, "#");
          }).map(function (i) {
            return i.href.replace(not_hash, "");
          });

          this["default"] = arg || this.routes[0];
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      sweep: {
        value: function sweep(obj, klass) {
          Array.from(obj.parentNode.childNodes).filter(function (i) {
            return i.nodeType === 1 && i.id && i.id !== obj.id;
          }).forEach(function (i) {
            i.classList.add(klass);
          }, this);

          obj.classList.remove(klass);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Router;
  })();

  var router = function (arg) {
    var r = new Router(),
        hash = document.location.hash.replace("#", "");

    var facade = function (ev) {
      r.hashchange.call(r, ev);
    };

    if ("addEventListener" in window) {
      window.addEventListener("hashchange", facade, false);
    } else {
      window.onhashchange = facade;
    }

    if (arg instanceof Object) {
      r.active = arg.active !== undefined ? arg.active === true : r.active;
      r.callback = arg.callback || r.callback;
      r.css = arg.css || r.css;
      r.ctx = arg.ctx && typeof arg.ctx.querySelectorAll == "function" ? arg.ctx : r.ctx;
      r.delimiter = arg.delimiter || r.delimiter;
      r.logging = arg.logging !== undefined ? arg.logging === true : r.logging;
      r.stop = arg.stop !== undefined ? arg.stop === true : r.stop;
    }

    r.scan(r["default"]);

    if (!(r.css.hidden in r.ctx.classList)) {
      if (hash !== "" && contains(r.routes, hash)) {
        r.hashchange({ oldURL: "", newURL: document.location.hash });
      } else {
        r.route(r["default"]);
      }
    }

    return r;
  };

  // CJS, AMD & window supported
  if (typeof exports != "undefined") {
    module.exports = router;
  } else if (typeof define == "function") {
    define(function () {
      return router;
    });
  } else {
    window.router = router;
  }
})(document, window);