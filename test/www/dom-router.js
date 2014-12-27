/**
 * URL hash to DOM router
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2014 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/dom-router/master/LICENSE>
 * @link http://avoidwork.github.io/dom-router
 * @module dom-router
 * @version 1.0.0
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
	this.css = null;
	this.ctx = null;
	this[ "default" ] = null;
	this.delimiter = null;
	this.history = [];
	this.log = false;
	this.routes = [];
	this.select = null;
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
	var oldHash = contains( ev.oldURL, "#" ) ? ev.oldURL.replace( not_hash, "" ) : null,
		newHash = contains( ev.newURL, "#" ) ? ev.newURL.replace( not_hash, "" ) : null;

	if ( this.active && ( oldHash ? contains( this.routes, oldHash ) : true ) && ( newHash ? contains( this.routes, newHash ) : false ) ) {
		if ( this.stop === true ) {
			ev.preventDefault();
			ev.stopPropagation();
		}

		render( function () {
			var oldHashes = oldHash.split( this.delimiter ),
				newHashes = newHash.split( this.delimiter ),
				r, newEl, newTrigger;

			newHashes.forEach( function ( i, idx ) {
				var nth = idx + 1,
					valid = oldHashes.length >= nth,
					oldEl = valid ? this.select( "#" + oldHashes.slice( 0, nth ).join( " > #") )[0] : null,
					oldTrigger = valid ? this.select( "a[href='#" + oldHashes.slice( 0, nth ).join( this.delimiter ) + "']" )[0] : null;

				newEl = this.select( "#" + newHashes.slice( 0, nth ).join( " > #") )[0];
				newTrigger = this.select( "a[href='#" + newHashes.slice( 0, nth ).join( this.delimiter ) + "']" )[0];

				this.load( oldTrigger || null, oldEl || null, newTrigger || null, newEl || null );
			}, this );

			if ( this.css.current && this.history.length > 0 ) {
				this.history[0 ].trigger.classList.remove( this.css.current );
			}

			r = route( { element: newEl || null, hash: newHash, trigger: newTrigger || null } );

			if ( this.log === true ) {
				this.history.unshift( r );
			}

			if ( this.callback !== null ) {
				this.callback( r );
			}
		}.bind( this ) );
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
		[].slice.call( newEl.parentNode.childNodes ).filter( function ( i ){
			return i.nodeType === 1 && i.id && i.id !== newEl.id;
		} ).forEach( function ( i ) {
			i.classList.add( this.css.hidden );
		}, this );
		newEl.classList.remove( this.css.hidden );
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
 * Router factory
 *
 * @param  {Object} arg Descriptor
 * @return {Object} Router
 */
function router ( arg ) {
	var r = new Router(),
		hash = document.location.hash.replace( "#", "" ),
		a, t;

	// Adding hook
	if ( typeof window.addEventListener == "function" ) {
		window.addEventListener( "hashchange", r.hashchange.bind( r ), false );
	}
	else {
		window.onhashchange = r.hashchange.bind( r );
	}

	// Setting properties
	r.active = arg.active !== undefined ? ( arg.active === true ) : true;
	r.callback = arg.callback || null;
	r.css = arg.css || { current: "current", hidden: "hidden" };
	r.ctx = arg.ctx && typeof arg.ctx.querySelectorAll == "function" ? arg.ctx : document.body;
	r.delimiter = arg.delimiter || "/";
	r.log = arg.log !== undefined ? ( arg.log === true ) : false;
	r.select = r.ctx.querySelectorAll.bind( r.ctx );
	r.stop = arg.stop !== undefined ? ( arg.stop === true ) : true;

	r.routes = [].slice.call( r.select( "a" ) ).filter( function ( i ) {
		return contains( i.href, "#" );
	} ).map( function ( i ) {
		return i.href.replace( not_hash, "" );
	} );

	r[ "default" ] = arg[ "default" ] || r.routes[ 0 ];

	// Setting state
	if ( !( r.css.hidden in r.ctx.classList ) ) {
		if ( hash !== "" && contains( r.routes, hash ) ) {
			t = r.select( "#" + hash )[ 0 ];
			if ( t ) {
				t.classList.remove( r.css.hidden );
			}

			if ( r.css.current ) {
				a = r.select( "a[href='#" + hash + "']" )[ 0 ];
				if ( a ) {
					a.classList.add( r.css.current );
				}
			}
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
