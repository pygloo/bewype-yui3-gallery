YUI.add('bewype-button-base', function(Y) {


    /**
     *
     */
    var BUTTON_TMPL = '',
        LABEL_TMPL  = '',
        IMAGE_TMPL  = '',
        Button      = null;
    
    /**
     *
     */
    BUTTON_TMPL += '<div class="{buttonClass}">';
    BUTTON_TMPL += '</div>';

    /**
     *
     */
    LABEL_TMPL += '<div class="{buttonClass}-label">';
    LABEL_TMPL += '  {label}';
    LABEL_TMPL += '</div>';

    /**
     *
     */
    IMAGE_TMPL += '<div class="{buttonClass}-image">';
    IMAGE_TMPL += '  <img src="{imageUrl}" />';
    IMAGE_TMPL += '</div>';

    Button = function(config) {
        Button.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    Button.NAME = "button";

    /**
     * 
     */
    Button.NS = "button";

    /**
     *
     */
    Button.ATTRS = {
        buttonClass : {
            value : 'yui3-button-base',
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

    Y.extend( Button, Y.Widget, {

        _init : function ( config ) {

            // our custom event
            this.publish( 'button:onClick' );

            // our custom event
            this.publish( 'button:onChange' );
        },

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );
        },

        _renderBaseUI : function () {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _label       = this.get( 'label'       ),
                _imageUrl    = this.get( 'imageUrl'    ),
                _buttonNode  = null,
                _labelNode   = null,
                _imageNode   = null;

            // create table
            _buttonNode = new Y.Node.create(
                Y.substitute( BUTTON_TMPL, {
                    buttonClass : _buttonClass
                } )
            );
            _contentBox.append( _buttonNode );

            // add label
            if ( _label ) {
                _labelNode = new Y.Node.create(
                    Y.substitute( LABEL_TMPL, {
                        buttonClass : _buttonClass,
                        label       : _label
                    } )
                );
                _buttonNode.append( _labelNode );
            }

            // add image
            if ( _imageUrl ) {
                _imageNode = new Y.Node.create(
                    Y.substitute( IMAGE_TMPL, {
                        buttonClass : _buttonClass,
                        imageUrl    : _imageUrl
                    } )
                );
                _buttonNode.append( _imageNode );
            }

            // set handler
            _buttonNode.on( 'yui3-button-event|click' , Y.bind( this._onClick, this ) );
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
                _buttonNode  = _contentBox.one( 'div' );

            // little check
            if ( _buttonNode ) {
                
                // remove events
                Y.detach('yui3-button-event|click');
    
                // remove nodes
                _buttonNode.remove();
            }
        },

        /**
         *
         */
        destructor : function () {
            this._destroyBase();
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _itemNode   = evt ? evt.target : null;

            // little check
            if (_itemNode) {

                // fire custom event
                this.fire("button:onClick");
            }
        },

        /**
         *
         */
        getValue : function () {
            return null;
        }

    } );

    // manage custom event
    Y.augment(Button, Y.EventTarget);

    Y.namespace('Bewype');
    Y.Bewype.Button = Button;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});
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
YUI.add('bewype-button-picker', function(Y) {


    /**
     *
     */
    var PICKER_TMPL  = '',
        ButtonPicker = null;
    
    /**
     *
     */
    PICKER_TMPL += '<div class="{buttonClass}-host">';
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

            // set handler
            Y.after( 'yui3-button-event|click' , Y.bind( this._removePicker, this ) );
        },

        /**
         *
         */
        _removePicker : function ( evt ) {

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
        _onClick : function ( evt ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _pickerObj   = this.get( 'pickerObj'   ),
                _pickerClass = this.get( 'pickerClass' ),
                _pickerHost  = null;

            // little check
            if ( _contentBox && _pickerObj ) {

                // fire custom event
                this.fire("button:onClick");

                if ( this._picker ) {

                    // remove picker
                    this._removePicker();

                } else {

                    // add picker node
                    _pickerHost = new Y.Node.create(
                        Y.substitute( PICKER_TMPL, {
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
            }

            // stop event
            evt.stopPropagation();
        },

        _onPickerChange : function ( e ) {

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
        setValue : function (value) {
            this._value = value;
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



}, '@VERSION@' ,{requires:['bewype-button-base', 'bewype-picker']});


YUI.add('bewype-button', function(Y){}, '@VERSION@' ,{use:['bewype-button-base', 'bewype-button-toggle', 'bewype-button-picker']});

