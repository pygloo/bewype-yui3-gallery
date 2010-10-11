YUI.add('bewype-font-size-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Font.Size.Picker' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Font.Size.Picker",

    setUp: function () {
        this._picker = null;
    },

    tearDown: function () {
        // destroy
        if ( this._picker ) {
            // this._picker.destroy();
        }
    },

    "test init": function () {

        // tmp vars
        var _evtNode = null;

        // init normal picker
        this._picker = new Y.Bewype.FontSizePicker();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-12' );
        _evtNode.simulate( "click" );

        // check current value again
        Y.Assert.areEqual( '12', this._picker.getValue(), 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-font-size-picker' ] } );

