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
