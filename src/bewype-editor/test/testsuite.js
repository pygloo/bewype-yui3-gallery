YUI.add('bewype-editor-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Editor.Test' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Editor.Test",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test exist": function () {

        Y.Assert.isNotNull( Y.Bewype.Editor, 'Ooops!' );
        Y.Assert. isNotUndefined( Y.Bewype.Editor, 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bewype-editor' ] } );

