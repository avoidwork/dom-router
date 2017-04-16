# dom-router

[![build status](https://secure.travis-ci.org/avoidwork/dom-router.svg)](http://travis-ci.org/avoidwork/dom-router)

Imagine you didn't have to write a bunch of JavaScript to get a slick, progressively enhanced interface! `dom-router`
is a URL hash to DOM router which automatically, & intelligently toggles visibility of `Elements` based on `hashchange`
events.

This provides a clean separation of concerns, and progressive enhancement in a simple library. You can write clean HTML,
and `dom-router` will progressively enhance the interface with CSS classes (not supplied). DOM updates happen on an
animation frame to minimize impacting your application. An optional `callback` allows you to handle application
state changes the way you want.

## Example
This example is meant to demonstrate multi-tier routing in a single page application. When the HTML is "clean", it is
functional for screen readers & text based browsers like `lynx`, and with progressive enhancement, developers can add
new behaviour without impacting the experience of other consumers.

#### Before routing is enabled
```html
<nav>
  <ul>
    <li><a href="#main">Main</a></li>
    <li><a href="#settings/billing" class="settings">Billing</a></li>
    <li><a href="#settings/password" class="settings">Password</a></li>
    <li><a href="#settings/avatar" class="settings">Avatar</a></li>
  </ul>
</nav>
...
<article>
  <section id="main">...</section>
  <section id="settings">
    <section id="billing">...</section>
    <section id="password">...</section>
    <section id="avatar">...</section>
  </section>
</article>
```

#### After routing is enabled
This would be the result if a user visited `#settings/billing`:

```html
<nav>
  <ul>
    <li><a href="#main">Main</a></li>
    <li><a href="#settings/billing" class="settings dr-current">Billing</a></li>
    <li><a href="#settings/password" class="settings">Password</a></li>
    <li><a href="#settings/avatar" class="settings">Avatar</a></li>
  </ul>
</nav>
...
<article>
  <section id="main" class="dr-hidden">...</section>
  <section id="settings">
    <section id="billing">...</section>
    <section id="password" class="dr-hidden">...</section>
    <section id="avatar" class="dr-hidden">...</section>
  </section>
</article>
```

#### Minimal coding required
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
When loaded with a script tag, `window.router` will be created. An ES6 version is included in `/lib`.

## Configuration
#### active
`Boolean` which enables/disables routing

#### callback
Function to execute after route has changed, takes `arg` which describes the event

#### css
`Object` with `current`, & `hidden` keys which have corresponding CSS class values, defaults to "dr-current", & "dr-hidden"

#### ctx
Context for DOM selector, defaults to `body` if not specified

#### delimiter
Multi-tier routing delimiter, defaults to `/`, e.g. `#settings/billing`; each tier should map to a nested `id`

#### logging
`Boolean` which logs routing to `router.history[]` if `true`, defaults to `false`; could be a memory leak if logging is enabled and target `Elements` are removed from DOM

#### start
[Optional] The starting route to display if one is not specified, or an invalid route is specified

## API
#### current()
Returns the current `Route`, if logging is enabled

#### hashchange(ev)
Event handler, expects `{oldURL: "", newURL: ""}`

#### scan(default)
Scans `ctx` for routes & resets `default` which is an optional argument, otherwise it defaults to the first route

#### select(query)
Context specific DOM selector


## Requirements
- `Element.classList` API, or shim

## License
Copyright (c) 2017 Jason Mulligan
Licensed under the BSD-3 license
