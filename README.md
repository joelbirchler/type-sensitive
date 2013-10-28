type-sensitive
==============

Experimental type annotations for JavaScript. Type-sensitive adds checks to function arguments that can throw errors
at run time.

## Usage

I've implemented type-sensitive as a CommonJS module. You can include it with [Node.js](http://nodejs.org/) or
[Browserify](https://github.com/substack/node-browserify). Either way, you'll require it like this:

    var safe = require('./safe.js');

This will give you one function: `safe(func, [predicates...])`. Safe accepts a function and returns you a 
safe-ified function. This new safe-ified function will run any predicate checks against it's arguments. For example,

    safe(someFunction, "String", "Array");
    
will return a function that expects a String as the first parameter and an Array as the second parameter.

    var testFunc = function(n) {};
    var func = safe(testFunc, "Number");
    func(42); // no problem-o
    func("Sasquatch"); // Throws Error!
    
### Custom Predicates

The provided predicates test for standard types. You can also write your own predicates by passing a function instead
of a string.

    var testFunc = function(n) {};
    var odd = function(n) { return n % 2; };
    var func = safe(testFunc, odd);
    func(41); // Odd.
    func(42); // Even. Throws Error!

### Comment Syntax!

*Not yet implemented.*

Calling toString() on a non-native function returns the source code for the function including comments. This allows us to 
annotate our functions with predicates via comments.

    var testFunc = function(n /* Number */, s /* String */) {};
    var func = safe(testFunc);

In order to support custom predicates, we add them as properties of `safe`.

    safe.positive = function(n) { n >=0; }
    var testFunc = function(n /* positive */);

## Tests

Running `node test.js` will kick off the tests.

I've included a couple of testing functions `works()` and `borks()` which are meant to log whether something threw 
an error and whether that was expected or not. The tests create functions bound to these testers for easy testing. So,
instead of:

    borks(nameOfSomeFunction, arg1, arg2);
    
We call borks as if we were calling the function we are testing:

    borksFuncName(arg1, arg2);
    
