YUI.add( 'bewype-button-test', function(Y) {

var suite = new Y.Test.Suite( 'Bewype.Button' );

suite.add( new Y.Test.Case( {

    name: 'Bewype.Button',

    setUp: function () {
        this._button = null;
    },

    tearDown: function () {
        // destroy
        if ( this._button ) {
            this._button.destroy();
        }
    },

    "test button base": function () {

        // tmp vars
        var _evtNode = null,
            _clicked = false;

        // init normal button
        this._button = new Y.Bewype.Button();

        // check exist
        Y.Assert.isNotNull( this._button, 'Ooops!' );
        Y.Assert.isNotUndefined( this._button, 'Ooops!' );

        // render
        this._button.render( '#test' );

        // add custom event listener
        this._button.on( 'button:onClick', function ( e ) {
            _clicked = true;
        } );
        
        // select test2
        _evtNode = Y.one( '#' + this._button.get ( 'buttonClass' ) );
        _evtNode.simulate( 'click' );

        // check click
        Y.Assert. isTrue( _clicked, 'Ooops!' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-button' ] } );

