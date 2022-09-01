# dom-router

Imagine you didn't have to write a bunch of JavaScript to get a slick, progressively enhanced interface! `dom-router`
is a URL hash to DOM router which automatically, & intelligently toggles visibility of `Elements` based on `popstate`
events.

This provides a clean separation of concerns, and progressive enhancement in a simple library. You can write clean HTML,
and `dom-router` will progressively enhance the interface with CSS classes (not supplied). DOM updates happen on an
animation frame to minimize impacting your application. An optional `callback` allows you to handle application
state changes the way you want.

## Example
This example is meant to demonstrate multi-tier routing in a single page application. When the HTML is "clean", it is
functional for screen readers & text based browsers like `lynx`, and with progressive enhancement, developers can add
new behaviour without impacting the experience of other consumers.

### Minimal coding required
```javascript
import {router} from "./dom-router.js";
window.appRouter = router({callback: arg => console.log(`${arg.element.id} is visible`)});
```

### Before routing is enabled
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

### After routing is enabled
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

## How can I load dom-router?
When loaded with a script tag, `window.domRouter.router()` will be created.

## Configuration
### active
`Boolean` which enables/disables routing

### callback
Function to execute after route has changed, takes `arg` which describes the event

### css
`Object` with `current`, & `hidden` keys which have corresponding CSS class values, defaults to "dr-current", & "dr-hidden"

### ctx
Context for DOM selector, defaults to `body` if not specified

### delimiter
Multi-tier routing delimiter, defaults to `/`, e.g. `#settings/billing`; each tier should map to a nested `id`

### logging
`Boolean` which logs routing to `router.history[]` if `true`, defaults to `false`; could be a memory leak if logging is enabled and target `Elements` are removed from DOM

### start
[Optional] The starting route to display if one is not specified, or an invalid route is specified

### stickyPos
`Boolean` which enables/disables remaining at `Y position` when the route changes, i.e. no scrolling.

### stickyRoute
`Boolean` which enables/disables sticky routing.

### storage
`String` Storage used for `stickyRoute`, defaults to `session`; valid options are `session` or `local`.

### storageKey
`String` Key for persistent storage for `stickyRoute`.

## API
### current()
Returns the current `Route`; if logging is enabled the trigger `Element` will be present

### popstate()
Event handler

### scan(default)
Scans `ctx` for routes & resets `default` which is an optional argument, otherwise it defaults to the first route

### select(query)
Context specific DOM selector


## Requirements
- `Element.classList` API, or shim
- `popstate` Event

## License
Copyright (c) 2022 Jason Mulligan
Licensed under the BSD-3 license
