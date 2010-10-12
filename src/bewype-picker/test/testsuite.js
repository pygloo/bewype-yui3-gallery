YUI.add( 'bewype-picker-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Picker' );

suite.add( new Y.Test.Case( {

    name: 'Bewype.Picker',

    setUp: function () {
        this._picker = null;
    },

    tearDown: function () {
        // destroy
        if ( this._picker ) {
            this._picker.destroy();
        }
    },

    "test picker base": function () {

        // tmp vars
        var _evtNode = null;

        // init normal picker
        this._picker = new Y.Bewype.Picker();

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
        _evtNode.simulate( 'click' );

        // check current value again
        Y.Assert.areEqual( 'test2', this._picker.getValue(), 'Ooops!' );

        // remove rows
        this._picker.remove( 'test1' );
        this._picker.remove( 'test2' );
        this._picker.remove( 'test3' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'check getValue!' );

        // check item removal
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-test2' );
        Y.Assert.isNull( _evtNode, 'check item after removal!' );
    },

    "test picker color normal": function () {

        // init normal picker
        this._picker = new Y.Bewype.PickerColor();
        this._picker.render( '#test' );
        //
        var _v = this._picker.getValue();
        Y.Assert.areEqual( '#407f80', _v, 'Ooops!' );
    },

    "test picker color small": function () {

        // init small picker
        this._picker = new Y.Bewype.PickerColor( {
            pickerSize : 90
        } );
        this._picker.render( '#test' );
        //
        var _v = this._picker.getValue();
        Y.Assert.areEqual( '#407e80', _v, 'Ooops!' );
    },

    "test picker font size": function () {

        // tmp vars
        var _evtNode = null;

        // init normal picker
        this._picker = new Y.Bewype.PickerFontSize();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-12' );
        _evtNode.simulate( 'click' );

        // check current value again
        Y.Assert.areEqual( '12', this._picker.getValue(), 'Ooops!' );
    },

    "test picker font family": function () {

        // tmp vars
        var _evtNode = null;

        // init normal picker
        this._picker = new Y.Bewype.PickerFontFamily();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _evtNode = Y.one( '#' + this._picker.get ( 'pickerClass' ) + '-comic' );
        _evtNode.simulate( 'click' );

        // check current value again
        Y.Assert.areEqual( '\'Comic Sans MS\', cursive, sans-serif', this._picker.getValue(), 'Ooops!' );
    },

    "test picker url": function () {

        // tmp vars
        var _inputNode = null;

        // init normal picker
        this._picker = new Y.Bewype.PickerUrl();

        // check exist
        Y.Assert.isNotNull( this._picker, 'Ooops!' );
        Y.Assert.isNotUndefined( this._picker, 'Ooops!' );

        // render
        this._picker.render( '#test' );

        // check current value
        Y.Assert.isNull( this._picker.getValue(), 'Ooops!' );

        // select test2
        _inputNode = Y.one( '#test .' + this._picker.get ( 'pickerClass' ) + '-input' );
        _inputNode.set( 'value', 'http://www.test.com' )
        _inputNode.simulate( 'blur' );

        // check current value again
        Y.Assert.areEqual( 'http://www.test.com', this._picker.getValue(), 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-picker' ] } );

