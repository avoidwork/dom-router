/**
 * Dispatches a Custom Event
 *
 * @param  {Object}  obj        Object which will dispatch the event
 * @param  {String}  type       Type of event
 * @param  {Object}  data       [Optional] Event data
 * @param  {Boolean} bubbles    [Optional] Does event bubble? defaults to `true`
 * @param  {Boolean} cancelable [Optional] Is event cancelable? defaults to `true`
 * @return {Object}
 */
function dispatch ( obj, type, data, bubbles, cancelable ) {
	var ev;

	if ( typeof obj.dispatchEvent == "function" ) {
		try {
			ev = new CustomEvent( type );
		}
		catch ( e ) {
			ev = document.createEvent( "CustomEvent" );
		}

		bubbles = ( bubbles !== false );
		cancelable = ( cancelable !== false );

		ev.initCustomEvent( type, bubbles, cancelable, data || {} );
		obj.dispatchEvent( ev );
	}

	return obj;
}
