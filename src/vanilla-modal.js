/**
 * @class VanillaModal
 * @version 0.3.0
 * @author Ben Ceglowski
 */
class VanillaModal {
  
  /**
   * @param {Object} [userSettings]
   */
  constructor(userSettings) {
    
    this.$$ = {
      modal : '.modal',
      modalInner : '.modal-inner',
      modalContent : '.modal-content',
      open : '[rel="modal:open"]',
      close : '[rel="modal:close"]',
      page : 'body',
      class : 'modal-visible',
      loadClass : 'vanilla-modal',
      href : false,
      clickOutside : true,
      escapeKey : true,
      transitions : true,
      onBeforeOpen : function() {},
      onBeforeClose : function() {},
      onOpen : function() {},
      onClose : function() {}
    };
    
    this.isOpen = false;
    
    this.open = this._open.bind(this);
    this.close = this._close.bind(this);
    this.escapeKeyHandler = this._escapeKeyHandler.bind(this);
    this.outsideClickHandler = this._outsideClickHandler.bind(this);
    
    this.userSettings = this.applyUserSettings(userSettings); 
    this.transitionEnd = this.transitionEndVendorSniff();
    this.$ = this._setupDomNodes();
    
    this._addLoadedCssClass();
    this._addEvents();
    
    return this;
  }
  
  applyUserSettings() {
    if (typeof this.userSettings === 'object') {
      for (var i in this.userSettings) {
        this.$$[i] = this.userSettings[i];
      }
    }
  }
  
