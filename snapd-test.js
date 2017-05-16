const snapd = require( "./snapd.js" );

snapd( function test( ){ console.log( "hello" ) }, 1000 )
( function hello( ){ console.log( "called!" ); } );
