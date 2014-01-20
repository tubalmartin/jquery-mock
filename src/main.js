!function(definition) {
  if (typeof define === 'function' && define.amd) {
    // Register as an AMD module.
    define(['jquery'], definition);
  } else {
    // Browser globals
    definition(window.jQuery);
  }
}(function($) {

  'use strict';

  if (typeof sinon === 'undefined') {
    throw new Error('Sinon.JS library not found!');
  }

  var m = sinon.match;

  var aString = '';
  var aNumber = 0;
  var anArray = function() { return []; };
  var aBool = false;
  var anObject = function() { return {}; };
  var anEventObject = function() {
    return {
      currentTarget: anObject(),
      data: anObject(),
      delegateTarget: anObject(),
      isDefaultPrevented: sinon.stub(),
      isImmediatePropagationStopped: sinon.stub(),
      isPropagationStopped: sinon.stub(),
      metaKey: false,
      namespace: aString,
      pageX: aNumber,
      pageY: aNumber,
      preventDefault: sinon.stub(),
      relatedTarget: anObject(),
      result: undefined,
      stopImmediatePropagation: sinon.stub(),
      stopPropagation: sinon.stub(),
      target: anObject(),
      timeStamp: 1385124829350,
      type: undefined,
      which: aNumber
    };
  };
  var aPromiseObject = function() {
    return {
      always: sinon.stub(),
      done: sinon.stub(),
      fail: sinon.stub(),
      pipe: sinon.stub(),
      progress: sinon.stub(),
      promise: sinon.stub(),
      state: sinon.stub(),
      then: sinon.stub()
    };
  };

  var spy;

  // Our jQuery function $()
  function jquery(arg1, arg2, prevObj) {
    var obj = {};
    var props = jquery.__instanceProperties;
    var methods = jquery.__instanceStubs;
    var i, l, prop, method, stub;

    // Create properties
    for (prop in props) {
      if (props.hasOwnProperty(prop)) {
        obj[prop] = props[prop];
      }
    }

    // Give each object and id for easier debugging
    obj.__id = jquery.__id++;
    // Support .end() method
    obj.__prevObj = prevObj || null;
    // Set the selector property as jQuery does
    obj.selector = typeof arg1 === 'string' && arg1 || '';

    // Create stubbed methods
    for (i = 0, l = methods.length; i < l; i++) {
      method = methods[i];
      stub = sinon.stub();

      // jQuery API definitions for our stubbed methods:
      // By default, methods return the jQuery object. If any method
      // returns something different, create a case with the method's
      // complete API and break.
      // Order API definitions from more specific to less specific when
      // the position and type of an argument is the same for more than one
      // definition.
      switch (method) {
        case 'add':
        case 'addBack':
        case 'andSelf':
        case 'children':
        case 'closest':
        case 'contents':
        case 'eq':
        case 'filter':
        case 'find':
        case 'first':
        case 'has':
        case 'last':
        case 'map':
        case 'next':
        case 'nextAll':
        case 'nextUntil':
        case 'not':
        case 'offsetParent':
        case 'parent':
        case 'parents':
        case 'parentsUntil':
        case 'prev':
        case 'prevAll':
        case 'prevUntil':
        case 'siblings':
        case 'slice':
          // Use a spy instead of a stub so we can return a new object!
          stub = sinon.spy(function(){
            return jquery(arguments[0], arguments[1], obj);
          });
          break;
        case 'attr':
          stub.withArgs(m.string, m.string.or(m.number).or(m.func)).returns(obj);
          stub.withArgs(m.string).returns(aString);
          stub.withArgs(m.object).returns(obj);
          break;
        case 'css':
          stub.withArgs(m.string, m.string.or(m.number).or(m.func)).returns(obj);
          stub.withArgs(m.object).returns(obj);
          stub.withArgs(m.string.or(m.array)).returns(aString);
          break;
        case 'data':
          stub.withArgs(m.string, m.object).returns(obj);
          stub.withArgs(m.object).returns(obj);
          stub.withArgs(m.string).returns(anObject());
          stub.returns(anObject());
          break;
        case 'each':
          stub.withArgs(m.func).yieldsOn(anObject(), aNumber, anObject());
          break;
        case 'end':
          // Return the previous object (end filtering)
          stub.returns(obj.__prevObj);
          break;
        case 'get':
          stub.withArgs(m.number).returns(anObject());
          stub.returns(anArray());
          break;
        case 'hasClass':
          stub.returns(aBool);
          break;
        case 'height':
        case 'width':
          stub.withArgs(m.string.or(m.number).or(m.func)).returns(obj);
          stub.returns(aNumber);
          break;
        case 'html':
          stub.withArgs(m.string.or(m.func)).returns(obj);
          stub.returns(aString);
          break;
        case 'index':
        case 'innerHeight':
        case 'innerWidth':
        case 'outerHeight':
        case 'outerWidth':
          stub.returns(aNumber);
          break;
        case 'offset':
          stub.withArgs(m.object.or(m.func)).returns(obj);
          stub.returns({top: 0, left: 0});
          break;
        case 'position':
          stub.returns({top: 0, left: 0});
          break;
        case 'promise':
          stub.returns(aPromiseObject());
          break;
        case 'prop':
          stub.withArgs(m.string, m.string.or(m.number).or(m.bool).or(m.func)).returns(obj);
          stub.withArgs(m.string).returns(aBool); // could be any type, override it in your test
          stub.withArgs(m.object).returns(obj);
          break;
        case 'queue':
          stub.withArgs(m.string).returns(anArray());
          stub.withArgs(m.string, m.array.or(m.func)).returns(obj);
          break;
        case 'scrollLeft':
        case 'scrollTop':
          stub.withArgs(m.number).returns(obj);
          stub.returns(aNumber);
          break;
        case 'serialize':
          stub.returns(aString);
          break;
        case 'serializeArray':
        case 'toArray':
          stub.returns(anArray());
          break;
        case 'text':
          stub.withArgs(m.string.or(m.func)).returns(obj);
          stub.returns(aString);
          break;
        case 'triggerHandler':
          stub.returns(anObject()); // could be 'undefined' too, override it in your test
          break;
        case 'val':
          stub.withArgs(m.string.or(m.array).or(m.func)).returns(obj);
          stub.returns(aString); // could be an array too, override it in your test
          break;
        // Return by default the same object.
        default:
          stub.returns(obj);
      }

      obj[method] = stub;
    }

    return obj;
  }

  // Id of the jQuery object
  jquery.__id = 0;
  // jQuery static method names such as 'ajax' or 'unique'
  jquery.__staticStubs = [];
  // jQuery object properties with default values
  jquery.__instanceProperties = {};
  // jQuery object methods
  jquery.__instanceStubs = [];
  // A function to mock event objects
  jquery.__createEventObject = anEventObject;
  // A function to reset the state of static stubs
  jquery.__resetStaticStubs = resetStaticStubs;

  // Traverse the jQuery function object to get all static properties
  // and stub all static methods
  (function() {
    function createStub(method) {
      // Create stubbed method
      var stub = sinon.stub();
      // jQuery API definitions for our stubbed methods:
      // Do order API definitions from more specific to less specific when
      // the position and type of an argument is the same in more than one
      // definition.
      switch (method) {
        case 'extend':
          stub.returns(anObject());
          break;
        case 'trim':
          stub.returnsArg(0);
          break;
        case 'type':
          stub.returns('undefined');
          stub.withArgs(!m.defined).returns('undefined');
          stub.withArgs(null).returns('null');
          stub.withArgs(m.instanceOf(Error)).returns('error');
          stub.withArgs(m.string).returns('string');
          stub.withArgs(m.number).returns('number');
          stub.withArgs(m.bool).returns('boolean');
          stub.withArgs(m.array).returns('array');
          stub.withArgs(m.func).returns('function');
          stub.withArgs(m.date).returns('date');
          stub.withArgs(m.regexp).returns('regexp');
          stub.withArgs(m.object).returns('object'); // always last one!
          break;
      }

      return stub;
    }

    for (var key in $) {
      if ($.hasOwnProperty(key)) {
        // First level methods
        if ($.isFunction($[key])) {
          jquery[key] = createStub(key);
          jquery.__staticStubs.push(key);
        // Nested properties and methods
        } else if ($.isPlainObject($[key])) {
          jquery[key] = {};
          // We're not interested in the prototype
          if (key !== 'fn') {
            for (var subkey in $[key]) {
              if ($[key].hasOwnProperty(subkey)) {
                // First nested level methods
                if ($.isFunction($[key][subkey])) {
                  jquery[key][subkey] = createStub(subkey);
                  jquery.__staticStubs.push({obj: key, stub: subkey});
                // First nested level properties
                } else {
                  jquery[key][subkey] = $[key][subkey];
                }
              }
            }
          }
        // First level properties
        } else {
          jquery[key] = $[key];
        }
      }
    }
  }());

  // Traverse the jQuery prototype to get all properties and methods shared amongst instances.
  (function() {
    for (var prop in $.fn) {
      if ($.fn.hasOwnProperty(prop)) {
        // Methods
        if ($.isFunction($.fn[prop])) {
          jquery.__instanceStubs.push(prop);
        // Properties
        } else {
          jquery.__instanceProperties[prop] = $.fn[prop];
        }
      }
    }
  }());

  function resetStaticStubs() {
    var stubName, i, l;
    // reset jquery stub
    this.reset();
    // reset static stubs
    console.log(this.__staticStubs);
    for (i = 0, l = this.__staticStubs.length; i < l; i++) {
      stubName = this.__staticStubs[i];
      if (typeof stubName.obj !== 'undefined') {
        this[stubName.obj][stubName.stub].reset();
      } else {
        this[stubName].reset();
      }
    }
  }

  // Add a spy to jquery function
  spy = sinon.spy(jquery);

  // Overwrite original jQuery globals (even if AMD is used) with the mock
  window.$ = window.jQuery = spy;

  // Return spy for AMD modules
  return spy;

});