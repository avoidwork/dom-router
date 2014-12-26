/**
 * URL hash to DOM router
 *
 * @constructor
 */
function Router () {
	this.active = true;
	this.callback = null;
	this.css = {active: "active", hidden: "hidden"};
	this.ctx = null;
	this["default"] = null;
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

	if ( this.active && ( oldHash ? contains( this.routes, oldHash ) : true ) && ( newHash ? contains( this.routes, newHash ) : false ) ) {
		$oldEl = oldHash ? this.select( "#" + oldHash )[ 0 ] : null;
		$newEl = newHash ? this.select( "#" + newHash )[ 0 ] : null;
		$oldItem = oldHash ? this.select( "a[href='#" + oldHash + "']" )[ 0 ] : null;
		$newItem = newHash ? this.select( "a[href='#" + newHash + "']" )[ 0 ] : null;
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
		}.bind( this ) );
	}
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
	window.addEventListener( "hashchange", r.hashchange.bind( r ), false );

	// Setting properties
	r.active = arg.active !== undefined ? ( arg.active === true ) : true;
	r.callback = arg.callback || null;
	r.ctx = arg.ctx && typeof arg.ctx.querySelectorAll == "function" ? arg.ctx : document.body;
	r.log = arg.log !== undefined ? ( arg.log === true ) : false;
	r.select = r.ctx.querySelectorAll.bind( r.ctx );
	r.stop = arg.stop !== undefined ? ( arg.stop === true ) : true;

	if ( arg.css ) {
		r.css = { active: "active", hidden: "hidden" };
	}

	r.routes = [].slice.call( r.select( "a" ) ).filter( function ( i ) {
		return contains( i.href, "#" );
	} ).map( function ( i ) {
		return i.href.replace( not_hash, "" );
	} );

	r["default"] = arg["default"] || r.routes[0];

	// Setting state
	if ( !( r.css.hidden in r.ctx.classList ) ) {
		if ( hash !== "" && contains( r.routes, hash ) ) {
			t = r.select( "#" + hash )[0];
			if ( t ) {
				t.classList.remove( r.css.hidden );
			}

			if ( r.css.active ) {
				a = r.select( "a[href='#" + hash + "']" )[ 0 ];
				if ( a ) {
					a.classList.add( r.css.active );
				}
			}
		}
		else {
			r.route( r["default"] );
		}
	}

	return r;
}
