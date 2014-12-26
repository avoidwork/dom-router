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

var $ = document.querySelectorAll.bind( document ),
	not_hash = /.*\#/,
	time = new Date().getTime(),
	render;

render = window.requestAnimationFrame || function ( fn ) {
	var offset = new Date().getTime() - time;

	setTimeout( function () {
		fn( offset );
	}, 16 );
};

/**
 * Determines if `arg` is in Array `obj`
 *
 * @method contains
 * @param  {Array} obj Array to inspect
 * @param  {Mixed} arg Value to find
 * @return {Boolean}   `true` if found
 */
function contains ( obj, arg ) {
	return obj.indexOf( arg ) > -1;
}

function Route ( arg ) {
	this.hash = arg.hash;
	this.element = arg.element;
}

function route ( arg ) {
	return new Route( arg );
}

/**
 * URL hash to DOM router
 *
 * @constructor
 */
function Router () {
	this.active = null;
	this.callback = null;
	this.css = {active: "active", hidden: "hidden"};
	this.ctx = null;
	this["default"] = null;
	this.history = [];
	this.log = false;
	this.routes = [];
	this.selector = null;
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
	return this.history[0];
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
		newHash = contains( ev.newURL, "#" ) ? ev.newURL.replace( not_hash, "" ) : null,
		$oldEl, $newEl, $oldItem, $newItem, r;

	if ( ( oldHash ? contains( this.routes, oldHash ) : true ) && ( newHash ? contains( this.routes, newHash ) : false ) ) {
		$oldEl = oldHash ? $( this.ctx + " #" + oldHash )[ 0 ] : null;
		$newEl = newHash ? $( this.ctx + " #" + newHash )[ 0 ] : null;
		$oldItem = oldHash ? $( this.ctx + " a[href='#" + oldHash + "']" )[ 0 ] : null;
		$newItem = newHash ? $( this.ctx + " a[href='#" + newHash + "']" )[ 0 ] : null;
		r = route( { element: $newEl, hash: newHash } );

		if ( this.stop === true ) {
			ev.preventDefault();
			ev.stopPropagation();
		}

		render( function () {
			if ( $oldItem && $oldEl ) {
				$oldItem.parentNode.classList.remove( this.css.active );
				$oldEl.classList.add( this.css.hidden );
			}

			if ( $newItem && $newEl ) {
				$newItem.parentNode.classList.add( this.css.active );
				$newEl.classList.remove( this.css.hidden );
			}
			else if ( this[ "default" ] ) {
				this.route( this["default"] );
			}

			if ( this.log === true ) {
				this.history.unshift( r );
			}

			if ( this.callback !== null ) {
				this.callback( r );
			}
		} );
	}
};

/**
 * Sets the route
 *
 * @method route
 * @param  {String} arg Route to set
 * @return {Object} Router
 * @todo make this smarter, such that it can be nested within another router automatically
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
		hash = document.location.hash.replace( "#", "" );

	// Adding hook
	window.addEventListener( "hashchange", r.hashchange, false );

	// Setting properties
	r.active = arg.active !== undefined ? ( arg.active === true ) : true;
	r.callback = arg.callback || null;
	r.ctx = arg.ctx || $("body")[0];
	r.log = arg.log !== undefined ? ( arg.log === true ) : false;
	r.selector = arg.selector || null; // forgot what this was for :(
	r.stop = arg.stop !== undefined ? ( arg.stop === true ) : true;

	if ( arg.css ) {
		r.css = { active: "active", hidden: "hidden" };
	}

	r.routes = $( r.ctx + " a" ).filter( function ( a ) {
		return contains( a.href, "#" );
	} ).map( function ( a ) {
		return a.href.replace( not_hash, "" );
	} );

	r["default"] = arg["default"] || r.routes[0];

	// Setting state
	if ( !r.ctx.classList.hasClass( r.css.hidden ) ) {
		if ( hash !== "" && contains( r.routes, hash ) ) {
			$( r.ctx + " #" + hash )[0].classList.remove( r.css.hidden );

			if ( r.css.active ) {
				$( r.ctx + " a[href='#" + hash + "']" )[ 0 ].classList.add( r.css.active );
			}
		}
		else {
			r.route( r["default"] );
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
