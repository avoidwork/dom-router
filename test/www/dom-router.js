/**
 * URL hash to DOM router
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2014 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/dom-router/master/LICENSE>
 * @link http://avoidwork.github.io/dom-router
 * @module dom-router
 * @version 1.0.2
 */
( function ( document, window ) {
"use strict";

var not_hash = /.*\#/,
	time = new Date().getTime(),
	render;

render = window.requestAnimationFrame || function ( fn ) {
	var offset = new Date().getTime() - time;

	setTimeout( function () {
		fn( offset );
	}, 16 );
};

/**
 * Determines if `arg` is in `obj`
 *
 * @method contains
 * @param  {Mixed} obj Object to inspect
 * @param  {Mixed} arg Value to find
 * @return {Boolean}   `true` if found
 */
function contains ( obj, arg ) {
	return obj.indexOf( arg ) > -1;
}

/**
 * Route
 *
 * @param {Object} arg Descriptor
 * @constructor
 */
function Route ( arg ) {
	this.hash = arg.hash;
	this.element = arg.element;
	this.trigger = arg.trigger;
	this.timestamp = new Date().toISOString();
}

/**
 * Route factory
 *
 * @method route
 * @param  {Object} arg Descriptor
 * @return {Object}     Route
 */
function route ( arg ) {
	return new Route( arg );
}

/**
 * URL hash to DOM router
 *
 * @constructor
 */
function Router () {
	this.active = true;
	this.callback = null;
	this.css = { current: "current", hidden: "hidden" };
	this.ctx = document.body;
	this[ "default" ] = null;
	this.delimiter = "/";
	this.history = [];
	this.log = false;
	this.routes = [];
	this.stop = true;
}

/**
 * Setting constructor loop
 *
 * @type {Object}
 */
Router.prototype.constructor = Router;

/**
 * Returns the current route descriptor
 *
 * @method current
 * @return {Object} Route descriptor
 */
Router.prototype.current = function () {
	return this.history[ 0 ];
};

/**
 * Hash change handler
 *
 * @method hashchange
 * @param  {Object} Event
 * @return {Undefined} undefined
 */
Router.prototype.hashchange = function ( ev ) {
	var self = this,
		oldHash = contains( ev.oldURL, "#" ) ? ev.oldURL.replace( not_hash, "" ) : null,
		newHash = contains( ev.newURL, "#" ) ? ev.newURL.replace( not_hash, "" ) : null;

	if ( this.active ) {
		if ( this.stop === true && typeof ev.preventDefault == "function" ) {
			ev.preventDefault();
			ev.stopPropagation();
		}

		// Invalid route, looking for a suitable alternative with a fallback to 'default'
		if ( !contains( this.routes, newHash ) ) {
			return this.route( this.routes.filter( function ( i ) {
				return contains(i, newHash );
			} )[0] || this["default"] );
		}

		render( function () {
			var oldHashes = oldHash ? oldHash.split( self.delimiter ) : [],
				newHashes = newHash.split( self.delimiter ),
				r, newEl, newTrigger;

			newHashes.forEach( function ( i, idx ) {
				var nth = idx + 1,
					valid = oldHashes.length >= nth,
					oldEl = valid ? self.select( "#" + oldHashes.slice( 0, nth ).join( " > #" ) )[ 0 ] : null,
					oldTrigger = valid ? self.select( "a[href='#" + oldHashes.slice( 0, nth ).join( self.delimiter ) + "']" )[ 0 ] : null;

				newEl = self.select( "#" + newHashes.slice( 0, nth ).join( " > #" ) )[ 0 ];
				newTrigger = self.select( "a[href='#" + newHashes.slice( 0, nth ).join( self.delimiter ) + "']" )[ 0 ];

				self.load( oldTrigger || null, oldEl || null, newTrigger || null, newEl || null );
			}, this );

			if ( self.css.current && self.history.length > 0 ) {
				self.history[ 0 ].trigger.classList.remove( self.css.current );
			}

			r = route( { element: newEl || null, hash: newHash, trigger: newTrigger || null } );

			if ( self.log === true ) {
				self.history.unshift( r );
			}

			if ( self.callback !== null ) {
				self.callback( r );
			}
		} );
	}
};

/**
 * Loads a route
 *
 * @method load
 * @param  {Object} arg Route descriptor
 * @return {Object}     Router
 */
Router.prototype.load = function ( oldTrigger, oldEl, newTrigger, newEl ) {
	if ( oldTrigger && this.css.current ) {
		oldTrigger.classList.remove( this.css.current );
	}

	if ( oldEl && oldEl.id !== newEl.id ) {
		oldEl.classList.add( this.css.hidden );
	}

	if ( newTrigger && this.css.current ) {
		newTrigger.classList.add( this.css.current );
	}

	if ( newEl ) {
		this.sweep( newEl, this.css.hidden );
	}

	return this;
};

/**
 * Sets the route
 *
 * @method route
 * @param  {String} arg Route to set
 * @return {Object}     Router
 */
Router.prototype.route = function ( arg ) {
	document.location.hash = arg;
	return this;
};

/**
 * Makes a context specific DOM query
 *
 * @method select
 * @param  {String} arg CSS selector
 * @return {Array}      Array of matching nodes
 */
Router.prototype.select = function ( arg ) {
	return [].slice.call( this.ctx.querySelectorAll.call( this.ctx, arg ) );
};

/**
 * Scans the DOM for routes
 *
 * @method scan
 * @param  {String} arg Default route
 * @return {Object}     Router
 */
Router.prototype.scan = function ( arg ) {
	this.routes = this.select( "a" ).filter( function ( i ) {
		return contains( i.href, "#" );
	} ).map( function ( i ) {
		return i.href.replace( not_hash, "" );
	} );

	this[ "default" ] = arg || this.routes[ 0 ];
	return this;
};

/**
 * Sweeps the surrounding nodes and toggles a class
 *
 * @method sweep
 * @param  {Object} obj
 * @param  {String} klass
 * @return {Object} Router
 */
Router.prototype.sweep = function ( obj, klass ) {
	[].slice.call( obj.parentNode.childNodes ).filter( function ( i ) {
		return i.nodeType === 1 && i.id && i.id !== obj.id;
	} ).forEach( function ( i ) {
		i.classList.add( klass );
	}, this );

	obj.classList.remove( klass );
	return this;
};

/**
 * Router factory
 *
 * @param  {Object} arg Descriptor
 * @return {Object} Router
 */
function router ( arg ) {
	var r = new Router(),
		hash = document.location.hash.replace( "#", "" );

	// Adding hook
	window.addEventListener( "hashchange", function ( ev ) {
		r.hashchange.call( r, ev );
	}, false );

	// Setting properties
	if ( arg instanceof Object ) {
		r.active = arg.active !== undefined ? ( arg.active === true ) : r.active;
		r.callback = arg.callback || r.callback;
		r.css = arg.css || r.css;
		r.ctx = arg.ctx && typeof arg.ctx.querySelectorAll == "function" ? arg.ctx : r.ctx;
		r.delimiter = arg.delimiter || r.delimiter;
		r.log = arg.log !== undefined ? ( arg.log === true ) : false;
		r.stop = arg.stop !== undefined ? ( arg.stop === true ) : true;
	}

	// Scanning for routes
	r.scan( r[ "default" ] );

	// Setting state
	if ( !( r.css.hidden in r.ctx.classList ) ) {
		if ( hash !== "" && contains( r.routes, hash ) ) {
			r.hashchange( {oldURL: "", newURL: document.location.hash} );
		}
		else {
			r.route( r[ "default" ] );
		}
	}

	return r;
}

// CJS, AMD & window supported
if ( typeof exports != "undefined" ) {
	module.exports = router;
}
else if ( typeof define == "function" ) {
	define( function () {
		return router;
	} );
}
else {
	window.router = router;
}
} )( document, window );
