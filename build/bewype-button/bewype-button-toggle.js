YUI.add('bewype-button-toggle', function(Y) {


    /**
     *
     */
    var ButtonToggle = function(config) {
        ButtonToggle.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    ButtonToggle.NAME = "buttonToggle";

    /**
     * 
     */
    ButtonToggle.NS = "buttonToggle";

    /**
     *
     */
    ButtonToggle.ATTRS = {
        buttonClass : {
            value : 'yui3-button-toggle',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        label : {
            value : null,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        imageUrl : {
            value : null,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        width : {
            value : 80,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( ButtonToggle, Y.Bewype.Button, {

        _toggleState : false,

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );
            this._toggleState = false;
        },

        /**
         *
         */
        renderUI : function () {

            // render default
            this._renderBaseUI();
        },

        refresh : function ( buttonNode ) {

            // vars
            var _buttonClass = this.get( 'buttonClass' ),
                _buttonNode  = buttonNode || this.get( 'contentBox' ).one( 'div' );
                    
            // little check
            if (_buttonNode) {
                // update class name
                _buttonNode.set( 'className', this._toggleState ? _buttonClass + '-active' : _buttonClass );
            }
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonNode  = _contentBox.one( 'div' );

            // little check
            if (_buttonNode) {
                
                // update state
                this._toggleState = !this._toggleState;

                // refresh
                this.refresh( _buttonNode );

                // fire custom event
                this.fire("button:onChange");
                this.fire("button:onClick");

            }
        },

        /**
         *
         */
        getValue : function () {
            return this._toggleState;
        },

        /**
         *
         */
        setValue : function ( toggleState ) {
            // check changed
            if ( this._toggleState != toggleState ) {
                // update state
                this._toggleState = toggleState;
                // update ui
                this.refresh();
            }
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.ButtonToggle = ButtonToggle;



}, '@VERSION@' ,{requires:['bewype-button-base']});
