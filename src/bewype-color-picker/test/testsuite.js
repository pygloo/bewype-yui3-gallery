YUI.add('bewype-color-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'ColorPickerTest' );

suite.add( new Y.Test.Case( {

    name: "ColorPickerTest",

    setUp: function () {
        this._picker = null;
    },

    tearDown: function () {
        // unplug
        if ( this._picker ) {
            this._picker.destroy();
        }
    },

    "test normal": function () {

        // init normal picker
        this._picker = new Y.Bewype.ColorPicker();
        this._picker.render( '#test' );
        //
        var _v = this._picker.getValue();
        Y.Assert.areEqual( '#407f80', _v, 'Ooops!' );
    },

    "test small": function () {

        // init small picker
        this._picker = new Y.Bewype.ColorPicker( {
            pickerSize : 90
        } );
        this._picker.render( '#test' );
        //
        var _v = this._picker.getValue();
        Y.Assert.areEqual( '#407e80', _v, 'Ooops!' );
    },

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'test', 'bewype-color-picker' ] } );

