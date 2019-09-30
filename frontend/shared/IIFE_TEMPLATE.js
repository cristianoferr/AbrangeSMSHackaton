/* exported myNamespace */
/* eslint no-var: 0 */
var myNamespace = (function () {

	'use strict';

	let myPrivateVar;
	let myPrivateMethod;

	// A private counter variable
	myPrivateVar = 0;

	// A private function which logs any arguments
	myPrivateMethod = function (foo) {
		console.log(foo);
		console.log(myPrivateVar);
	};

	return {

		// A public variable
		myPublicVar: 'foo',

		// A public function utilizing privates
		myPublicFunction: function (bar) {

			// Increment our private counter
			myPrivateVar++;

			// Call our private method using bar
			myPrivateMethod(bar);

		}
	};

})();