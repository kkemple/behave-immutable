import {EventEmitter} from 'events';
import Immutable from 'immutable';

const encode = window.encodeURIComponent;
const hashMap = {};

var isObject = (candidate) => {
    return Object.prototype.toString.call(candidate) === '[object Object]';
};

var statesLookup = (id) => {
    return hashMap[id] || (hashMap[id] = []);
};

var guid = (() => {
    var s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };

    return () => {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
    };
})();

var serialize = (state, urlEncode) => {
    var props = [];

    for (let prop in state) {
        if (!state.hasOwnProperty(prop)) continue;

        if (isObject(state[prop])) {
            props.push(prop + '=' + ((urlEncode) ?
                encode('[' + serialize(state[prop], urlEncode) + ']') :
                '[' + serialize(state[prop], urlEncode) + ']'));
        } else {
            props.push(prop + '=' + ((urlEncode) ? encode(state[prop]) : state[prop]));
        }
    }

    return props.join('&');
};

class BehaveImmutable extends EventEmitter {
    constructor(state) {
        super();

        this._id = 'bi-' + guid();
        if (state) {
            this.set(state);
        }
    }

    get() {
        var states, currentState, clonedState;

        states = statesLookup(this._id);
        currentState = states[states.length - 1];
        if (!currentState) return;
        clonedState = currentState;
        return clonedState;
    }

    set(state, opts={}) {
        var states, currentState, updatedState;

        states = statesLookup(this._id);
        currentState = states[states.length - 1];
        if (!currentState) {
            currentState = Immutable.fromJS(state);
            states.push(currentState);
            if (!opts.silent) this.emit('change', currentState.toJS());
            return currentState;
        }

        state = Immutable.fromJS(state);
        if (Immutable.is(state, currentState)) return currentState;
        updatedState = (opts.reset) ? state : currentState.mergeDeep(state);
        if (opts.replace) states.pop();
        states.push(updatedState);
        if (!opts.silent) this.emit('change', updatedState.toJS());

        return updatedState;
    }

    pop() {
        var state = statesLookup(this._id).pop();
        if (state) return state;
    }

    shift() {
        var state = statesLookup(this._id).shift();
        if (state) return state;
    }

    at(idx) {
        var state = statesLookup(this._id)[idx];
        if (state) return state;
    }

    range(sIdx, eIdx) {
        var states = statesLookup(this._id).slice(sIdx, eIdx + 1);
        if (states.length) return states;
    }

    count() {
        return statesLookup(this._id).length;
    }

    purge() {
        statesLookup(this._id).length = 0;
    }

    toJS() {
        var currentState = this.get();
        if (currentState) return currentState.toJS();
    }

    toJSON() {
        var currentState = this.get();
        if (currentState) return JSON.stringify(currentState);
    }

    serialize(opts={}) {
        var currentState = this.get();
        if (currentState) return serialize(currentState.toJS(), opts.encode);
    }
}

export default BehaveImmutable;
