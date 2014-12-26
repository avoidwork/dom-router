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
