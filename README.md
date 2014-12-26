# dom-router

[![build status](https://secure.travis-ci.org/avoidwork/dom-router.svg)](http://travis-ci.org/avoidwork/dom-router)

DOM router which automatically, & intelligently toggles visibility of `Elements` based on `hashchange` events.
This provides a clean separation of concerns, and progressive enhancement in a simple library. A `callback` allows
you to handle the application state change the way you want.

## Example
```javascript
var router = require('dom-router'),
    r;

// Router will write to console `onhashchange`
r = router({callback: function (arg) {
    console.log(arg.element.id, "is visible");
});
```

## How can I load dom-router?
dom-router can be installed from npm, & bower, and supports CJS, AMD, & script tags. When loaded with a script tag, `window.router` will be created.

## Configuration
#### active
`Boolean` which enables/disables routing

#### callback
Function to execute after route has changed, takes `arg` which describes the event

#### ctx
Context for DOM selector, defaults to `body` if not specified

#### log
Logs routing to `router.history[]` if enabled, defaults to `false` (could be a memory leak if logging is enabled and target `Elements` are removed from DOM)

## API
#### current()
Returns the current `Route`, if logging is enabled


## Requirements
- CSS class named `hidden` to toggle display/visibility/other attribute.
- `Element.classList` API

## License
Copyright (c) 2014 Jason Mulligan
Licensed under the BSD-3 license
