
    /**
     *
     */
    var PICKER_TMPL  = '',
        ButtonPicker = null;
    
    /**
     *
     */
    PICKER_TMPL += '<div class="{buttonClass}-picker-host">';
    PICKER_TMPL += '</div>';

    /**
     *
     */
    ButtonPicker = function(config) {
        ButtonPicker.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    ButtonPicker.NAME = "buttonPicker";

    /**
     * 
     */
    ButtonPicker.NS = "buttonPicker";

    /**
     *
     */
    ButtonPicker.ATTRS = {
        buttonClass : {
            value : 'yui3-button-picker',
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
        },
        pickerObj : {
            value : null,
            writeOnce : true
        },
        pickerClass : {
            value : null,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( ButtonPicker, Y.Bewype.Button, {

        _picker : null,

        _value  : null,

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );

            //
            this._picker = null;
            this._value = null;
        },

        /**
         *
         */
        destructor : function () {

            // destroy picker first
            this._removePicker();

            // common destroy
            this._destroyBase();
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
        _removePicker : function () {

            if ( this._picker ) {
                
                // remove picker
                this._picker.destroy();
                delete( this._picker );

                // remove picker node
                _pickerNode.remove();
            }
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _pickerObj   = this.get( 'pickerObj'   ),
                _pickerClass = this.get( 'pickerClass' );

            // little check
            if ( _contentBox && _pickerObj ) {

                if ( this._picker ) {

                    // remove picker
                    this._removePicker();
                } else {

                    // add picker node
                    _pickerNode = new Y.Node.create(
                        Y.substitute( PICKER_TMPL, {
                            buttonClass : _buttonClass
                        } )
                    );
                    _contentBox.append( _pickerNode );
                    
                    // create a picker
                    if ( _pickerClass ) {
                        this._picker = new _pickerObj( {
                            pickerClass : this.get( 'pickerClass' )
                        } );
                    } else {
                        this._picker = new _pickerObj();
                    }

                    // do render
                    this._picker.render( _pickerNode );

                    // add custom event listener
                    this._picker.on( 'picker:onChange', Y.bind( this._onPickerChange, this ) );
                }

                // fire custom event
                this.fire("button:onClick");
            }
        },

        _onPickerChange : function ( e ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _pickerNode  = _contentBox.one( '.' + _buttonClass + '-picker-host');

            if ( this._picker ) {
                // get value
                this._value = this._picker.getValue();

                //
                this._removePicker();

                // fire custom event
                this.fire("button:onChange");
            }
        },

        /**
         *
         */
        getValue : function () {
            return this._value;
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.ButtonPicker = ButtonPicker;

