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
			"called": "called",
			"zelf": "zelf"
		}
	@end-include
*/
if( typeof window == "undefined" ){
	var asea = require( "asea" );
	var called = require( "called" );
	var zelf = require( "zelf" );
}

if( typeof window != "undefined" &&
	!( "asea" in window ) )
{
	throw new Error( "asea is not defined" );
}

if( asea.client &&
	!( "called" in window ) )
{
	throw new Error( "called is not defined" );
}

if( asea.client &&
	!( "zelf" in window ) )
{
	throw new Error( "zelf is not defined" );
}

var snapd = function snapd( procedure, timeout ){
	/*;
		@meta-configuration:
			{
				"procedure:required": "function",
				"timeout": "number"
			}
		@end-meta-configuration
	*/

	if( typeof procedure != "function" ){
		throw new Error( "invalid procedure" );
	}

	timeout = timeout || 0;

	var self = zelf( this );

	var cache = { "callback": called.bind( self )( ) };
	var catcher = function catcher( callback ){
		cache.callback = called.bind( self )( callback );

		return cache;
	};

	if( asea.client ){
		var delayedProcedure = setTimeout( function onTimeout( procedure, self, cache ){
			try{
				cache.result = procedure.apply( self );

				cache.callback( null, cache.result );

			}catch( error ){
				cache.callback( error );
			}

			clearTimeout( delayedProcedure );
		}, timeout, procedure, self, cache );

		catcher.timeout = delayedProcedure;

	}else if( asea.server ){
		var delayedProcedure = setTimeout( function onTimeout( procedure, self, cache ){
			process.nextTick( ( function onTick( ){
				var cache = this.cache;

				try{
					cache.result = this.procedure.apply( this.self );

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

		}, timeout, procedure, self, cache );

		catcher.timeout = delayedProcedure;

	}else{
		throw new Error( "cannot determine platform procedure" );
	}

	return catcher;
};

if( asea.server ){
	module.exports = snapd;
}
