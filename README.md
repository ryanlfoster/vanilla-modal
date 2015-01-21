# Vanilla Modal

### A flexible, dependency-free, CSS-powered JavaScript modal.

Or is it a JavaScript-powered CSS modal? No matter...

## FAQ

### I'm looking for a jQuery modal I can copy & paste into my site.

That's not a question and this is not the script you're looking for. It is licensed under the MIT License though, so if you'd like to base a jQuery plugin on it, feel free to do so. Just remember that losing native DOM bindings means losing speed, too.

### Why plain JavaScript?

Because of the bloat of DOM libraries. Because of the dreadful performance of monolithic JavaScript frameworks. Because decoupled is the way to go. Because standard JavaScript provides everything you need for this task. Because sometimes, a 5KB minified script is all you need.

<sup><sub>Also because sometimes you're adding this to something ridiculous like 97 gzipped kilobytes of Ember.js.</sub></sup>

### What about CSS Modal?

Great though [CSS Modal](http://drublic.github.io/css-modal/) (and similar solutions) are, the developer encounters problems when building a stateful UI, as using the CSS `:target` pseudo-attribute means changing the window's `location.hash` property. This can cause havoc with client-side routers, as well as obfuscate the modal on the offchance that any anchor inside it changes the window's hash.

### Usage and Examples
---

#### 1. Firstly, include the script in your project.

* Browserify, Webpack and CommonJS aficionados in general get to use the following line:
```javascript
var VanillaModal = require('/path/to/vanilla-modal');`
```
* For RequireJS and other AMD loaders, use:
```javascript
require(['/path/to/vanilla-modal'], function(VanillaModal) { ... });
```
* Or, if you can't bear to be fancy:
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

Next, add your modal content to a hidden container on the page.

```html
<div style="display:none;">
  <!--
	Add your modal containers here.
    Give each one an ID attribute.
    It's totally possible to have
    more than one modal per page,
    and where they live in the DOM
    doesn't matter. Just remember
    that they will be hauled out
    of whatever container they're
    in whenever the modal opens.
  -->
  <div id="modal-1">Modal 1 content</div>
  <div id="modal-2">Modal 2 content</div>
  [...]
</div>
```

---
#### 4. Formulate a bunch of zany CSS rules.

<sup><sub>You nutty professor, you.</sub></sup>

Forget choppy UI animations and JavaScript modal display parameters. Vanilla Modal keeps display specifications where they belong: in stylesheets. Hardware acceleration optional, but recommended, as is the liberal use of `vw`, `vh` and `calc` units to win friends and influence people.

The only things to remember here are:
* Using `display: none;` will get rid of any transitions you might otherwise be using.
* Whatever property you're using to obfuscate the modal (`z-index` in the example below) will need a `transition-length` of `0` and a `transition-delay` property of the length of the other transitions. For example:
```sass
transition: opacity 0.2s, z-index 0s 0.2s;
```

Here's an example (in Compass):

```scss
// Prevents the modal from flashing on-screen.
.modal {
  display: none;
}

// The following directives only apply once the script has loaded.
[data-gets-modal] {
  
  .modal {
    position: fixed;
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($businessblue, 0.6);
    z-index: -1;
    opacity: 0;
    font-size: 0;
	// Note the delay on the z-index.
    // Read above if you're wondering
    // why this is here.
    transition: opacity 0.2s, z-index 0s 0.2s;
    text-align: center;
    overflow: hidden;
    overflow-y: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    
    // This little bit of code centers the
    // modal's inner container vertically.
    > * {
      display: inline-block;
      white-space: normal;
      vertical-align: middle;
      text-align: left;
    }
    
    &:before {
      display: inline-block;
      overflow: hidden;
      width: 0;
      height: 100%;
      vertical-align: middle;
      content: "";
    }
  }
 
  &.modal-visible {
    .modal {
      z-index: 99;
      opacity: 1;
      // Note that we've removed any transiton on the
	  // z-index when the modal is in its visible state.
      transition: opacity 0.2s;
    }
  }

}

.modal-inner {
  position: relative;
  overflow: hidden;
  width: 90%;
  max-height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  background: $darkgrey;
  z-index: -1;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s, transform 0.2s, z-index 0s 0.2s;
  margin: 20px 0;
  
  .modal-visible & {
    z-index: 100;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.2s, transform 0.2s;
  }
}
```

---
#### 5. Put it all together using HTML and JavaScript directives

Only two HTML directives affect the modal: the self-explanatory `rel="modal:open"` and `rel="modal:close`:

```html
<a href="#modal-1" rel="modal:open">Modal 1</a>
```
...will open `#modal-1` inside the modal, while...

```html
<a rel="modal:close">Close</a>
```
...will close the modal.

In JavaScript, those directives translate to:

```js
modal.open();
```
and
```js
modal.close();
```

These can be used to programmatically open and close the modal - even from within different frames!

---
#### 6. Programmatically flashing a message on screen

If you need to flash a modal on screen for any reason, it can be done by passing a DOM element or DOM selector string to the `VanillaModal({ href : el })` (where `el` is the selector) constructor or the `open()` function.

For example:

```js
var modal = new VanillaModal();

document.addEventListener('DOMContentLoaded', function() {
  
  // Flashes a message on the screen,
  // momentarily, to annoy people.
  modal.open('#psa');

  setTimeout(function() {
    modal.close();
  }, 2000);
  
});
```

...although this is generally used only for pure evil and should be avoided.

---
## Options and Defaults

The options object contains DOM selector strings and bindings. It can be overridden at instantiation by providing an `options` object to `new VanillaModal(options)`.

#### Defaults:
```javascript
{
  modal : '.modal',
  modalInner : '.modal-inner',
  modalContent : '.modal-content',
  open : '[rel="modal:open"]',
  close : '[rel="modal:close"]',
  parent : 'body',
  class : 'modal-visible',
  href : false,
  clickOutside : false,
  transitions : true,
  onBeforeOpen : function() {},
  onBeforeClose : function() {},
  onOpen : function() {},
  onClose : function() {}
}
```

#### `modal` : `{string}`

The class of the outer modal container. This is usually a fixed position element that takes up the whole screen. It doesn't have to be, though - the modal can just as easily be a discreet bar that pops out from the corner of the screen.

#### `modalInner` : `{string}`

The inner container of the modal. This usually houses at least a close button (see HTML above). It should also contain the `modalContent` element.

#### `modalContent` : `{string}`

The container used to house the modal's content when it's transferred to the modal. This should always be a child of `modalInner`.

#### `open` : `{string}`

The selector to bind the `open()` event to. This can be anything. I'd recommend using the default as it makes code legible.

#### `close` : `{string}`

As above, except replace `open()` with `close()`, turn around three times, and pat yourself on the head.

#### `parent` : `{string}`

The outermost object to apply the `[data-gets-modal]` attribute and the `class` class to. This is `body` by default but could just as easily be `html` or `main` in any common web app.

#### `class` : `{string}`

The class to apply to the `parent` container when the modal is open.

#### `href` : `{string|node}`

The initial content box for the modal. Use this when the modal has to be instantiated with an item already loaded up for viewing. This is analogous to the `href` argument in `modal.open(href)`.

#### `clickOutside` : `{boolean}`

If set to `true`, a click outside the modal will fire a `close()` event. Otherwise, the only ways to close the modal are to hit `[esc]` or click an item covered by the `close` query selector (default: `[rel="modal:close"]`).

#### `transitions` : `{boolean}`

If set to `false`, the modal will treat every browser like IE 9 and ignore transitions when opening and closing.

#### `onBeforeOpen` : `{function}`

A callback hook to fire before opening. This function is bound to the modal.

#### `onBeforeClose` : `{function}`

A callback hook to fire before closing. This function is bound to the modal.

#### `onOpen` : `{function}`

A callback hook to fire on opening. This function is bound to the modal.

#### `onClose` : `{function}`

A callback hook to fire on closing. This function is bound to the modal. I just cheated & copy-pasted the last few lines.

---
## Compatibility

This script works in the evergreen mobile & desktop browsers, IE 9 and above, and frankly doesn't give two hoots about Blackberry or any prior versions of IE (read: they're un-tested, but feel free to test, fork and shim).