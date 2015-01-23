/**
 * @name Vanilla Modal
 * @description A vanilla JavaScript modal module
 * @version 1.0.0
 * @author Ben Ceglowski
 */
(function(window, document, undefined) {
  'use strict';
  
  var self;
  
  var VanillaModal = (function(userOptions) {
    
    self = this;
    
    self.userOptions = userOptions || {};
    
    // Bootstrap settings
    self.settings = {
      'modal' : '.modal',
      'modalInner' : '.modal-inner',
      'modalContent' : '.modal-content',
      'open' : '[rel="modal:open"]',
      'close' : '[rel="modal:close"]',
      'parent' : 'body',
      'class' : 'modal-visible',
      'href' : false,
      'clickOutside' : false,
      'transitions' : true,
      'onBeforeOpen' : function() {},
      'onBeforeClose' : function() {},
      'onOpen' : function() {},
      'onClose' : function() {}
    };
    
    self.DOM = {};
    self.isOpen = false;
    self.transitionEnd = null;
    
    // Handle exceptions gently if no modal found
    try {
      self.sniffTransitionEnd();
      self.bootstrap();
      self.prepareDOM();
      self.addParentAttr();
      self.attachEvents();
    } catch(e) {}
    
    return this;
    
  });
  
  VanillaModal.prototype = {
    
    // Checks for the browser variant of transitionend
    sniffTransitionEnd : function() {
      
      var el = document.createElement('div');
      
      var transitions = {
        'transition':'transitionend',
        'OTransition':'otransitionend',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      };

      for (var i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
          return self.transitionEnd = transitions[i];
        }
      }
    
    },
    
    // Adds user settings to the mix
    bootstrap : function() {
      
      if (typeof self.userOptions === 'object') {
        for (var i in self.userOptions) {
          self.settings[i] = self.userOptions[i];
        }
      }
      
    },
    
    // Builds the DOM selector object
    prepareDOM : function() {
      
      self.DOM.modal         = document.querySelector(self.settings.modal);
      self.DOM.modalInner    = self.DOM.modal.querySelector(self.settings.modalInner);
      self.DOM.modalContent  = self.DOM.modal.querySelector(self.settings.modalContent);
      self.DOM.open          = document.querySelectorAll(self.settings.open);
      self.DOM.close         = document.querySelectorAll(self.settings.close);
      self.DOM.parent        = document.querySelector(self.settings.parent);
      
    },
    
    // Preps the page to accept a modal
    addParentAttr : function() {
      
      self.DOM.parent.setAttribute('data-gets-modal', '');
      
    },
    
    addClass : function(el, className) {
      
      if (! el instanceof HTMLElement) return;
      
      var cssClasses = el.className.split(' ');
      
      if (cssClasses.indexOf(className) === -1) {
        cssClasses.push(className);
      }
      
      el.className = cssClasses.join(' ');
      
    },
    
    removeClass : function(el, className) {
      
      if (! el instanceof HTMLElement) return;
      
      var cssClasses = el.className.split(' ');
      
      if (cssClasses.indexOf(className) > -1) {
        cssClasses.splice(cssClasses.indexOf(className), 1);
      }
      
      el.className = cssClasses.join(' ');
      
    },
    
    // Opens the modal
    open : function (e) {
      
      // Using modal.open(e)
      if(typeof e === 'string') {
        
        self.settings.href = document.querySelector(e);
      
      // On click
      } else if(e instanceof MouseEvent && typeof this.hash === 'string') {
        
        self.settings.href = document.querySelector(this.hash);
        e.preventDefault();
      
      // Using new VanillaModal({ href : '#something' }).open()
      } else if(typeof self.settings.href !== 'undefined') {
        
        // If a string is passed, try to find the corresponding element
        if(typeof self.settings.href === 'string') {
          self.settings.href = document.querySelector(self.settings.href);
        }
        
        // Regardless, check whether the element exists
        if( ! self.settings.href || ! self.settings.href.length || ! self.settings.href instanceof HTMLElement) {
          return; 
        }
      
      // Otherwise don't open the modal
      } else {
        
        return;
        
      }
      
      // Fires callback prior to opening
      if(typeof self.settings.onBeforeOpen === 'function') self.settings.onBeforeOpen.bind(self);
      
      // Pulls the DOM node out of the DOM
      self.acquireDOMNode();
      
      // Adds the relevant class to the modal's parent container
      self.addClass(self.DOM.parent, self.settings.class);
      
      var id = (self.settings.href.id ? self.settings.href.id : 'anonymous');
      
      self.DOM.parent.setAttribute('data-current-modal', id);
      
      // Flags the modal as being open
      self.isOpen = true;
      
      // Fires callback after opening
      if(typeof self.settings.onOpen === 'function') self.settings.onOpen.bind(self);
      
      // Make object chainable
      return self;
      
    },
    
    close : function (e) {
      
      // Disable default action if closed on click
      if(e) e.preventDefault();
      
      // Fires callback prior to closing
      if(typeof self.settings.onBeforeClose === 'function') self.settings.onBeforeClose.bind(self);
      
      // Removes class from parent element
      self.removeClass(self.DOM.parent, self.settings.class);
      
      // Determines whether to close instantly or transition closed
      if(self.transitionEnd && self.settings.transitions !== false) {
        self.closeWithTransition();
      } else {
        self.closeWithoutTransition();
      }
      
      // Makes object chainable
      return self;
      
    },
    
    // Handles removal of event listeners and resets on close
    transitionHandler : function() {
      
      self.DOM.modal.removeEventListener(self.transitionEnd, self.transitionHandler, false);
      
      self.DOM.parent.removeAttribute('data-current-modal');
      self.returnDOMNode();
      self.isOpen = false;
      
      if(typeof self.settings.onClose === 'function') self.settings.onClose.bind(self);
      
    },
    
    // Invokes closing with transition
    closeWithTransition : function() {
      
      self.DOM.modal.addEventListener(self.transitionEnd, self.transitionHandler, false);
      
    },
    
    // Closes the modal unflatteringly
    closeWithoutTransition : function() {
      
      self.DOM.parent.removeAttribute('data-current-modal');
      self.returnDOMNode();
      self.isOpen = false;
      
      if(typeof self.settings.onClose === 'function') self.settings.onClose.bind(self);
        
    },
    
    // Transplants target DOM node into modal
    acquireDOMNode : function() {
      
      if(!self.settings.href) return;
      
      while(self.settings.href.childNodes.length > 0) {
        self.DOM.modalContent.appendChild(self.settings.href.childNodes[0]);
      }
      
    },
    
    // Returns target DOM node to its regular position
    returnDOMNode : function() {
      
      if(!self.settings.href) return;
      
      while(self.DOM.modalContent.childNodes.length > 0) {
        self.settings.href.appendChild(self.DOM.modalContent.childNodes[0]);
      }
      
    },
    
    // Does what it says on the tin, closes the modal
    detectEscapeKey : function(e) {
      
      if(e.keyCode === 27 && self.isOpen === true) {
        e.preventDefault();
        self.close();
      }
      
    },
    
    // Detects clicks outside the modal, closes the modal
    modalClickHandler : function(e) {
      
      var node = e.target;
      
      while(node != document.body) {
        if (node === self.DOM.modalInner) return;
        node = node.parentNode;
      }
      
      self.close();
      
    },
    
    // Adds listeners for all the open & close events
    attachEvents : function() {
      
      for (var i = 0; i < self.DOM.open.length; i++) {
        (function (_i) {
          self.DOM.open[_i].addEventListener('click', self.open, false);
        })(i);
      }
      
      for (var i = 0; i < self.DOM.close.length; i++) {
        (function (_i) {
          self.DOM.close[_i].addEventListener('click', self.close, false);
        })(i);
      }
      
      if(self.settings.clickOutside === true) {
        self.DOM.modal.addEventListener('click', self.modalClickHandler, false);
      }
      
      document.addEventListener('keydown', self.detectEscapeKey, false);
      
    },
    
    // Wipes out the modal without a trace
    destroy : function() {
      
      self.close();
      
      for (var i = 0; i < self.DOM.open.length; i++) {
        (function (_i) {
          self.DOM.open[_i].removeEventListener('click', self.open);
        })(i);
      }
      
      for (var i = 0; i < self.DOM.close.length; i++) {
        (function (_i) {
          self.DOM.close[_i].addEventListener('click', self.close);
        })(i);
      }
      
      if(self.settings.clickOutside === true) {
        self.DOM.modal.removeEventListener('click', self.modalClickHandler);
      }
      
      document.removeEventListener('keydown', self.detectEscapeKey);
      
    }
     
  };
  
  if (typeof define === 'function' && define.amd) {
    define('VanillaModal', function () {
      return VanillaModal;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanillaModal;
  } else {
    window.VanillaModal = VanillaModal;
  }
  
})(window, document);