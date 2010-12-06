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
            value : 'bewype-button-base',
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
    var CHECK_TMPL = '',
        ButtonToggle = function(config) {
        ButtonToggle.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    CHECK_TMPL += '<input type="checkbox" class="{buttonClass}-checkbox" />';

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
            value : 'bewype-button-toggle',
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

            // append checkbox
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _buttonNode  = _contentBox.one( '.' + _buttonClass ),
                _labelNode   = _contentBox.one( '.' + _buttonClass + '-label' ),
                _checkNode   = null;
            
            // create check box
            _checkNode = Y.Node.create(
                Y.substitute( CHECK_TMPL, {
                    buttonClass : _buttonClass
                } )
            );
                   
            // insert checkbox
            _buttonNode.insertBefore( _checkNode, _labelNode );
        },

        refresh : function ( buttonNode ) {

            // vars
            var _buttonClass = this.get( 'buttonClass' ),
                _buttonNode  = buttonNode || this.get( 'contentBox' ).one( 'div' );
                    
            // little check
            if (_buttonNode) {
                // update class name
                if ( this._toggleState ) {                
                    _buttonNode.addClass( _buttonClass + '-active' );
                } else {
                    _buttonNode.removeClass( _buttonClass + '-active' );
                }
            }
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonClass = this.get( 'buttonClass' ),
                _buttonNode  = _contentBox.one( 'div' ),
                _checkNode   = _contentBox.one( '.' + _buttonClass + '-checkbox' );

            // little check
            if (_buttonNode) {
                
                // update state
                this._toggleState = !this._toggleState;

                // ensure checkbox state
                _checkNode.set( 'checked', this._toggleState );

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
    var ButtonPicker = function(config) {
        ButtonPicker.superclass.constructor.apply( this, arguments );
    };
    
    /**
     *
     */
    ButtonPicker.PICKER_TMPL =  '<div class="{buttonClass}-host ';
    ButtonPicker.PICKER_TMPL += '{buttonClass}-host-{pickerPosition}">';
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
            value : 'bewype-button-picker',
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
        pickerObj : {
            value : null,
            writeOnce : true
        },
        pickerParams : {
            value : {},
            writeOnce : true
        },
        pickerPosition : {
            value : 'left',
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

            //
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
                    _pos         = this.get( 'pickerPosition' ),
                    _pickerHost  = _contentBox.one( '.' + _buttonClass + '-host-' + _pos);

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
            var _contentBox     = this.get( 'contentBox'  ),
                _buttonClass    = this.get( 'buttonClass' ),
                _pickerObj      = this.get( 'pickerObj'   ),
                _pickerParams   = this.get( 'pickerParams' ),
                _pickerPosition = this.get( 'pickerPosition' ),
                _pickerHost     = null;

            // little check
            if ( _contentBox && _pickerObj ) {

                // add picker node
                _pickerHost = new Y.Node.create(
                    Y.substitute( ButtonPicker.PICKER_TMPL, {
                        buttonClass    : _buttonClass,
                        pickerPosition : _pickerPosition
                    } )
                );
                _contentBox.append( _pickerHost );

                // create a picker
                this._picker = new _pickerObj( _pickerParams );

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

            // get new value
            var _value = this._picker ? this._picker.getValue() : null; 

            // check value exist
            if ( _value ) {    
                // get value
                this.setValue( _value ); 
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




}, '@VERSION@' ,{requires:['bewype-button-base', 'bewype-picker']});



YUI.add('bewype-button', function(Y){}, '@VERSION@' ,{use:['bewype-button-base', 'bewype-button-toggle', 'bewype-button-picker']});

