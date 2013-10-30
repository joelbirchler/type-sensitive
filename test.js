var worksborks = require('./worksborks.js'),
	works = worksborks.works,
	borks = worksborks.borks,
	safe = require('./safe.js');


var title = function(message) {
	console.log('--- ' + message.toUpperCase() + ' ---');
};


//
// Test basic argument safety
//

title('Basic Args');

var numStrFunc = function (num, str) { /* ... do stuff ... */ };
var ns = safe(numStrFunc, "Number", "String");
var nsWorks = works.bind(this, ns);
var nsBorks = borks.bind(this, ns);

nsWorks(42, "42");
nsBorks([1,2,3], "42");
nsBorks(42, 42);


title('No Arguments');

var emptyFunc = function () { /* ... do stuff ... */ };
var e = safe(emptyFunc);
var eWorks = works.bind(this, e);

eWorks();


//
// Test custom predicate safety
//

title('Custom Predicate');

var positiveNumFunc = function(num) { /* ... do stuff ... */ };
var pn = safe(positiveNumFunc, function(n) { return n >= 0; });
var pnWorks = works.bind(this, pn);
var pnBorks = borks.bind(this, pn);

pnWorks(12);
pnWorks(3.14);
pnWorks(0);
pnBorks(-273.15);


//
// Test supporting comments via function.toString()
//

var commentFunc = safe(function(num /* Number */, s /* String */) { return 42; });
var cWorks = works.bind(this, commentFunc);
var cBorks = borks.bind(this, commentFunc);

cWorks(4, 'apricot');
cBorks(42, 108);


//
// Test custom predicates attached to `safe`
//

safe.predicates.isLongEnough = function(n) { return n.length > 6; };
var shortFunc = safe(function(password /* isLongEnough */) { /* ... do stuff ... */ });
var shortWorks = works.bind(this, shortFunc);
var shortBorks = borks.bind(this, shortFunc);

shortWorks('foobarhowdyhey');
shortBorks('foo');