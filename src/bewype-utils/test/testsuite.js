YUI.add('bewype-utils-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Utils.Test' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Utils.Test",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test exist": function () {

        Y.Assert.isNotNull( Y.Bewype.Utils, 'null!' );
        Y.Assert. isNotUndefined( Y.Bewype.Utils, 'undefined!' );
    },

    "test camelize": function () {

        // simple use
        Y.Assert.areEqual( 'thisIsATest', Y.Bewype.Utils.camelize( 'this-is-a-test' ), 'default!' );
        Y.Assert.areEqual( 'ThisIsATest', Y.Bewype.Utils.camelize( 'this-is-a-test', true ), 'first upper!' );
        Y.Assert.areEqual( 'thisIsATest', Y.Bewype.Utils.camelize( 'this.is.a.test', false, '.' ), '.!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bewype-utils' ] } );

