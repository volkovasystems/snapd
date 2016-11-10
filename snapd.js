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

if( typeof require == "function" ){
	var asea = require( "asea" );
	var budge = require( "budge" );
	var letgo = require( "letgo" );
	var protype = require( "protype" );
	var zelf = require( "zelf" );
}

if( typeof window != "undefined" && !( "asea" in window ) ){
	throw new Error( "asea is not defined" );
}

if( typeof window != "undefined" && !( "budge" in window ) ){
	throw new Error( "budge is not defined" );
}

if( typeof window != "undefined" && !( "letgo" in window ) ){
	throw new Error( "letgo is not defined" );
}

if( typeof window != "undefined" && !( "protype" in window ) ){
	throw new Error( "protype is not defined" );
}

if( typeof window != "undefined" && !( "zelf" in window ) ){
	throw new Error( "zelf is not defined" );
}

var snapd = function snapd( procedure, timeout, parameter ){
	/*;
		@meta-configuration:
			{
				"procedure:required": "function",
				"timeout": "number",
				"parameter": "..."
			}
		@end-meta-configuration
	*/

	if( !protype( procedure, FUNCTION ) ){
		throw new Error( "invalid procedure" );
	}

	timeout = timeout || 0;

	let self = zelf( this );

	let catcher = letgo.bind( self )( );

	parameter = budge( arguments, 2 );

	if( asea.client ){
		let delayedProcedure = setTimeout( function onTimeout( procedure, self, cache ){
			try{
				cache.result = procedure.apply( self, parameter );

				cache.callback( null, cache.result );

			}catch( error ){
				cache.callback( error );
			}

			clearTimeout( delayedProcedure );
		}, timeout, procedure, self, catcher.cache );

		catcher.timeout = delayedProcedure;

	}else if( asea.server ){
		let delayedProcedure = setTimeout( function onTimeout( procedure, self, cache ){
			process.nextTick( ( function onTick( ){
				let cache = this.cache;

				try{
					cache.result = this.procedure.apply( this.self, parameter );

					cache.callback( null, cache.result );

				}catch( error ){
					cache.callback( error );
				}

				clearTimeout( this.timeout );

			} ).bind( {
				"cache": cache,
				"procedure": procedure,
				"timeout": delayedProcedure,
				"self": self
			} ) );

		}, timeout, procedure, self, catcher.cache );

		catcher.timeout = delayedProcedure;

	}else{
		throw new Error( "cannot determine platform procedure" );
	}

	return catcher;
};

if( typeof module != "undefined" && typeof module.exports != "undefined" ){
	module.exports = snapd;
}
