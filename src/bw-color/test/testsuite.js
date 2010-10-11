YUI.add('bw-color-test', function(Y) {

var suite = new Y.Test.Suite( 'Y.BwColor' );

suite.add( new Y.Test.Case( {

    name: "SimpleTest",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test real2dec method": function () {

        var _v0 = Y.BwColor.real2dec( 0 );
        Y.Assert.areEqual( _v0, 0, 'Ooops!' );

        var _v255 = Y.BwColor.real2dec( 1 );
        Y.Assert.areEqual( _v255, 255, 'Ooops!' );
    },

} ) );

/*
suite.add( new Y.Test.Case( {

    name: "Bugs",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
} ) );
*/

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bw-color' ] } );

