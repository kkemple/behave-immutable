# behave-immutable
An immutable data store that keeps state history

In most cases when you want to update a model/store, you will also want access to it's previous states, in a lot of frameworks this is something you have to design on your own even though this is how a model should behave.

BehaveImmutable depends on Facebook's [Immutable](http://facebook.github.io/immutable-js/) library under the hood, when you pull state from the stack it will return you an instance of Immutable.

### Install

```bash
npm install --save behave-immutable
```

### Usage

```javascript

const immutable = new BehaveImmutable({ state: { some: 'value' } });

// working with state from the stack
let currentState = immutable.get(); // => latest state

let removeLastState = immutable.pop(); // => latest state, removing from stack

let removeFirstState = immutable.shift(); // => first state, removing from stack

let atIndex = immutable.at(someIndex); // => copy of state at index, non-destructive

let range = immutable.range(start, end); // => array of states in range (including end index)

immutable.purge(); // => empties the stack

// sugar methods to transform latest state
immutable.toJS(); // => { state: { some: 'value' } }

immutable.toJSON(); // => { "state": { "some": "value" } }

immutable.serialize(); => "state=[some=value]"
```

### Release History

- 0.1.0 Initial release