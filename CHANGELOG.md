# Change Log

## 1.1.1
- Minor correction in `router()`

## 1.1.0
- Changed `this.callback` to be a `Function`, & removed a conditional statement within the render frame
- Fixed collision of `log` property & `log()` method by renaming the property to `logging`
- Refactored to ES6 code base, & outputting `*.es6.js` files in `/lib`
- Added `grunt-6to5` build step
- Removed `grunt-jshint` build step

## 1.0.2
- Fixed `route()` such that the single argument is optional
- Moved `select()` onto `prototype`

## 1.0.1
- Created `this.scan()` for reprogramming the router easily

## 1.0.0
- Initial release
