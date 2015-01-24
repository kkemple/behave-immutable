"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var EventEmitter = require("events").EventEmitter;
var Immutable = _interopRequire(require("immutable"));

var encode = window.encodeURIComponent;
var hashMap = {};

var isObject = function (candidate) {
  return Object.prototype.toString.call(candidate) === "[object Object]";
};

var statesLookup = function (id) {
  return hashMap[id] || (hashMap[id] = []);
};

var guid = (function () {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  };

  return function () {
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };
})();

var serialize = function (state, urlEncode) {
  var props = [];

  for (var prop in state) {
    if (!state.hasOwnProperty(prop)) continue;

    if (isObject(state[prop])) {
      props.push(prop + "=" + (urlEncode ? encode("[" + serialize(state[prop], urlEncode) + "]") : "[" + serialize(state[prop], urlEncode) + "]"));
    } else {
      props.push(prop + "=" + (urlEncode ? encode(state[prop]) : state[prop]));
    }
  }

  return props.join("&");
};

var BehaveImmutable = (function (EventEmitter) {
  function BehaveImmutable() {
    var opts = arguments[0] === undefined ? {} : arguments[0];
    _get(Object.getPrototypeOf(BehaveImmutable.prototype), "constructor", this).call(this);

    this._id = "bi-" + guid();
    if (opts.state) {
      this.set(opts.state);
    }
  }

  _inherits(BehaveImmutable, EventEmitter);

  _prototypeProperties(BehaveImmutable, null, {
    get: {
      value: function get() {
        var states, currentState, clonedState;

        states = statesLookup(this._id);
        currentState = states[states.length - 1];
        if (!currentState) return;
        clonedState = currentState;
        return clonedState;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    set: {
      value: function set(state) {
        var opts = arguments[1] === undefined ? {} : arguments[1];
        var states, currentState, updatedState;

        states = statesLookup(this._id);
        currentState = states[states.length - 1];
        if (!currentState) {
          currentState = Immutable.fromJS(state);
          states.push(currentState);
          if (!opts.silent) this.emit("change", currentState.toJS());
          return currentState;
        }

        state = Immutable.fromJS(state);
        if (Immutable.is(state, currentState)) return currentState;
        updatedState = opts.reset ? state : currentState.mergeDeep(state);
        if (opts.replace) states.pop();
        states.push(updatedState);
        if (!opts.silent) this.emit("change", updatedState.toJS());

        return updatedState;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    pop: {
      value: function pop() {
        var state = statesLookup(this._id).pop();
        if (state) return state;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    shift: {
      value: function shift() {
        var state = statesLookup(this._id).shift();
        if (state) return state;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    at: {
      value: function at(idx) {
        var state = statesLookup(this._id)[idx];
        if (state) return state;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    range: {
      value: function range(sIdx, eIdx) {
        var states = statesLookup(this._id).slice(sIdx, eIdx + 1);
        if (states.length) return states;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    count: {
      value: function count() {
        return statesLookup(this._id).length;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    purge: {
      value: function purge() {
        statesLookup(this._id).length = 0;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toJS: {
      value: function toJS() {
        var currentState = this.get();
        if (currentState) return currentState.toJS();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toJSON: {
      value: function toJSON() {
        var currentState = this.get();
        if (currentState) return JSON.stringify(currentState);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    serialize: {
      value: (function (_serialize) {
        var _serializeWrapper = function serialize() {
          return _serialize.apply(this, arguments);
        };

        _serializeWrapper.toString = function () {
          return _serialize.toString();
        };

        return _serializeWrapper;
      })(function () {
        var opts = arguments[0] === undefined ? {} : arguments[0];
        var currentState = this.get();
        if (currentState) return serialize(currentState.toJS(), opts.encode);
      }),
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return BehaveImmutable;
})(EventEmitter);

module.exports = BehaveImmutable;