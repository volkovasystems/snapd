"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "snapd",
			"path": "snapd/snapd.js",
			"file": "snapd.js",
			"module": "snapd",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/snapd.git",``
			"test": "snapd-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Wraps the function in process.nextTick and setTimeout for server based,
			and setTimeout for client based.

		Callback is optional, this will execute the procedure even if callback is not given.
	@end-module-documentation

	@include:
		{
			"asea": "asea",
			"budge": "budge",
			"letgo": "letgo",
			"protype": "protype",
			"zelf": "zelf"
		}
	@end-include
*/

var asea = require("asea");
var budge = require("budge");
var letgo = require("letgo");
var protype = require("protype");
var zelf = require("zelf");

var snapd = function snapd(procedure, timeout, parameter) {
	/*;
 	@meta-configuration:
 		{
 			"procedure:required": "function",
 			"timeout": "number",
 			"parameter": "..."
 		}
 	@end-meta-configuration
 */

	if (!protype(procedure, FUNCTION)) {
		throw new Error("invalid procedure");
	}

	timeout = timeout || 0;

	var self = zelf(this);

	var catcher = letgo.bind(self)();

	parameter = budge(arguments, 2);

	if (asea.client) {
		(function () {
			var delayedProcedure = setTimeout(function onTimeout(procedure, self, cache) {
				try {
					cache.result = procedure.apply(self, parameter);

					cache.callback(null, cache.result);
				} catch (error) {
					cache.callback(error);
				}

				clearTimeout(delayedProcedure);
			}, timeout, procedure, self, catcher.cache);

			catcher.timeout = delayedProcedure;
		})();
	} else if (asea.server) {
		(function () {
			var delayedProcedure = setTimeout(function onTimeout(procedure, self, cache) {
				process.nextTick(function onTick() {
					var cache = this.cache,
					    parameter = this.parameter,
					    procedure = this.procedure,
					    timeout = this.timeout,
					    self = this.self;


					try {
						cache.result = procedure.apply(self, parameter);

						cache.callback(null, cache.result);
					} catch (error) {
						cache.callback(error);
					}

					clearTimeout(timeout);
				}.bind({
					"cache": cache,
					"parameter": parameter,
					"procedure": procedure,
					"timeout": delayedProcedure,
					"self": self
				}));
				/*;
    	@note:
    		Do not change how we bind this data.
    			nextTick procedure has a special way of handling context.
    	@end-note
    */
			}, timeout, procedure, self, catcher.cache);

			catcher.timeout = delayedProcedure;
		})();
	} else {
		throw new Error("cannot determine platform procedure");
	}

	return catcher;
};

