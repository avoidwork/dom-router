/**
 * URL hash to DOM router
 *
 * @param {Object} arg Descriptor
 * @constructor
 */
function Router ( arg ) {
	this.active = arg.active !== undefined ? ( arg.active === true ) : true;
	this.callback = arg.callback || null;
	this.css = arg.css || {active: "active", hidden: "hidden"};
	this.ctx = arg.ctx || $("body")[0];
	this["default"] = arg["default"] || null;
	this.history = [];
	this.log = arg.log !== undefined ? ( arg.log === true ) : false;
	this.routes = [];
	this.selector = arg.selector || null;
	this.stop = arg.stop !== undefined ? ( arg.stop === true ) : true;
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
	var oldHash = ev.oldURL.indexOf( "#" ) > -1 ? ev.oldURL.replace( NOTHASH, "" ) : null,
		newHash = ev.newURL.indexOf( "#" ) > -1 ? ev.newURL.replace( NOTHASH, "" ) : null,
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
	var r = new Router( arg ),
		hash = document.location.hash.replace( "#", "" );

	// Adding hook
	window.addEventListener( "hashchange", r.hashchange, false );

	// Setting routes
	r.routes = $( r.ctx + " a" ).filter( function ( a ) {
		return contains( a.href, "#" );
	} ).map( function ( a ) {
		return a.href.replace( NOTHASH, "" );
	} );

	if ( r["default"] === null ) {
		r["default"] = r.routes[0];
	}

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
