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

const asea = require( "asea" );
const budge = require( "budge" );
const letgo = require( "letgo" );
const protype = require( "protype" );
const zelf = require( "zelf" );

const snapd = function snapd( procedure, timeout, parameter ){
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
				let { cache, parameter, procedure, timeout, self } = this;

				try{
					cache.result = procedure.apply( self, parameter );

					cache.callback( null, cache.result );

				}catch( error ){
					cache.callback( error );
				}

				clearTimeout( timeout );

			} ).bind( {
				"cache": cache,
				"parameter": parameter,
				"procedure": procedure,
				"timeout": delayedProcedure,
				"self": self
			} ) );
			/*;
				@note:
					Do not change how we bind this data.

					nextTick procedure has a special way of handling context.
				@end-note
			*/

		}, timeout, procedure, self, catcher.cache );

		catcher.timeout = delayedProcedure;

	}else{
		throw new Error( "cannot determine platform procedure" );
	}

	return catcher;
};

module.exports = snapd;
