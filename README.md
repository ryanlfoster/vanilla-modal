# Vanilla Modal

### A flexible, dependency-free, CSS-driven JavaScript modal.

Because you're worth it (and sometimes jQuery just isn't).

Read the corresponding article [here](http://phuse.ca).

### I'm looking for a jQuery modal I can copy & paste into my site.

This is not the script you're looking for. It's licensed under the MIT License, though, so if you'd like to build a jQuery plugin from of it, feel free to do so!

### Why plain JavaScript?

Because of the gzipped size of jQuery. Because of the performance of monolithic JavaScript frameworks. Because decoupled is the way to go. Because sometimes, a 5KB minified script is all you need.

### What about CSS Modal?

Great though [CSS Modal](http://drublic.github.io/css-modal/) (and similar solutions) are, the developer encounters problems when building a stateful UI, as using the CSS `:target` pseudo-attribute means changing the window's `location.hash` property. This can cause havoc with routers, as well as obfuscate the modal on the offchance that any anchor inside it changes the window's hash.

### Usage and Examples
---

#### 1. Firstly, include the script in your project.

* Browserify, Webpack and CommonJS aficionados in general, use the following line:
```javascript
require('/path/to/vanilla-modal');`
```
* For RequireJS and other AMD loaders, use:
```javascript
require(['/path/to/vanilla-modal'], function(VanillaModal) { ... });
```
* Or, if you can't bear to be fancy:
```html
<script src="/path/to/vanilla-modal.js"></script>
```

#### 2. Next, instantiate your modal.

It's as simple as typing:
```javascript
var modal = new VanillaModal(opts);
```
...where `opts` is a hash of settings to supply the constructor with on instantiation.

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