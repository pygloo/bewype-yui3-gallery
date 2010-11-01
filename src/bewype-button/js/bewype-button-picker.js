
    /**
     *
     */
    var ButtonPicker = function(config) {
        ButtonPicker.superclass.constructor.apply( this, arguments );
    };
    
    /**
     *
     */
    ButtonPicker.PICKER_TMPL =  '<div class="{buttonClass}-host">';
    ButtonPicker.PICKER_TMPL += '</div>';

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
        },
        zIndex : {
            value : 4,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( ButtonPicker, Y.Bewype.Button, {

        _picker   : null,

        _previous : null,

        _value    : null,

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );

            //
            this._picker   = null;
            this._previous = null;
            this._value    = null;
        },

        /**
         *
         */
        destructor : function () {

            // destroy picker first
            this.hidePicker();

            // common destroy
            this._destroyBase();
        },

        /**
         *
         */
        renderUI : function () {

            // render default
            this._renderBaseUI();

            // set handler
            Y.after( 'yui3-button-event|click' , Y.bind( this.hidePicker, this ) );
        },

        /**
         *
         */
        hidePicker : function ( evt ) {

            if ( this._picker ) {
                
                // vars
                var _contentBox  = this.get( 'contentBox'  ),
                    _buttonClass = this.get( 'buttonClass' ),
                    _pickerClass = this._picker.get( 'pickerClass' ),
                    _pickerHost  = _contentBox.one( '.' + _buttonClass + '-host');

                if ( evt && evt.target.ancestor( '.' + _pickerClass ) ) {
                    // do nothing
                } else {
                    // remove picker
                    this._picker.destroy();
    
                    // remove picker node
                    _pickerHost.remove();
    
                    // ...
                    delete( this._picker );
                }
            }

            if (evt) {
                // stop event
                evt.stopPropagation();
            }
        },

        /**
         *
         */
        showPicker : function () {
            // temp vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _pickerObj   = this.get( 'pickerObj'   ),
                _pickerClass = this.get( 'pickerClass' ),
                _pickerHost  = null;

            // little check
            if ( _contentBox && _pickerObj ) {

                // add picker node
                _pickerHost = new Y.Node.create(
                    Y.substitute( ButtonPicker.PICKER_TMPL, {
                        buttonClass : _buttonClass
                    } )
                );
                _contentBox.append( _pickerHost );

                // create a picker
                if ( _pickerClass ) {
                    this._picker = new _pickerObj( {
                        pickerClass : this.get( 'pickerClass' )
                    } );
                } else {
                    this._picker = new _pickerObj();
                }

                // set value
                this._picker.setValue( this._value );

                // do render
                this._picker.render( _pickerHost );

                // add custom event listener
                this._picker.on( 'picker:onChange', Y.bind( this._onPickerChange, this ) );
            }
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _pickerObj   = this.get( 'pickerObj'   );

            // little check
            if ( _contentBox && _pickerObj ) {

                // fire custom event
                this.fire("button:onClick");

                if ( this._picker ) {
                    // remove picker
                    this.hidePicker();
                } else {
                    // render picker
                    this.showPicker();
                }
            }

            // stop event
            evt.stopPropagation();
        },

        _onPickerChange : function ( e ) {

            if ( this._picker ) {

                // get value
                this.setValue( this._picker.getValue() );

                // remove picker
                this.hidePicker();

                // fire custom event
                this.fire("button:onChange");
            }
        },

        /**
         *
         */
        getPrevious : function () {
            return this._previous;
        },

        /**
         *
         */
        getValue : function () {
            return this._value;
        },

        /**
         *
         */
        setValue : function ( value ) {
            this._previous = this._value;
            this._value    = value;
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.ButtonPicker = ButtonPicker;

