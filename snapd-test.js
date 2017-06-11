
const snapd = require( "./snapd.js" );

snapd( function test( ){
	console.log( "hello", arguments );

	return "yehey";
}, 1000, 1, 2, 3 )

( function hello( ){
	console.log( "called!", arguments );
} );