module.exports = snapd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNuYXBkLmpzIl0sIm5hbWVzIjpbImFzZWEiLCJyZXF1aXJlIiwiYnVkZ2UiLCJsZXRnbyIsInByb3R5cGUiLCJ6ZWxmIiwic25hcGQiLCJwcm9jZWR1cmUiLCJ0aW1lb3V0IiwicGFyYW1ldGVyIiwiRlVOQ1RJT04iLCJFcnJvciIsInNlbGYiLCJjYXRjaGVyIiwiYmluZCIsImFyZ3VtZW50cyIsImNsaWVudCIsImRlbGF5ZWRQcm9jZWR1cmUiLCJzZXRUaW1lb3V0Iiwib25UaW1lb3V0IiwiY2FjaGUiLCJyZXN1bHQiLCJhcHBseSIsImNhbGxiYWNrIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJzZXJ2ZXIiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJvblRpY2siLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJEQSxJQUFNQSxPQUFPQyxRQUFTLE1BQVQsQ0FBYjtBQUNBLElBQU1DLFFBQVFELFFBQVMsT0FBVCxDQUFkO0FBQ0EsSUFBTUUsUUFBUUYsUUFBUyxPQUFULENBQWQ7QUFDQSxJQUFNRyxVQUFVSCxRQUFTLFNBQVQsQ0FBaEI7QUFDQSxJQUFNSSxPQUFPSixRQUFTLE1BQVQsQ0FBYjs7QUFFQSxJQUFNSyxRQUFRLFNBQVNBLEtBQVQsQ0FBZ0JDLFNBQWhCLEVBQTJCQyxPQUEzQixFQUFvQ0MsU0FBcEMsRUFBK0M7QUFDNUQ7Ozs7Ozs7Ozs7QUFVQSxLQUFJLENBQUNMLFFBQVNHLFNBQVQsRUFBb0JHLFFBQXBCLENBQUwsRUFBcUM7QUFDcEMsUUFBTSxJQUFJQyxLQUFKLENBQVcsbUJBQVgsQ0FBTjtBQUNBOztBQUVESCxXQUFVQSxXQUFXLENBQXJCOztBQUVBLEtBQUlJLE9BQU9QLEtBQU0sSUFBTixDQUFYOztBQUVBLEtBQUlRLFVBQVVWLE1BQU1XLElBQU4sQ0FBWUYsSUFBWixHQUFkOztBQUVBSCxhQUFZUCxNQUFPYSxTQUFQLEVBQWtCLENBQWxCLENBQVo7O0FBRUEsS0FBSWYsS0FBS2dCLE1BQVQsRUFBaUI7QUFBQTtBQUNoQixPQUFJQyxtQkFBbUJDLFdBQVksU0FBU0MsU0FBVCxDQUFvQlosU0FBcEIsRUFBK0JLLElBQS9CLEVBQXFDUSxLQUFyQyxFQUE0QztBQUM5RSxRQUFHO0FBQ0ZBLFdBQU1DLE1BQU4sR0FBZWQsVUFBVWUsS0FBVixDQUFpQlYsSUFBakIsRUFBdUJILFNBQXZCLENBQWY7O0FBRUFXLFdBQU1HLFFBQU4sQ0FBZ0IsSUFBaEIsRUFBc0JILE1BQU1DLE1BQTVCO0FBRUEsS0FMRCxDQUtDLE9BQU9HLEtBQVAsRUFBYztBQUNkSixXQUFNRyxRQUFOLENBQWdCQyxLQUFoQjtBQUNBOztBQUVEQyxpQkFBY1IsZ0JBQWQ7QUFDQSxJQVhzQixFQVdwQlQsT0FYb0IsRUFXWEQsU0FYVyxFQVdBSyxJQVhBLEVBV01DLFFBQVFPLEtBWGQsQ0FBdkI7O0FBYUFQLFdBQVFMLE9BQVIsR0FBa0JTLGdCQUFsQjtBQWRnQjtBQWdCaEIsRUFoQkQsTUFnQk0sSUFBSWpCLEtBQUswQixNQUFULEVBQWlCO0FBQUE7QUFDdEIsT0FBSVQsbUJBQW1CQyxXQUFZLFNBQVNDLFNBQVQsQ0FBb0JaLFNBQXBCLEVBQStCSyxJQUEvQixFQUFxQ1EsS0FBckMsRUFBNEM7QUFDOUVPLFlBQVFDLFFBQVIsQ0FBb0IsU0FBU0MsTUFBVCxHQUFrQjtBQUFBLFNBQy9CVCxLQUQrQixHQUNnQixJQURoQixDQUMvQkEsS0FEK0I7QUFBQSxTQUN4QlgsU0FEd0IsR0FDZ0IsSUFEaEIsQ0FDeEJBLFNBRHdCO0FBQUEsU0FDYkYsU0FEYSxHQUNnQixJQURoQixDQUNiQSxTQURhO0FBQUEsU0FDRkMsT0FERSxHQUNnQixJQURoQixDQUNGQSxPQURFO0FBQUEsU0FDT0ksSUFEUCxHQUNnQixJQURoQixDQUNPQSxJQURQOzs7QUFHckMsU0FBRztBQUNGUSxZQUFNQyxNQUFOLEdBQWVkLFVBQVVlLEtBQVYsQ0FBaUJWLElBQWpCLEVBQXVCSCxTQUF2QixDQUFmOztBQUVBVyxZQUFNRyxRQUFOLENBQWdCLElBQWhCLEVBQXNCSCxNQUFNQyxNQUE1QjtBQUVBLE1BTEQsQ0FLQyxPQUFPRyxLQUFQLEVBQWM7QUFDZEosWUFBTUcsUUFBTixDQUFnQkMsS0FBaEI7QUFDQTs7QUFFREMsa0JBQWNqQixPQUFkO0FBRUEsS0FkaUIsQ0FjZE0sSUFkYyxDQWNSO0FBQ1QsY0FBU00sS0FEQTtBQUVULGtCQUFhWCxTQUZKO0FBR1Qsa0JBQWFGLFNBSEo7QUFJVCxnQkFBV1UsZ0JBSkY7QUFLVCxhQUFRTDtBQUxDLEtBZFEsQ0FBbEI7QUFxQkE7Ozs7OztBQVFBLElBOUJzQixFQThCcEJKLE9BOUJvQixFQThCWEQsU0E5QlcsRUE4QkFLLElBOUJBLEVBOEJNQyxRQUFRTyxLQTlCZCxDQUF2Qjs7QUFnQ0FQLFdBQVFMLE9BQVIsR0FBa0JTLGdCQUFsQjtBQWpDc0I7QUFtQ3RCLEVBbkNLLE1BbUNEO0FBQ0osUUFBTSxJQUFJTixLQUFKLENBQVcscUNBQVgsQ0FBTjtBQUNBOztBQUVELFFBQU9FLE9BQVA7QUFDQSxDQS9FRDs7QUFpRkFpQixPQUFPQyxPQUFQLEdBQWlCekIsS0FBakIiLCJmaWxlIjoic25hcGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKjtcblx0QG1vZHVsZS1saWNlbnNlOlxuXHRcdFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXHRcdEBtaXQtbGljZW5zZVxuXG5cdFx0Q29weXJpZ2h0IChAYykgMjAxNiBSaWNoZXZlIFNpb2RpbmEgQmViZWRvclxuXHRcdEBlbWFpbDogcmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVxuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuXHRcdG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcblx0XHRpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG5cdFx0dG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuXHRcdGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuXHRcdGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcblx0XHRjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuXHRcdElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuXHRcdEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuXHRcdEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcblx0XHRMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuXHRcdE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5cdFx0U09GVFdBUkUuXG5cdEBlbmQtbW9kdWxlLWxpY2Vuc2VcblxuXHRAbW9kdWxlLWNvbmZpZ3VyYXRpb246XG5cdFx0e1xuXHRcdFx0XCJwYWNrYWdlXCI6IFwic25hcGRcIixcblx0XHRcdFwicGF0aFwiOiBcInNuYXBkL3NuYXBkLmpzXCIsXG5cdFx0XHRcImZpbGVcIjogXCJzbmFwZC5qc1wiLFxuXHRcdFx0XCJtb2R1bGVcIjogXCJzbmFwZFwiLFxuXHRcdFx0XCJhdXRob3JcIjogXCJSaWNoZXZlIFMuIEJlYmVkb3JcIixcblx0XHRcdFwiZU1haWxcIjogXCJyaWNoZXZlLmJlYmVkb3JAZ21haWwuY29tXCIsXG5cdFx0XHRcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdm9sa292YXN5c3RlbXMvc25hcGQuZ2l0XCIsYGBcblx0XHRcdFwidGVzdFwiOiBcInNuYXBkLXRlc3QuanNcIixcblx0XHRcdFwiZ2xvYmFsXCI6IHRydWVcblx0XHR9XG5cdEBlbmQtbW9kdWxlLWNvbmZpZ3VyYXRpb25cblxuXHRAbW9kdWxlLWRvY3VtZW50YXRpb246XG5cdFx0V3JhcHMgdGhlIGZ1bmN0aW9uIGluIHByb2Nlc3MubmV4dFRpY2sgYW5kIHNldFRpbWVvdXQgZm9yIHNlcnZlciBiYXNlZCxcblx0XHRcdGFuZCBzZXRUaW1lb3V0IGZvciBjbGllbnQgYmFzZWQuXG5cblx0XHRDYWxsYmFjayBpcyBvcHRpb25hbCwgdGhpcyB3aWxsIGV4ZWN1dGUgdGhlIHByb2NlZHVyZSBldmVuIGlmIGNhbGxiYWNrIGlzIG5vdCBnaXZlbi5cblx0QGVuZC1tb2R1bGUtZG9jdW1lbnRhdGlvblxuXG5cdEBpbmNsdWRlOlxuXHRcdHtcblx0XHRcdFwiYXNlYVwiOiBcImFzZWFcIixcblx0XHRcdFwiYnVkZ2VcIjogXCJidWRnZVwiLFxuXHRcdFx0XCJsZXRnb1wiOiBcImxldGdvXCIsXG5cdFx0XHRcInByb3R5cGVcIjogXCJwcm90eXBlXCIsXG5cdFx0XHRcInplbGZcIjogXCJ6ZWxmXCJcblx0XHR9XG5cdEBlbmQtaW5jbHVkZVxuKi9cblxuY29uc3QgYXNlYSA9IHJlcXVpcmUoIFwiYXNlYVwiICk7XG5jb25zdCBidWRnZSA9IHJlcXVpcmUoIFwiYnVkZ2VcIiApO1xuY29uc3QgbGV0Z28gPSByZXF1aXJlKCBcImxldGdvXCIgKTtcbmNvbnN0IHByb3R5cGUgPSByZXF1aXJlKCBcInByb3R5cGVcIiApO1xuY29uc3QgemVsZiA9IHJlcXVpcmUoIFwiemVsZlwiICk7XG5cbmNvbnN0IHNuYXBkID0gZnVuY3Rpb24gc25hcGQoIHByb2NlZHVyZSwgdGltZW91dCwgcGFyYW1ldGVyICl7XG5cdC8qO1xuXHRcdEBtZXRhLWNvbmZpZ3VyYXRpb246XG5cdFx0XHR7XG5cdFx0XHRcdFwicHJvY2VkdXJlOnJlcXVpcmVkXCI6IFwiZnVuY3Rpb25cIixcblx0XHRcdFx0XCJ0aW1lb3V0XCI6IFwibnVtYmVyXCIsXG5cdFx0XHRcdFwicGFyYW1ldGVyXCI6IFwiLi4uXCJcblx0XHRcdH1cblx0XHRAZW5kLW1ldGEtY29uZmlndXJhdGlvblxuXHQqL1xuXG5cdGlmKCAhcHJvdHlwZSggcHJvY2VkdXJlLCBGVU5DVElPTiApICl7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludmFsaWQgcHJvY2VkdXJlXCIgKTtcblx0fVxuXG5cdHRpbWVvdXQgPSB0aW1lb3V0IHx8IDA7XG5cblx0bGV0IHNlbGYgPSB6ZWxmKCB0aGlzICk7XG5cblx0bGV0IGNhdGNoZXIgPSBsZXRnby5iaW5kKCBzZWxmICkoICk7XG5cblx0cGFyYW1ldGVyID0gYnVkZ2UoIGFyZ3VtZW50cywgMiApO1xuXG5cdGlmKCBhc2VhLmNsaWVudCApe1xuXHRcdGxldCBkZWxheWVkUHJvY2VkdXJlID0gc2V0VGltZW91dCggZnVuY3Rpb24gb25UaW1lb3V0KCBwcm9jZWR1cmUsIHNlbGYsIGNhY2hlICl7XG5cdFx0XHR0cnl7XG5cdFx0XHRcdGNhY2hlLnJlc3VsdCA9IHByb2NlZHVyZS5hcHBseSggc2VsZiwgcGFyYW1ldGVyICk7XG5cblx0XHRcdFx0Y2FjaGUuY2FsbGJhY2soIG51bGwsIGNhY2hlLnJlc3VsdCApO1xuXG5cdFx0XHR9Y2F0Y2goIGVycm9yICl7XG5cdFx0XHRcdGNhY2hlLmNhbGxiYWNrKCBlcnJvciApO1xuXHRcdFx0fVxuXG5cdFx0XHRjbGVhclRpbWVvdXQoIGRlbGF5ZWRQcm9jZWR1cmUgKTtcblx0XHR9LCB0aW1lb3V0LCBwcm9jZWR1cmUsIHNlbGYsIGNhdGNoZXIuY2FjaGUgKTtcblxuXHRcdGNhdGNoZXIudGltZW91dCA9IGRlbGF5ZWRQcm9jZWR1cmU7XG5cblx0fWVsc2UgaWYoIGFzZWEuc2VydmVyICl7XG5cdFx0bGV0IGRlbGF5ZWRQcm9jZWR1cmUgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiBvblRpbWVvdXQoIHByb2NlZHVyZSwgc2VsZiwgY2FjaGUgKXtcblx0XHRcdHByb2Nlc3MubmV4dFRpY2soICggZnVuY3Rpb24gb25UaWNrKCApe1xuXHRcdFx0XHRsZXQgeyBjYWNoZSwgcGFyYW1ldGVyLCBwcm9jZWR1cmUsIHRpbWVvdXQsIHNlbGYgfSA9IHRoaXM7XG5cblx0XHRcdFx0dHJ5e1xuXHRcdFx0XHRcdGNhY2hlLnJlc3VsdCA9IHByb2NlZHVyZS5hcHBseSggc2VsZiwgcGFyYW1ldGVyICk7XG5cblx0XHRcdFx0XHRjYWNoZS5jYWxsYmFjayggbnVsbCwgY2FjaGUucmVzdWx0ICk7XG5cblx0XHRcdFx0fWNhdGNoKCBlcnJvciApe1xuXHRcdFx0XHRcdGNhY2hlLmNhbGxiYWNrKCBlcnJvciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG5cblx0XHRcdH0gKS5iaW5kKCB7XG5cdFx0XHRcdFwiY2FjaGVcIjogY2FjaGUsXG5cdFx0XHRcdFwicGFyYW1ldGVyXCI6IHBhcmFtZXRlcixcblx0XHRcdFx0XCJwcm9jZWR1cmVcIjogcHJvY2VkdXJlLFxuXHRcdFx0XHRcInRpbWVvdXRcIjogZGVsYXllZFByb2NlZHVyZSxcblx0XHRcdFx0XCJzZWxmXCI6IHNlbGZcblx0XHRcdH0gKSApO1xuXHRcdFx0Lyo7XG5cdFx0XHRcdEBub3RlOlxuXHRcdFx0XHRcdERvIG5vdCBjaGFuZ2UgaG93IHdlIGJpbmQgdGhpcyBkYXRhLlxuXG5cdFx0XHRcdFx0bmV4dFRpY2sgcHJvY2VkdXJlIGhhcyBhIHNwZWNpYWwgd2F5IG9mIGhhbmRsaW5nIGNvbnRleHQuXG5cdFx0XHRcdEBlbmQtbm90ZVxuXHRcdFx0Ki9cblxuXHRcdH0sIHRpbWVvdXQsIHByb2NlZHVyZSwgc2VsZiwgY2F0Y2hlci5jYWNoZSApO1xuXG5cdFx0Y2F0Y2hlci50aW1lb3V0ID0gZGVsYXllZFByb2NlZHVyZTtcblxuXHR9ZWxzZXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiY2Fubm90IGRldGVybWluZSBwbGF0Zm9ybSBwcm9jZWR1cmVcIiApO1xuXHR9XG5cblx0cmV0dXJuIGNhdGNoZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNuYXBkO1xuIl19
