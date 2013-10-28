var predicates = {};

var toStringTypeTest = function(typeName, x) {
  return toString.call(x) == '[object ' + typeName +']';
};

['String', 'Number', 'Boolean', 'Date', 'RegExp', 'Array', 'Object', 'Function'].forEach(function(typeName) {
  predicates[typeName] = toStringTypeTest.bind(predicates, typeName);
});

var toArray = function(obj, start) {
  return Array.prototype.slice.call(obj, start);
};

var bruteArity = [
  function(func) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); },
  function(func, x, x, x, x, x, x, x, x, x) { return func.apply(this, toArray(arguments, 1)); }
  /* beyond this and we explode... */
];

var safe = function(func /*, argPredicates... */) {
  var restArgs = toArray(arguments, 1);
  var argPredicates = restArgs.map(function(arg) {
    return predicates.Function(arg) ? arg : predicates[arg];
  });

  var safeFunc = function() {
    var args = toArray(arguments);

    args.forEach(function(arg, i) {
      if (!argPredicates[i](arg)) { throw "Function " + func + " expected " + restArgs[i] + " in position " + (i + 1); }
    });

    return func.apply(this, args);
  };

  return bruteArity[func.length].bind(this, safeFunc);
};

module.exports = safe;