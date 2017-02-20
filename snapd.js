"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
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
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
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
			"harden": "harden",
			"impel": "impel",
			"kein": "kein",
			"letgo": "letgo",
			"pringe": "pringe",
			"protype": "protype",
			"truly": "truly",
			"zelf": "zelf"
		}
	@end-include
*/

const asea = require( "asea" );
const budge = require( "budge" );
const harden = require( "harden" );
const impel = require( "impel" );
const kein = require( "kein" );
const letgo = require( "letgo" );
const pringe = require( "pringe" );
const protype = require( "protype" );
const truly = require( "truly" );
const zelf = require( "zelf" );

const DONE = "done";

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

	if( truly( timeout ) && !protype( timeout, NUMBER ) ){
		throw new Error( "invalid timeout" );
	}

	timeout = timeout || 0;

	let self = zelf( this );

	let catcher = letgo.bind( self )( );

	let trace = pringe.bind( self )( arguments );
	harden( "trace", trace, catcher );

	if( kein( snapd.cache, trace ) && !snapd.cache[ trace ].done( ) ){
		return snapd.cache[ trace ];
	}

	parameter = budge( arguments, 2 );

	if( asea.client ){
		let delayedProcedure = setTimeout( function onTimeout( procedure, self, catcher ){
			if( catcher.done( ) ){
				return;
			}

			let cache = catcher.cache;

			try{
				cache.result = procedure.apply( self, parameter.concat( cache.parameter ) );

				cache.callback( null, cache.result );

			}catch( error ){
				cache.callback( error );
			}

			catcher.halt( );

		}, timeout, procedure, self, catcher );

		catcher.timeout = delayedProcedure;

	}else if( asea.server ){
		let delayedProcedure = setTimeout( function onTimeout( procedure, self, catcher ){
			if( catcher.done( ) ){
				return;
			}

			process.nextTick( ( function onTick( ){
				let { catcher, parameter, procedure, self } = this;

				if( catcher.done( ) ){
					return;
				}

				let cache = catcher.cache;

				try{
					cache.result = procedure.apply( self, parameter.concat( cache.parameter ) );

					cache.callback( null, cache.result );

				}catch( error ){
					cache.callback( error );
				}

				catcher.halt( );

			} ).bind( {
				"catcher": catcher,
				"parameter": parameter,
				"procedure": procedure,
				"self": self
			} ) );
			/*;
				@note:
					Do not change how we bind this data.

					nextTick procedure has a special way of handling context.
				@end-note
			*/

		}, timeout, procedure, self, catcher );

		catcher.timeout = delayedProcedure;

	}else{
		throw new Error( "cannot determine platform procedure" );
	}

	catcher.release( function release( ){
		if( kein( snapd.cache, trace ) ){
			delete snapd.cache[ trace ];
		}
	} );

	catcher.done( function done( ){
		return catcher.DONE === DONE;
	} );

	harden( "halt", function halt( ){
		if( catcher.done( ) ){
			return;
		}

		/*;
			@note:
				Possible multiple calls to halt method so we use impel.
			@end-note
		*/
		impel( "DONE", DONE, catcher );

		clearTimeout( catcher.timeout );

		catcher.release( );

		return catcher;
	}, catcher );

	snapd.cache[ trace ] = catcher;

	return catcher;
};

harden( "cache", snapd.cache || { }, snapd );

module.exports = snapd;
