# dom-router

[![build status](https://secure.travis-ci.org/avoidwork/dom-router.svg)](http://travis-ci.org/avoidwork/dom-router)

DOM router which automatically, & intelligently toggles visibility of `Elements` based on `hashchange` events.
This provides a clean separation of concerns, and progressive enhancement in a simple library. A `callback` allows
you to handle the application state change the way you want.

## Example
```javascript
var router = require('dom-router'),
    r;

// Router will write to console on `hashchange`
r = router({callback: function (arg) {
    console.log(arg.element.id, "is visible");
}});
```

## How can I load dom-router?
dom-router can be installed from npm, & bower, and supports CJS, AMD, & script tags.
When loaded with a script tag, `window.router` will be created.

## Configuration
#### active
`Boolean` which enables/disables routing

#### callback
Function to execute after route has changed, takes `arg` which describes the event

#### css
`Object` with `current`, & `hidden` keys which have corresponding CSS class values, defaults to "current", & "hidden"

#### ctx
Context for DOM selector, defaults to `body` if not specified

#### delimiter
Multi-tier routing delimiter, defaults to `/`, e.g. `#settings/billing`; each tier should map to a nested `id`

```html
<article>
  <section id="main" class="hidden">...</section>
  <section id="settings">
    <section id="billing">...</section>
    <section id="password" class="hidden">...</section>
    <section id="avatar" class="hidden">...</section>
  </section>
</article>
```

#### log
`Boolean` which logs routing to `router.history[]` if `true`, defaults to `false`; could be a memory leak if logging is enabled and target `Elements` are removed from DOM

## API
#### current()
Returns the current `Route`, if logging is enabled


## Requirements
- `Element.classList` API, or shim

## License
Copyright (c) 2014 Jason Mulligan
Licensed under the BSD-3 license
