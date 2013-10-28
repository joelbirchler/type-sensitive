//
// Setup some cheap test functions: `works(func, args...)` and `borks(func, args...)`. Both 
// call a function with given arguments inside of a try/catch. `works()` expects no error
// to be thrown and logs accordingly. `borks()` expects an error to be trhown and logs a
// success message if it does.
//

var slice = Array.prototype.slice,
  concat = Array.prototype.concat;

var tail = function(array, index) {
  if (arguments.length == 1) { index = 1; }
  return slice.call(array, index);
};

var logger = function(logFunc, prefix) {
  return function(/* message, message... */) { 
    logFunc.apply(this, concat.call([], prefix, tail(arguments, 0))); 
  };
};

var logSuccess = logger(console.log, '✓');
var logFail = logger(console.warn, 'x');

var tryCatch = function(worked, borked, func, args) {
  try {
    func.apply(this, args);
  } catch (e) {
    borked(e);
    return false;
  }

  worked();
  return true;
};

exports.works = function(func /*, args... */) {
  tryCatch(logSuccess, logFail, func, tail(arguments)); 
};

exports.borks = function(func /*, args... */) {
  var args = tail(arguments);
  tryCatch(logFail.bind(this, 'Failed to throw error', args), logSuccess, func, args); 
};