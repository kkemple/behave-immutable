# behave-immutable
An immutable data store that keeps state history

[ ![Codeship Status for behavejs/behave-immutable](https://codeship.com/projects/d9102350-8535-0132-e590-0aaee77afcf8/status?branch=master)](https://codeship.com/projects/58641)

In most cases when you want to update a model/store, you will also want access to it's previous states, in a lot of frameworks this is something you have to design on your own even though this is how a model should behave.

`behave-immutable` depends on Facebook's [Immutable](http://facebook.github.io/immutable-js/) library under the hood, when you pull state from the stack it will return you an instance of Immutable.

### Install

```shell
npm install --save behave-immutable
```

### Usage

```js

// anything passed to constructor will be set as first state
const immutable = new BehaveImmutable({ some: 'value' });

// setting state
immutable.set({ another: 'value' });
immutable.toJS(); // => { some: 'value', another: 'value' }
immutable.at(1).toJS(); // => { some: 'value' }

// resetting state
immutable.set({ another: 'value' }, { reset: true });
immutable.toJS(); // => { another: 'value' }
immutable.at(1).toJS(); // => { some: 'value' }


// replacing state
immutable.set({ another: 'value' }, { reset: true, replace: true });
immutable.toJS(); // => { another: 'value' }
immutable.at(1); // => undefined
immutable.count(); // => 1

// working with state from the stack
let currentState = immutable.get(); // => latest state

let removeLastState = immutable.pop(); // => latest state, removing from stack

let removeFirstState = immutable.shift(); // => first state, removing from stack

let atIndex = immutable.at(someIndex); // => copy of state at index, non-destructive

let range = immutable.range(start, end); // => array of states in range (including end index)

immutable.purge(); // => empties the stack

// sugar methods to transform latest state
immutable.toJS(); // => { some: 'value', another: 'value' }

immutable.toJSON(); // => { "some": "value", "another": "value" }

immutable.serialize(); // => "some=value&another=value"
```

### Testing
To run the tests for `behave-immutable` simply run `npm test`

### Release History

- 0.1.0 Initial release
- 0.1.1 Fixed improper encoding on serialize
- 0.1.2 Added test instructions to readme
- 0.1.3 Minor refactoring
- 0.1.4 Fixed incorrect main file in package.json
- 0.1.5 Added build badge
- 0.1.6 More descriptive examples in readme
- 0.1.7 Fixed errors in examples
- 0.1.8 Fixed error when setting initial state

