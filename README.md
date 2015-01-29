# Vanilla Modal

[![npm version](https://badge.fury.io/js/vanilla-modal.svg)](https://www.npmjs.com/package/vanilla-modal)

### [Check out the demo.](http://dev.thephuse.com/vanilla-modal/demo/)

---

### A flexible, dependency-free, CSS-powered JavaScript modal.

Written in clean ECMAScript 6 and transpiled using 6to5.

## License

MIT. Please feel free to offer any input - pull requests, bug tracking, suggestions are all welcome.

## FAQ

### I'm looking for a jQuery modal I can copy & paste into my site.

That's not a question and this is not the script you're looking for. It is licensed under the MIT License though, so if you'd like to base a jQuery plugin on it, feel free to do so. Just remember that losing native DOM bindings means losing speed, too.

### Why plain JavaScript?

Because of the bloat of DOM libraries. Because of the dreadful performance of monolithic JavaScript frameworks. Because decoupled is the way to go. Because standard JavaScript provides everything you need for this task. Because sometimes, a 7KB minified (1.8KB gzipped) script is all you need. Also because sometimes you're adding this to an already glorious JavaScript overhead, e.g. 97 gzipped kilobytes of Ember.js.

### What about CSS Modal?

Great though [CSS Modal](http://drublic.github.io/css-modal/) (and similar solutions) are, developers may encounter problems when building a stateful UI, as using the CSS `:target` pseudo-class invariably means changing the window's `location.hash` property. This can cause havoc with client-side routers, as well as obfuscate the modal on the offchance that any anchor inside it changes the window's hash.

### My app is built using JavaScript framework `foo`

Not to worry. `open` and `close` event listeners are delegated so the modal script will keep running irrespective of whether you're using a client-side router. If you're desperate for garbage collection (e.g. if your app's made from last week's haddock surprise), you might be pleased to know there's a `destroy` method baked into the modal too.

### Usage and Examples
---

#### 1. Firstly, include the script in your project.

* The script can be installed from NPM and included using Browserify:

	**Command line**:
	```sh
	npm install --save-dev vanilla-modal
	```
	
	**JavaScript**:
	```javascript
	var VanillaModal = require('vanilla-modal');
	```

* Browserify (without NPM), Webpack and CommonJS aficionados get to use the following line:
	```javascript
	var VanillaModal = require('/path/to/vanilla-modal');`
	```

* For RequireJS, Webpack AMD and similar asynchronous module loaders, use:
	```javascript
	require(['/path/to/vanilla-modal'], function(VanillaModal) { ... });
	```

* Or, if you just can't bear to be fancy:
	```html
	<script src="/path/to/vanilla-modal.js"></script>
	```

---
#### 2. Next, instantiate your modal.

It's as simple as typing:
```javascript
var modal = new VanillaModal(opts);
```
...where `opts` is a hash of settings to supply the constructor with on instantiation.-

---
#### 3. Write your HTML!

This part is important. *Vanilla Modal* doesn't use any fancy string interpolation or template syntax. You'll need some good, solid elbow grease to build up your modal's layout in the DOM. The payoff? You can make the modal look like anything you want.

```html
<div class="modal">
  <div class="modal-inner">
    <a rel="modal:close">Close</a>
    <div class="modal-content"></div>
  </div>
</div>
```

Next, add your modal content to hidden containers on the page. The modal will inline the contents **inside** the selected container.

```html
<!--
  Give each one an ID attribute. It's totally possible to have
  more than one modal per page, and where they live in the DOM
  doesn't matter. Just remember that their innerHTML will be
  hauled out of its container and inlined into the modal.
-->
<div id="modal-1" style="display:none;">Modal 1 content</div>
<div id="modal-2" style="display:none;">Modal 2 content</div>
```

---
#### 4. Formulate a bunch of zany CSS rules.

<sup><sub>You nutty professor, you.</sub></sup>

#### [Here's an example stylesheet (written in SCSS)](https://gist.github.com/benceg/245eb1c6d36af35a7cce#file-modal-scss)

Forget choppy UI animations and JavaScript modal display parameters. Vanilla Modal keeps display specifications where they belong: in stylesheets. Hardware acceleration optional, but recommended, as is the liberal use of `vw`, `vh` and `calc` units to win friends and influence people.

The only things to remember here are:
* Using `display: none;` will get rid of any transitions you might otherwise be using.
* Whatever property you're using to obfuscate the modal (`z-index` in the example below) will need a `transition-length` of `0` and a `transition-delay` property of the length of the other transitions. For example:
```sass
transition: opacity 0.2s, z-index 0s 0.2s;
```

---
#### 5. Delegates and Methods

Only two HTML delegates affect the modal. By default:
* `[rel="modal:open"]` maps to `modal.open()` and
* `[rel="modal:close]` maps to `modal.close()`, where `modal` is the VanillaModal instance name.

```html
<a href="#modal-1" rel="modal:open">Modal 1</a>
```
...will open `#modal-1` inside the modal, while...

```html
<a rel="modal:close">Close</a>
```
...will close the modal.

The defaults can be changed at instantiation:

```js
var modal = new VanillaModal({ open : '.my-open-class', close : '.my-close-class' });
```

---
#### 6. Programmatically flashing a message on screen

If you need to flash a modal on screen for any reason, it can be done by passing a DOM selector string to the the `open()` function.

For example:

```js
var modal = new VanillaModal();

// Flashes a message on the screen to annoy people.
modal.open('#psa');

// Closes the modal while they're still looking for the close button.
setTimeout(function() {
  modal.close();
}, 2000);
```

...although this is a truly evil practice and should be avoided on pain of dismemberment.

---
## Public Properties

* `{Object} $`

  The DOM nodes used for the modal.

* `{Object} $$`

  The modal's settings object.

* `{Boolean} isOpen`

  Returns true if the modal is open.

* `{Node} current`

  The DOM node currently displayed in the modal. Returns `null` if not set.

* `{Function} close()`

  The modal's callable `close` method.

* `{Function} open(String)`

  The modal's callable `open` method. Requires an existing DOM selector string.

* `{Function} destroy()`

  Closes the modal and removes all event listeners.

---
## Options and Defaults

The options object contains DOM selector strings and bindings. It can be overridden at instantiation by providing an `options` object to `new VanillaModal(options)`.

The API is feature-frozen for the `version 1.x.x` branch.

#### Defaults:
```js
{
  modal : '.modal',
  modalInner : '.modal-inner',
  modalContent : '.modal-content',
  open : '[rel="modal:open"]',
  close : '[rel="modal:close"]',
  page : 'body',
  loadClass : 'vanilla-modal',
  class : 'modal-visible',
  clickOutside : false,
  closeKey : 27,
  transitions : true,
  onBeforeOpen : function() {},
  onBeforeClose : function() {},
  onOpen : function() {},
  onClose : function() {}
}
```

* `{String} modal`

  The class of the outer modal container. This is usually a fixed position element that takes up the whole screen. It doesn't have to be, though - the modal can just as easily be a discreet bar that pops out from the corner of the screen.

* `{String} modalInner`

  The inner container of the modal. This usually houses at least a close button (see HTML above). It should also contain the `modalContent` element.

* `{String} modalContent`

  The container used to house the modal's content when it's transferred to the modal. This should always be a child of `modalInner`.

* `{String} open`

  The selector to bind the `open()` event to. This can be anything. I'd recommend using the default as it's generic and keeps code legible.

* `{String} close`

  As above, except replace `open()` with `close()`, turn around three times, and pat yourself on the head.

* `{String} page`

  A single outermost DOM selector to apply the `loadClass` and `class` classes to. This is `body` by default but could just as easily be `html` or `main` in any common web app.

* `{String} loadClass`

  The class to apply to the `page` DOM node at the moment the script loads.

* `{String} class`

  The class to apply to the `parent` container when the modal is open.

* `{Boolean} clickOutside`

  If set to `true`, a click outside the modal will fire a `close()` event. Otherwise, the only ways to close the modal are to hit `[esc]` or click an item covered by the `close` query selector (default: `[rel="modal:close"]`).

* `{Boolean|Number} closeKey`

  If set to a keycode, hitting that keycode while the modal is open will fire a `close()` event. Set to `false` to disable.

* `{Boolean} transitions`

  If set to `false`, the modal will treat every browser like IE 9 and ignore transitions when opening and closing.

* `{Function} onBeforeOpen`

  A function hook to fire before opening. This function is bound to the modal instance.

* `{Function} onBeforeClose`

  A function hook to fire before closing. This function is bound to the modal instance.

* `{Function} onOpen`

  A function hook to fire on opening. This function is bound to the modal instance.

* `{Function} onClose`

  A function hook to fire on closing. This function is bound to the modal instance. I just cheated & copy-pasted the last few lines.

---
## Compatibility

This script works in the evergreen mobile & desktop browsers, IE 9 and above, and frankly doesn't give two hoots about Blackberry or any prior versions of IE (read: they're un-tested, but feel free to test, fork and shim).