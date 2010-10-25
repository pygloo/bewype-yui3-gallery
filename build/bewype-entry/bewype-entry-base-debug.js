YUI.add('bewype-entry-base', function(Y) {


    /**
     *
     */
    var ENTRY_TMPL = '',
        Entry  = null;
    
    /**
     *
     */
    ENTRY_TMPL += '<div class="{entryClass}">';
    ENTRY_TMPL += ' <input class="{entryClass}-input" type="text" value="{value}"></input>';
    ENTRY_TMPL += '</div>';

    /**
     *
     */
    Entry = function(config) {
        Entry.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    Entry.NAME = "entry";

    /**
     * 
     */
    Entry.NS = "entry";

    /**
     *
     */
    Entry.ATTRS = {
        entryClass : {
            value : 'yui3-entry-base',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( Entry, Y.Widget, {

        /**
         *
         */
        _value : null,

        _init : function ( config ) {
            // our custom event
            this.publish( 'entry:onChange' );
        },

        /**
         *
         */
        initializer : function( config ) {
            // call common method
            this._init( config );
        },

        _renderBaseUI : function () {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _entryClass = this.get( 'entryClass' ),
                _entryNode  = null;

            // create entry node
            _entryNode = new Y.Node.create(
                Y.substitute( ENTRY_TMPL, {
                    entryClass : _entryClass,
                    value : this._value ? this._value : ''
                } )
            );
            _contentBox.append( _entryNode );

            // set handler
            _entryNode.on( 'yui3-entry-event|blur', Y.bind( this._onChange, this, null ) );
        },

        /**
         * 
         */
        renderUI : function () {
            // render default
            this._renderBaseUI();
        },

        /**
         *
         */
        bindUI : function () {
        },

        /**
         *
         */
        syncUI : function () {
        },

        /**
         *
         */
        _destroyBase : function () {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _entryNode  = _contentBox.one( 'div' );

            // little check
            if ( _entryNode ) {
                
                // remove events
                Y.detach('yui3-entry-event|blur');
    
                // remove nodes
                _entryNode.remove();
            }
        },

        /**
         *
         */
        destructor : function() {
            // destroy default
            this._destroyBase();
        },

        _onChange : function( changeType, evt ) {
            // vars
            var _inputNode   = evt ? evt.target : null;
            //
            if ( _inputNode ) {
                // get entry value and keep it
                this._value = _inputNode.get( 'value' );
                // fire custom event
                this.fire("entry:onChange");
            }
        },

        setValue : function( value ) {
            // update value
            this._value = (value && value.trim() === '') ? null : value;

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _entryNode  = _contentBox.one( 'input' );

            // udate entry node
            if ( _entryNode ) {
                _entryNode.set( 'value', this._value ? this._value : '' );
            }
        },

        getValue : function() {
            return this._value;
        }

    } );

    // manage custom event
    Y.augment(Entry, Y.EventTarget);

    Y.namespace('Bewype');
    Y.Bewype.Entry = Entry;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});