  transitionEndVendorSniff() {
    if (this.$$.transitions) return;
    var el = document.createElement('div');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'otransitionend',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };
    for (var i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return this.transitionEnd = transitions[i];
      }
    }
  }
  
  /**
   * @param {String} selector
   * @param {Node} parent
   */
  getNode(selector, parent) {
    var parent = parent || document;
    var node = parent.querySelector(selector);
    if (!node) return console.error('Element "' + selector + '" does not exist in context.');
    return node;
  }
  
  /**
   * @param {String} selector
   * @param {Node} parent
   */
  _getNodeList(selector, parent) {
    var parent = parent || document;
    var nodes = parent.querySelectorAll(selector);
    if (!nodes.length) return console.error('Element "' + selector + '" does not exist in context.');
    return nodes;
  }
  
  _setupDomNodes() {
    var $ = {};
    $.modal = this.getNode(this.$$.modal);
    $.page = this.getNode(this.$$.page);
    $.modalInner = this.getNode(this.$$.modalInner, this.modal);
    $.modalContent = this.getNode(this.$$.modalContent, this.modal);
    $.open = this._getNodeList(this.$$.open);
    $.close = this._getNodeList(this.$$.close);
    return $;
  }
  
  _addLoadedCssClass() {
    this._addClass(this.$.page, this.$$.loadClass);
  }
  
  /**
   * @param {Node} el
   * @param {String} className
   */
  _addClass(el, className) {
    if (! el instanceof HTMLElement) return;
    var cssClasses = el.className.split(' ');
    if (cssClasses.indexOf(className) === -1) {
      cssClasses.push(className);
    }
    el.className = cssClasses.join(' ');
  }
  
  /**
   * @param {Node} el
   * @param {String} className
   */
  _removeClass(el, className) {
    if (! el instanceof HTMLElement) return;
    var cssClasses = el.className.split(' ');
    if (cssClasses.indexOf(className) > -1) {
      cssClasses.splice(cssClasses.indexOf(className), 1);
    }
    el.className = cssClasses.join(' ');
  }
  
  _setOpenId() {
    var id = this.$$.href.id || 'anonymous';
    this.$.page.setAttribute('data-current-modal', id);
  }
  
  _removeOpenId() {
    this.$.page.removeAttribute('data-current-modal');
  }
  
  _getElementContext(e) {
    if (e.currentTarget && typeof e.currentTarget.hash === 'string') {
      return document.querySelector(e.currentTarget.hash)
    } else if (typeof e === 'string') {
      return document.querySelector(e);
    }
    return;
  }
  
  /**
   * @param {Event} e
   */
  _open(e) {
    this.$$.href = this._getElementContext(e);
    if (this.$$.href instanceof HTMLElement === false) return console.error('Element "' + this.$$.href + '" does not exist in context.');
    if (typeof this.$$.onBeforeOpen === 'function') this.$$.onBeforeOpen.bind(this);
    this.captureNode();
    this._addClass(this.$.page, this.$$.class);
    this._setOpenId();
    this.isOpen = true;
    if (typeof this.$$.onOpen === 'function') this.$$.onOpen.bind(this);
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    return this;
  }
  
  /**
   * @param {Event} e
   */
  _close(e) {
    if (typeof this.$$.onBeforeClose === 'function') this.$$.onBeforeClose.bind(this);
    this._removeClass(this.$.page, this.$$.class);
    if (this.$$.transitions && this.transitionEnd) {
      this._closeModalWithTransition();
    } else {
      this._closeModal();
    }
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    return this;
  }
  
  _closeModal() {
    this._removeOpenId(this.$.page);
    this.releaseNode();
    this.isOpen = false;
    if (typeof this.$$.onClose === 'function') this.$$.onClose.bind(this);
  }
  
  _closeTransitionHandler() {
    this.$.modal.removeEventListener(this.transitionEnd, this._closeTransitionHandler);
    this._closeModal();
  }
  
  _closeModalWithTransition() {
    this.$.modal.addEventListener(this.transitionEnd, this._closeTransitionHandler);
  }
  
  /**
   * @param {Node} node
   */
  captureNode(node) {
    try {
      while(this.$$.href.childNodes.length > 0) {
        this.$.modalContent.appendChild(this.$$.href.childNodes[0]);
      }
    } catch(e) {
      return console.error('The target modal has no child elements.');
    }
  }
  
  releaseNode() {
    try {
      while(this.$.modalContent.childNodes.length > 0) {
        this.$$.href.appendChild(this.$.modalContent.childNodes[0]);
      }
    } catch(e) {
      return console.error('The modal\'s original container no longer exists.');
    }
  }
  
  /**
   * @param {Event} e
   */
  _escapeKeyHandler(e) {
    if (e.keyCode === 27 && this.isOpen === true) {
      e.preventDefault();
      this.close();
    }
  }
  
  /**
   * @param {Event} e
   */
  _outsideClickHandler(e) {
    var node = e.target;
    while(node != document.body) {
      if (node === this.$.modalInner) return;
      node = node.parentNode;
    }
    this.close();
  }
  
  /**
   * @param {NodeList} nodes
   * @param {String} event
   * @param {Function} fn
   */
  _addEvent(nodes, event, fn) {
    if (! nodes.length) nodes = [nodes];
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener(event, fn);
    }
  }
  
  /**
   * @param {NodeList} nodes
   * @param {String} event
   * @param {Function} fn
   */
  _removeEvent(nodes, event, fn) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].removeEventListener(event, fn);
    }
  }
  
  _addEvents() {
    this._addEvent(this.$.open, 'click', this.open);
    this._addEvent(this.$.close, 'click', this.close);
    if (this.$$.escapeKey === true) this._addEvent(document, 'keydown', this.escapeKeyHandler);
    if (this.$$.clickOutside === true) this._addEvent(this.$.modal, 'click', this.outsideClickHandler);
  }
  
  destroy() {
    this.close();
    this._removeEvent(this.$.open, 'click', this.open);
    this._removeEvent(this.$.close, 'click', this.close);
    if (this.$$.escapeKey === true) this._removeEvent(document, 'keydown', this.escapeKeyHandler);
    if (this.$$.clickOutside === true) this._removeEvent(this.$.modal, 'click', this.outsideClickHandler);
  }
   
}

(function() {
  if (typeof define === 'function' && define.amd) {
    define('VanillaModal', function () {
      return VanillaModal;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanillaModal;
  } else {
    window.VanillaModal = VanillaModal;
  }
})();