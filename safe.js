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

var argComments = function(func) {
  var s = func.toString();
  var args = s.slice(s.indexOf('('), s.indexOf(')'));

  var re = /\/\*\s*(\S+)\s*\*\//g;
  var matches = [], match;
  while (match = re.exec(s)) { 
    matches.push(match[1]) 
  }

  return matches;
};

var safe = function(func /*, argPredicates... */) {
  var restArgs = toArray(arguments, 1);

  if (!restArgs.length) { restArgs = argComments(func); }

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

safe.predicates = predicates;

module.exports = safe;