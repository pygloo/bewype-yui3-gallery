YUI.add('bewype-font-family-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Font.Family.Picker' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Font.Family.Picker",

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

        // tmp vars
        var _evtNode = null;

        // init normal picker
        this._picker = new Y.Bewype.FontFamilyPicker();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-comic' );
        _evtNode.simulate( "click" );

        // check current value again
        Y.Assert.areEqual( '\'Comic Sans MS\', cursive, sans-serif', this._picker.getValue(), 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-font-family-picker' ] } );

