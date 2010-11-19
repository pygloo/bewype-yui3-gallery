YUI.add( 'bewype-entry-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Entry' );

suite.add( new Y.Test.Case( {

    name: 'Bewype.Entry',

    setUp: function () {
        this._entry = null;
    },

    tearDown: function () {
        // destroy
        if ( this._entry ) {
            this._entry.destroy();
        }
    },

    "test entry base": function () {

        // tmp vars
        var _entryNode = null;

        // init normal entry
        this._entry = new Y.Bewype.Entry();

        // check exist
        Y.Assert.isNotNull( this._entry, 'Ooops!' );
        Y.Assert.isNotUndefined( this._entry, 'Ooops!' );

        // render
        this._entry.render( '#test' );

        // get entry
        _entryNode = Y.one( '.' + this._entry.get( 'entryClass' ) + '-input' );
        // set value
        _entryNode.set( 'value', 'test1' );
        // simulate event
        _entryNode.simulate( 'blur' );

        // check current value again
        Y.Assert.areEqual( 'test1', this._entry.getValue(), 'Ooops!' );

        // 
        this._entry.setValue( null );
        // check current value
        Y.Assert.isNull( this._entry.getValue(), 'check getValue!' );

        // 
        this._entry.setValue( 'test2' );

        // check current value again
        Y.Assert.areEqual( 'test2', _entryNode.get( 'value' ), 'Ooops!' );
    },

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-entry' ] } );

