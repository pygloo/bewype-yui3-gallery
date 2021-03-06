
    /**
     *
     */
    var BUTTON_TMPL  = '',
        SPINNER_TMPL = '',
        EditorPanel   = null;

    /**
     *
     */
    BUTTON_TMPL += '<div class="{editorClass} {buttonClass}">';
    BUTTON_TMPL += '</div>';

    /**
     *
     */
    SPINNER_TMPL += '<div class="{editorClass} {buttonClass}">';
    SPINNER_TMPL += '<div class="{editorClass}-label {buttonClass}-label">{label}</div>';
    SPINNER_TMPL += '<div class="{spinnerClass}"></div>';
    SPINNER_TMPL += '</div>';

    /**
     *
     */
    EditorPanel = function(config) {
        EditorPanel.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorPanel.NAME = 'bewype-editor-panel';

    /**
     *
     */
    EditorPanel.NS   = 'bewypeEditorPanel';

    /**
     *
     */
    Y.extend( EditorPanel, Y.Bewype.EditorConfig, {

        _buttonDict     : {},

        _editors        : [],

        _spinnerButtons : [
                        'height',
                        'width',
                        'padding-top',
                        'padding-right',
                        'padding-bottom',
                        'padding-left'
                        ],

        _toggleButtons  : [
                        'bold',
                        'italic',
                        'underline'
                        ],

        _pickerButtons  : [
                        'title',
                        'font-family',
                        'font-size',
                        'text-align',
                        'color',
                        'background-color',
                        'url',
                        'file'
                        ],

        _pickerObjDict  : {
            'background-color' : Y.Bewype.PickerColor,
            'color'            : Y.Bewype.PickerColor,
            'file'             : Y.Bewype.PickerFile,
            'font-family'      : Y.Bewype.PickerFontFamily,
            'font-size'        : Y.Bewype.PickerFontSize,
            'text-align'       : Y.Bewype.PickerTextAlign,
            'title'            : Y.Bewype.PickerTitle,
            'url'              : Y.Bewype.PickerUrl
        },

        _tagButtons  : [ 'bold', 'italic', 'title', 'underline', 'url' ],

        _cssButtons  : [
            'font-family',
            'font-size',
            'text-align',
            'color',
            'background-color',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left'
            ],

        _addSpinnerButton : function ( name, config ) {

            var _host         = this.get( 'host'   ),
                _editorClass  = this.get( 'editorClass' ) + '-button',
                _spinnerClass = this.get( 'editorClass' ) + '-spinner-' + name,
                _spinnerNode  = null,
                _spinner      = null,
                _valueTxt     = config.spinnerValues[ name ],
                _value        = _valueTxt ? parseInt( _valueTxt.replace( /px/i, '' ), 10 ) : 0;

            // create node
            _spinnerNode = new Y.Node.create(
                Y.substitute( SPINNER_TMPL, {
                    editorClass  : _editorClass,
                    buttonClass  : _editorClass + '-button-' + name,
                    label        : this.get( Y.Bewype.Utils.camelize( 'spinner-label-' + name ) ),
                    spinnerClass : _spinnerClass
                } )
            );
            // add new node for the panel
            _host.append( _spinnerNode );
            
            // attach spinner
            _spinner = new Y.Bewype.EntrySpinner({
                srcNode : _spinnerNode.one( '.' + _spinnerClass ),
                max     : this.get( Y.Bewype.Utils.camelize( 'spinner-max-' + name ) ),
                min     : 0,
                value   : _value
            });
            _spinner.render();

           // connect
           _spinner.on( 'entry:onChange', Y.bind( this._onSpinnerChange, this, name ) );

            // update button dict
            this._buttonDict[ name ] = _spinner;

            // return height and width
            return {
                height : Y.Bewype.Utils.getHeight( _spinnerNode ),
                width  : Y.Bewype.Utils.getWidth( _spinnerNode )
            };
        },

        __buttonFactory : function ( name, buttonClass, button ) {

            var _host        = this.get( 'host'   ),
                _editorClass = this.get( 'editorClass' ),
                _buttonNode  = null,
                _customEventChange = null,
                _customEventClick  = null;

            // create node
            _buttonNode = new Y.Node.create(
                Y.substitute( BUTTON_TMPL, {
                    editorClass : _editorClass + '-button',
                    buttonClass : _editorClass + '-button-' + name
                } )
            );
            // add new node for the panel
            _host.append( _buttonNode );

            // render button after add
            button.render( _buttonNode );

            // add custom event listener
            if ( buttonClass === 'button') {
                _customEventChange = 'button:onClick';
            } else {
                _customEventChange = 'button:onChange';
            }
            button.on( _customEventChange, Y.bind( this._onButtonChange, this, name ) );

            if ( Y.Array.indexOf( this._pickerButtons, name ) != -1 ) {
                _customEventClick = 'button:onClick';
                button.before( _customEventClick, Y.bind( this._onButtonClick, this, name ) );
            }

            // update button dict
            this._buttonDict[ name ] = button;

            // return height and width
            return {
                height : Y.Bewype.Utils.getHeight( _buttonNode ),
                width  : Y.Bewype.Utils.getWidth( _buttonNode )
            };
        },

        _addButton : function ( name ) {

            // create\render toggle button
            var _button = new Y.Bewype.Button( {
                label : name
            } );

            // do add
            return this.__buttonFactory( name, 'button', _button );
        },

        _addToggleButton : function ( name ) {

            // create\render toggle button
            var _button = new Y.Bewype.ButtonToggle( {
                label : name
            } );

            // do add
            return this.__buttonFactory( name, 'toggle-button', _button );
        },

        _addPickerButton : function ( name, pickerObj ) {

            // create\render toggle button
            var _pickerColor  = name === 'background-color' || name === 'color',
                _pickerParams = {
                    fileStaticPath  : name === 'file' ? this.get( 'fileStaticPath' )  : null,
                    uploadUrl       : name === 'file' ? this.get( 'uploadUrl' )       : null,
                    pickerSize      : _pickerColor    ? this.get( 'pickerColorSize' ) : null
                },
                _button = new Y.Bewype.ButtonPicker( {
                    label           : name,
                    pickerObj       : pickerObj,
                    pickerParams    : _pickerParams,
                    pickerPosition  : this.get( 'panelPosition' )
                } );

            // do add
            return this.__buttonFactory( name, 'picker-button', _button );
        },

        _initPanel : function ( config ) {

            var _host          = this.get( 'host'   ),
                _editorClass   = this.get( 'editorClass' ),
                _panelPosition = this.get( 'panelPosition' ),
                _panelOffsetX  = this.get( 'panelOffsetX' ),
                _panelOffsetY  = this.get( 'panelOffsetY' ),
                _activeButtons = this.get( 'activeButtons' ),
                _bHW           = null,
                _panelPadding  = this.get( 'panelPadding' ),
                _panelHeight   = 0,
                _panelWidth    = 0;

            Y.Object.each( this._spinnerButtons, function( v, k ) {
                var _hW = null;
                // check active
                if ( Y.Array.indexOf( _activeButtons, v ) != -1 ) { 
                    // do add
                    _hW = this._addSpinnerButton( v, config );
                    // update width and height
                    _panelHeight += _hW.height + 4; // + padding
                    _panelWidth  += _hW.width + 4; // + padding
                }
            }, this );
            // set max value
            this.updateSpinnerMaxWidth();

            Y.Object.each( this._toggleButtons , function( v, k ) {
                var _hW = null;
                // check active
                if ( Y.Array.indexOf( _activeButtons, v ) != -1 ) { 
                    // do add
                    _hW = this._addToggleButton( v );
                    // update width and height
                    _panelHeight += _hW.height + 4; // + padding
                    _panelWidth  += _hW.width + 4; // + padding
                }
            }, this );

            Y.Object.each( this._pickerButtons , function( v, k ) {
                var _hW = null;
                // check active
                if ( Y.Array.indexOf( _activeButtons, v ) != -1 ) { 
                    // do add
                    _hW = this._addPickerButton( v, this._pickerObjDict[ v ] );
                    // update width and height
                    _panelHeight += _hW.height + 4; // + padding
                    _panelWidth  += _hW.width + 4; // + padding
                }
            }, this );

            _bHW = this._addButton( 'reset' );
            // update width and height
            _panelHeight += _bHW.height;
            _panelWidth  += _bHW.width;

            _bHW = this._addButton( 'apply' );
            // update width and height
            _panelHeight += _bHW.height;
            _panelWidth  += _bHW.width;
            
            // update width and height
            _panelHeight += _panelPadding;
            _panelWidth  += _panelPadding;

            // set panel class
            _host.addClass( _editorClass );
            _host.addClass( _editorClass + '-' + _panelPosition );
            // show
            _host.setStyle( 'display', 'block' );
            // set offset
            _host.setStyle( _panelPosition, _panelOffsetX );
            _host.setStyle( 'top', _panelOffsetY );

            if ( _panelPosition === 'left' || _panelPosition === 'right') {
                _host.setStyle( 'height', _panelHeight );
            } else {
                _host.setStyle( 'width', _panelWidth );
            }
        },

        /**
         *
         */
        initializer : function( config ) {

            // set panel
            this._initPanel( config );

            // our custom events
            Y.publish( 'bewype-editor:onClose'  );
            Y.publish( 'bewype-editor:onChange' );
        },

        /**
         *
         */
        destructor : function () {
    
            // tmp vars
            var _host          = this.get( 'host' ),
                _editorClass   = this.get( 'editorClass' ),
                _panelPosition = this.get( 'panelPosition' );

            // set panel class
            _host.removeClass( _editorClass );
            _host.removeClass( _editorClass + '-' + _panelPosition );
            // hide
            _host.setStyle( 'display', 'none' );

            // remove buttons
            Y.Object.each( this.get( 'activeButtons' ) , function( v, k ) {
                // remove button
                this._buttonDict[ v ].destroy();
                delete( this._buttonDict[ v ] );
            }, this );

            // remove button nodes
            _host.all( '.' + _editorClass + '-button' ).each( function( v, k ) {
                // remove node
                v.remove();
            } );

            // remove all attached editor
            Y.Object.each( this._editors, function( v, k ) {
                // unplug
                if ( v.bewypeEditorTag ) {
                    v.unplug( Y.Bewype.EditorTag );
                } else if ( v.bewypeEditorText ) {
                    v.unplug( Y.Bewype.EditorText );
                } else {
                    return;
                }
                // unregister
                this.unRegisterEditor( v );
            }, this );
        },

        registerEditor : function ( editor ) {
            // check already registered
            if ( Y.Array.indexOf( this._editors, editor ) == -1 ) {
                this._editors.push( editor );
            }
        },

        unRegisterEditor : function ( editor ) {

            // get editor position
            var _i = Y.Array.indexOf( this._editors, editor );

            // little check
            if ( _i != -1 ) {
                // do remove
                this._editors.splice( _i, 1 );
            }
        },

        getWorkingTagName : function ( name, previous ) {

            switch( name ) {
                case 'bold':
                    return 'b';

                case 'italic':
                    return 'i';

                case 'title':
                    var _button  = this._buttonDict[ name ],
                        _tagName = previous ? _button.getPrevious() : _button.getValue();
                    return _tagName === 'normal' ? null : _tagName;

                case 'underline':
                    return 'u';

                case 'url':
                    return 'a';

                default:
                    return 'span';
            }
        },

        getButton : function ( name ) {                        
            return this._buttonDict[ name ];
        },

        isCssButton : function ( name ) {
            return Y.Array.indexOf( this._cssButtons, name ) != -1;
        },

        _getStyleValue : function ( node, name ) {
            
            if ( !node ) {
                return null;
            } else if ( name === 'url' ) {
                return node.get( 'href' );
            } else {
                var _cssDict = Y.Bewype.Utils.getCssDict( node );
                return _cssDict[ name ];
            }
        },

        refreshButtons : function ( node, reset, name ) {

            if ( !node ) {
                return;
            }

            var _buttonNames   = name ? [ name ] : this.get( 'activeButtons' );

            Y.Object.each( _buttonNames, function( v, k ) {

                // no update for inactive button
                if ( Y.Array.indexOf( this.get( 'activeButtons' ), v) === -1) {
                    return;
                }

                var _value = null;

                switch ( v ) {
                    case 'bold':
                        _value = reset ? false : node.one( 'b' ) !== null;
                        return this._buttonDict[ v ].setValue( _value );

                    case 'italic':
                        _value = reset ? false : node.one( 'i' ) !== null;
                        return this._buttonDict[ v ].setValue( _value );

                    case 'underline':
                        _value = reset ? false : node.one( 'u' ) !== null;
                        return this._buttonDict[ v ].setValue( _value ); 

                    case 'file':
                        if ( this._buttonDict.height ) {
                            this._buttonDict.height.setValue( node._node.height );
                        }
                        if ( this._buttonDict.width ) {
                            this._buttonDict.width.setValue(  node._node.width );
                        }
                        return;

                    case 'font-family':
                    case 'font-size':
                    case 'color':
                    case 'background-color':
                        _value = reset ? false : this._getStyleValue( node, v );
                        return this._buttonDict[ v ].setValue( _value );

                    case 'url':
                        _value = reset ? false : this._getStyleValue( node, v );
                        return this._buttonDict[ v ].setValue( _value );
                }
            }, this );
        },

        updateSpinnerMaxWidth : function () {

            var _spinnerMaxWidth = this.get( 'spinnerMaxWidth' ),
                _spinnerLeft     = this._buttonDict[ 'padding-left' ],
                _spinnerRight    = this._buttonDict[ 'padding-right' ],
                _spinnerWidth    = this._buttonDict.width,
                _valueLeft       = _spinnerLeft  ? _spinnerLeft.getValue()  : 0,
                _valueRight      = _spinnerRight ? _spinnerRight.getValue() : 0,
                _valueWidth      = _spinnerWidth ? _spinnerWidth.getValue() : 0,   
                _maxLeft         = _spinnerWidth ? _spinnerMaxWidth - _valueWidth - _valueRight  : _spinnerMaxWidth,    
                _maxRight        = _spinnerWidth ? _spinnerMaxWidth - _valueWidth - _valueLeft   : _spinnerMaxWidth,    
                _maxWidth        = _spinnerWidth ? _spinnerMaxWidth - _valueLeft  - _valueRight  : _spinnerMaxWidth;

            if ( _spinnerLeft  ) { _spinnerLeft.set(  'max', _maxLeft  ); }
            if ( _spinnerWidth ) { _spinnerWidth.set( 'max', _maxWidth ); }
            if ( _spinnerRight ) { _spinnerRight.set( 'max', _maxRight ); }

            return {
                'padding-left'  : _maxLeft,       
                'padding-right' : _maxRight,       
                'width'         : _maxWidth
            };
        },

        _onButtonClick : function ( name, e ) {

            var _activeButtons = this.get( 'activeButtons' );

            // close all pickers first
            Y.Object.each( this._pickerButtons , function( v, k ) {
                // check active
                if ( Y.Array.indexOf( _activeButtons, v ) != -1 && v != name ) { 
                    // hide
                    this._buttonDict[ v ].hidePicker();
                }
            }, this );

            // call editors for sepcific task
            Y.each( this._editors , function( v, k ) {
                // get editor plugin feature
                var _p = v.bewypeEditorTag || v.bewypeEditorText;
                // do click
                _p.onButtonClick( name, e );
            } );
        },

        _onButtonChange : function ( name, e ) {

            if ( name === 'apply' ) {
                // ...
                this.get( 'host' ).unplug( Y.Bewype.EditorPanel );
                // fire custom event
                return Y.fire( 'bewype-editor:onClose' );
            }

            // init changed flag
            var _changed = false;                              

            // call editors for sepcific task
            Y.each( this._editors , function( v, k ) {
                // get editor plugin feature
                var _p = v.bewypeEditorTag || v.bewypeEditorText;
                // do change
                _changed |= _p.onButtonChange( name, e );
            } );

            // fire custom event
            return _changed ? Y.fire( 'bewype-editor:onChange' ) : null;
        },

        _onSpinnerChange : function ( name, e ) {

            // init changed flag
            var _changed = false;

            // call editors for sepcific task
            Y.each( this._editors , function( v, k ) {
                // get editor plugin feature
                var _p = v.bewypeEditorTag || v.bewypeEditorText;
                // do change
                _changed |= _p.onSpinnerChange( name, e );
            } );

            // fire custom event
            return _changed ? Y.fire( 'bewype-editor:onChange' ) : null;
        }
    } );

    // manage custom event
    Y.augment( EditorPanel, Y.EventTarget );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorPanel = EditorPanel;

