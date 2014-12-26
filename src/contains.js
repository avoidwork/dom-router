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
