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
        Y.Assert.isNotNull( this._button, 'check null' );
        Y.Assert.isNotUndefined( this._button, 'check undefined' );

        // render
        this._button.render( '#test' );

        // add custom event listener
        this._button.on( 'button:onClick', function ( e ) {
            _clicked = true;
        } );
        
        // click!
        _evtNode = Y.one( '.' + this._button.get( 'buttonClass' ) );
        _evtNode.simulate( 'click' );

        // check click
        Y.Assert.isTrue( _clicked, 'check click' );
    },

    "test button toggle": function () {

        // tmp vars
        var _evtNode = null,
            _clicked = false,
            _changed = false
            _class   = null;

        // init normal button
        this._button = new Y.Bewype.ButtonToggle();
        _class = this._button.get ( 'buttonClass' );

        // check exist
        Y.Assert.isNotNull( this._button, 'Ooops!' );
        Y.Assert.isNotUndefined( this._button, 'Ooops!' );

        // render
        this._button.render( '#test' );

        // add custom event listener
        this._button.on( 'button:onClick', function ( e ) {
            _clicked = true;
        } );

        // add custom event listener
        this._button.on( 'button:onClick', function ( e ) {
            _changed = true;
        } );
        
        // click!
        _evtNode = Y.one( '.' + _class );
        _evtNode.simulate( 'click' );

        // check click
        Y.Assert.isTrue( _clicked, 'Ooops!' );
        Y.Assert.isTrue( _changed, 'Ooops!' );
        Y.Assert.isTrue( this._button.getValue(), 'click toggle value' );
        Y.Assert.areEqual( _class + '-active', _evtNode.get( 'className' ), 'click toggle class' );

        // (re)click!
        _evtNode.simulate( 'click' );
        // check
        Y.Assert.isFalse( this._button.getValue(), '(re)click toggle value' );
        Y.Assert.areEqual( _class, _evtNode.get( 'className' ), '(re)click toggle class' );
    }

} ) );

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{ requires: [ 'node-event-simulate', 'test', 'bewype-button' ] } );

