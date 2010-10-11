YUI.add('bewype-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Test' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Test",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test exist": function () {

        Y.Assert.isNotNull( Y.Bewype, 'Ooops!' );
        Y.Assert.isNotUndefined( Y.Bewype, 'Ooops!' );
    },

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bewype' ] } );

