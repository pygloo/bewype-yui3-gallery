YUI.add('bewype-item-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Item.Picker' );

suite.add( new Y.Test.Case( {

    name: "Bewype.Item.Picker",

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
        this._picker = new Y.Bewype.ItemPicker();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // add rows
        this._picker.append( 'test1', 'Test1' );
        this._picker.append( 'test2', 'Test2' );
        this._picker.append( 'test3', 'Test3' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-test2' );
        _evtNode.simulate( "click" );

        // check current value again
        Y.Assert.areEqual( 'test2', this._picker.getValue(), 'Ooops!' );

        /*
        // remove rows
        this._picker.remove( 'test1' );
        this._picker.remove( 'test2' );
        this._picker.remove( 'test3' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // check item removal
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-test2' );
        Y.Assert.isNull( _evtNode, 'Ooops!' );
        */
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-item-picker' ] } );

