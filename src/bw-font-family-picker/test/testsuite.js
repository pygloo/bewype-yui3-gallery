YUI.add('bw-font-family-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'ColorFontFamilyTest' );

suite.add( new Y.Test.Case( {

    name: "ColorFontFamilyTest",

    setUp: function () {
        this._picker = null;
    },

    tearDown: function () {
        // destroy
        if ( this._picker ) {
            this._picker.destroy();
        }
    },

    "test init": function () {

        // init normal picker
        this._picker = new Y.Widget.FontFamilyPicker();
        this._picker.render( '#test' );
        //
        //var _v = this._picker.getValue();
        //Y.Assert.areEqual( '#407f80', _v, 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bw-font-family-picker' ] } );

