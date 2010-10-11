YUI.add('bewype-color-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Color.Test' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Color.Test",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test exist": function () {

        var _yB = Y.Bewype;

        Y.Assert.isNotNull( Y.Bewype.Color, 'Ooops!' );
        Y.Assert. isNotUndefined( Y.Bewype.Color, 'Ooops!' );
    },

    "test real2dec method": function () {

        var _v0 = Y.Bewype.Color.real2dec( 0 );
        Y.Assert.areEqual( _v0, 0, 'Ooops!' );

        var _v255 = Y.Bewype.Color.real2dec( 1 );
        Y.Assert.areEqual( _v255, 255, 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bewype-color' ] } );

