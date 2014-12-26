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
	NOTHASH = /.*\#/;

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
 * @param {Object} arg Descriptor
 * @constructor
 */
function Router ( arg ) {
	this.active = arg.active !== undefined ? ( arg.active === true ) : true;
	this.callback = arg.callback || null;
	this.ctx = arg.ctx || $("body")[0];
	this.history = [];
	this.log = arg.log !== undefined ? ( arg.log === true ) : false;
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
 * Router factory
 *
 * @param  {Object} arg Descriptor
 * @return {Object} Router
 */
function router ( arg ) {
	return new Router( arg );
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
