/**
 * Route
 *
 * @param {Object} arg Descriptor
 * @constructor
 */
function Route ( arg ) {
	this.hash = arg.hash;
	this.element = arg.element;
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
