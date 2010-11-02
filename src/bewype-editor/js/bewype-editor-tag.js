
    /**
     *
     */
    var PLACE_TMPL   = '',
        BUTTON_TMPL  = '',
        SPINNER_TMPL = '',
        EditorTag   = null;

    /**
     *
     */
    PLACE_TMPL += '<div class="{editorClass}-place">';
    PLACE_TMPL += '</div>';

    /**
     *
     */
    BUTTON_TMPL += '<div class="{editorClass} {buttonClass}">';
    BUTTON_TMPL += '</div>';

    /**
     *
     */
    SPINNER_TMPL += '<div class="{editorClass}">';
    SPINNER_TMPL += '{label}';
    SPINNER_TMPL += '<div class="{spinnerClass}"></div>';
    SPINNER_TMPL += '</div>';

    /**
     *
     */
    EditorTag = function(config) {
        EditorTag.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorTag.NAME = 'bewype-editor-tag';

    /**
     *
     */
    EditorTag.NS   = 'bewypeEditorTag';

    /**
     * disabled: 'color', 'background-color'
     */
    EditorTag.ATTRS = {
        editorClass : {
            value : 'bewype-editor-tag',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        activeButtons : {
            value : [
                    'height',
                    'width',
                    'padding-left',
                    'padding-top',
                    'bold',
                    'italic',
                    'underline',
                    'title',
                    'font-family',
                    'font-size',
                    'reset',
                    'apply'
                    ],
            writeOnce : true
        },
        panelNode : {
            value : null,
            writeOnce : true
        },
        selectionColor : {
            value : '#ddd',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerLabelHeight : {
            value : 'height',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerLabelWidth : {
            value : 'width',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerLabelPaddingLeft : {
            value : 'padding-left',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerLabelPaddingTop : {
            value : 'padding-top',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerMaxHeight : {
            value : 480,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        spinnerMaxWidth : {
            value : 640,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( EditorTag, Y.Plugin.Base, {

        /**
         *
         */
        _editor     : null,

        _buttonDict : {},

        _spinnerButtons : [ 'height', 'width', 'padding-left', 'padding-top' ],

        _spinnerValues  : {},

        _toggleButtons  : [ 'bold', 'italic', 'underline' ],

        _pickerButtons  : [ 'title', 'font-family', 'font-size', 'color', 'background-color', 'url' ],

        _pickerObjDict  : {
            'background-color' : Y.Bewype.PickerColor,
            'color'            : Y.Bewype.PickerColor,
            'font-family'      : Y.Bewype.PickerFontFamily,
            'font-size'        : Y.Bewype.PickerFontSize,
            'title'            : Y.Bewype.PickerTitle,
            'url'              : Y.Bewype.PickerUrl
        },

        _tagButtons  : [ 'bold', 'italic', 'title', 'underline', 'url' ],

        _cssButtons  : [ 'font-family', 'font-size', 'color', 'background-color' ],

        _initSpinnerValues : function () {

            // get host
            var _host        = this.get( 'host'        ),
                _cssDict     = Y.Bewype.Utils.getCssDict( _host ),
                _fn = null;

            _fn = function ( key, val ) {

                var _isHeightOrWidth = [ 'height', 'width' ].indexOf( key ) != -1,
                    _keySplt         = key.split( '-' ),
                    _hasBorder       = _keySplt.indexOf( 'border'  ) != -1,
                    _hasPadding      = _keySplt.indexOf( 'padding' ) != -1;

                // place or content style factory
                if ( _isHeightOrWidth || _hasBorder || _hasPadding ) {
                    // update spinner dict
                    this._spinnerValues[ key ] = val;
                }

                // return something to continue
                return val;
            };

            // separate place and content style
            Y.JSON.stringify( _cssDict, Y.bind( _fn, this ) );
        },

        _addSpinnerButton : function ( name ) {

            var _panelNode         = this.get( 'panelNode'   ),
                _editorClass       = this.get( 'editorClass' ) + '-button',
                _spinnerClass      = this.get( 'editorClass' ) + '-spinner-' + name,
                _spinnerNode       = null,
                _spinner           = null,
                _valueTxt          = this._spinnerValues[ name ],
                _value             = _valueTxt ? parseInt( _valueTxt.replace( /px/i, '' ), 10 ) : 0;

            // create node
            _spinnerNode = new Y.Node.create(
                Y.substitute( SPINNER_TMPL, {
                    editorClass  : _editorClass,
                    label        : this.get( Y.Bewype.Utils.camelize( 'spinner-label-' + name ) ),
                    spinnerClass : _spinnerClass
                } )
            );
            // add new node for the panel
            _panelNode.append( _spinnerNode );
            
            // attach spinner
            _spinner = new Y.Bewype.EntrySpinner({
                srcNode : _spinnerNode.one( '.' + _spinnerClass ),
                max     : this.get( Y.Bewype.Utils.camelize( 'spinner-max-' + name ) ),
                min     : 0,
                value   : _value
            });
            _spinner.render();

           // connect
           _spinner.on( 'entry:onChange', Y.bind( this._onSpinnerEventChange, this, name ) );

            // update button dict
            this._buttonDict[ name ] = _spinner;
        },

        __buttonFactory : function ( name, buttonClass, button ) {

            var _panelNode   = this.get( 'panelNode'   ),
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
            _panelNode.append( _buttonNode );

            // render button after add
            button.render( _buttonNode );

            // add custom event listener
            if ( buttonClass === 'button') {
                _customEventChange = 'button:onClick';
            } else {
                _customEventChange = 'button:onChange';
            }
            button.on( _customEventChange, Y.bind( this._onButtonEventChange, this, name ) );

            if ( this._pickerButtons.indexOf( name ) != -1 ) {
                _customEventClick = 'button:onClick';
                button.before( _customEventClick, Y.bind( this._onButtonEventClick, this, name ) );
            }

            // update button dict
            this._buttonDict[ name ] = button;
        },

        _addButton : function ( name ) {

            // create\render toggle button
            var _button = new Y.Bewype.Button( {
                label : name
            } );

            // do add
            this.__buttonFactory( name, 'button', _button );
        },

        _addToggleButton : function ( name ) {

            // create\render toggle button
            var _button = new Y.Bewype.ButtonToggle( {
                label : name
            } );

            // do add
            this.__buttonFactory( name, 'toggle-button', _button );
        },

        _addPickerButton : function ( name, pickerObj ) {

            // create\render toggle button
            var _button = new Y.Bewype.ButtonPicker( {
                label     : name,
                pickerObj :  pickerObj
            } );

            // do add
            this.__buttonFactory( name, 'picker-button', _button );
        },

        _initPanel : function () {

            var _activeButtons = this.get( 'activeButtons' );

            Y.Object.each( this._spinnerButtons, function( v, k ) {
                // check active
                if ( _activeButtons.indexOf( v ) != -1 ) { 
                    // do add
                    this._addSpinnerButton( v );
                }
            }, this );
            // set max value
            this._updateSpinnerMaxWidth();

            Y.Object.each( this._toggleButtons , function( v, k ) {
                // check active
                if ( _activeButtons.indexOf( v ) != -1 ) { 
                    // do add
                    this._addToggleButton( v );
                }
            }, this );

            Y.Object.each( this._pickerButtons , function( v, k ) {
                // check active
                if ( _activeButtons.indexOf( v ) != -1 ) { 
                    // do add
                    this._addPickerButton( v, this._pickerObjDict[ v ] );
                }
            }, this );

            this._addButton( 'reset' );

            this._addButton( 'apply' );
        },

        /**
         *
         */
        initializer : function( config ) {

            // set editor content
            this._initSpinnerValues();

            // set panel
            this._initPanel();

            // our custom events
            Y.publish( 'bewype-editor-tag:onClose'  );
            Y.publish( 'bewype-editor-tag:onChange' );
        },

        /**
         *
         */
        destructor : function () {
    
            // tmp vars
            var _editorClass   = this.get( 'editorClass' ),
                _panelNode     = this.get( 'panelNode'   );

            // remove buttons
            Y.Object.each( this.get( 'activeButtons' ) , function( v, k ) {
                // remove button
                this._buttonDict[ v ].destroy();
                delete( this._buttonDict[ v ] );
            }, this );

            // remove button nodes
            _panelNode.all( '.' + _editorClass + '-button' ).each( function( v, k ) {
                // remove node
                v.remove();
            } );
        },

        _hasLeftBlank : function (str){
            if (str.length === 0) {
                return false;
            } else if ( str.substring(0, 1).trim().length === 0 ) {
                return true;
            }
            return false;
        },

        _hasRightBlank : function (str){
            if (str.length === 0) {
                return false;
            } else if ( str.substring(str.length - 1, str.length).trim().length === 0 ) {
                return true;
            }
            return false;
        },

        _getInnerHTML : function ( node, raw ) {
            // get text
            var _node = node._node ? node._node : node,
                _html = _node.innerHTML,
                _t    = '';
            // ensure blank
            _t += this._hasLeftBlank( _html )  ? '&nbsp;' : '';
            _t += _html.trim();
            _t += this._hasRightBlank( _html ) ? '&nbsp;' : '';
            // update new node
            return raw ? _t : _t.trim() === '' ? null : new Y.Node.create( _t );
        },

        _getWorkingTagName : function ( name, previous ) {

            switch( name ) {
                case 'bold':
                    return 'b';

                case 'italic':
                    return 'i';

                case 'title':
                    var _button = this._buttonDict[ name ];
                    return previous ? _button.getPrevious() : _button.getValue();

                case 'underline':
                    return 'u';

                case 'url':
                    return 'a';

                default:
                    return 'span';
            }
        },

        _removeTagOrStyle : function ( node, selector, styleProperty ) {
            // little check
            if ( node && node._node.innerHTML ) {

                node.all( selector ).each( function ( v, k ) {
                    var _cssDict   = null,
                        _innerHTML = null,
                        _l         = null;
                    if ( styleProperty ) {
                        // get css dict
                        _cssDict = Y.Bewype.Utils.getCssDict( v );
                        // remove property
                        if ( _cssDict[ styleProperty ] ) {
                            delete( _cssDict[ styleProperty ] );
                            if ( styleProperty === 'background-color' ) {
                                delete( _cssDict.display );
                            }
                        }
                        // reset css without property
                        Y.Bewype.Utils.setCssDict( v, _cssDict );
                        // keep it?
                        _l = Y.Object.keys( _cssDict ).length;
                        if ( _l !== 0 ) {
                            return;
                        }
                    }
                    _innerHTML = this._getInnerHTML( v );
                    if ( !_innerHTML ) {
                        v.remove();
                    } else {
                        v.replace( _innerHTML );
                    }
                }, this );
            }
        },

        _updateStyle : function ( name ) {

            // tmp vars
            var _host            = this.get( 'host' ),
                _value           = this._buttonDict[ name ].getValue();

            // do update
            _host.setStyle( Y.Bewype.Utils.camelize( name ), _value );
        },

        _resetStyle : function () {

            var _host = this.get( 'host' );

            // do reset
            Y.Object.each( [ 'h1', 'h2', 'h3', 'h4', 'span', 'a', 'b', 'i', 'u' ], function( v, k ) {
                this._removeTagOrStyle( _host, v );
            }, this );
        },

        _getStyleValue : function ( name ) {

            var _host    = this.get( 'host' ),
                _cssDict = null;
            
            if ( name === 'url' ) {
                return _host.get( 'href' );
            } else {
                _cssDict = Y.Bewype.Utils.getCssDict( _host );
                return _cssDict[ name ];
            }
        },

        _refreshButtons : function ( reset, name ) {

            var _host          = this.get( 'host' ),
                _buttonNames   = name ? [ name ] : this._toggleButtons;

            Y.Object.each( _buttonNames, function( v, k ) {

                // no update for inactive button
                if ( this.get( 'activeButtons' ).indexOf(v) === -1) {
                    return;
                }

                var _value = null;

                switch ( v ) {
                    case 'bold':
                        _value = reset ? false : _host.one( 'b' ) !== null;
                        return this._buttonDict[ v ].setValue( _value );

                    case 'italic':
                        _value = reset ? false : _host.one( 'i' ) !== null;
                        return this._buttonDict[ v ].setValue( _value );

                    case 'underline':
                        _value = reset ? false : _host.one( 'u' ) !== null;
                        return this._buttonDict[ v ].setValue( _value );

                    case 'font-family':
                    case 'font-size':
                    case 'color':
                    case 'background-color':
                        _value = reset ? false : this._getStyleValue( v );
                        return this._buttonDict[ v ].setValue( _value );

                    case 'url':
                        _value = reset ? false : this._getStyleValue( v );
                        return this._buttonDict[ v ].setValue( _value );
                }
            }, this );
        },

        _onButtonEventChange : function ( name, e ) {

            switch ( name ) {
                case 'apply':
                    this.get( 'host' ).unplug( Y.Bewype.EditorTag );
                    // fire custom event
                    return Y.fire( 'bewype-editor-tag:onClose' );
                case 'cancel':
                    break;
                default:
                    break;
            }

            var _host = this.get( 'host' ),
                _value            = this._buttonDict[ name ].getValue(),
                _tag              = null,
                _tagNode          = null,
                _newNode          = null;             

            // get previous tag
            _tag = this._getWorkingTagName( name, true );

            // do some cleaning
            if ( _tag ) {
                this._removeTagOrStyle( _host, _tag, name );
            }
            
            // current tag
            _tag = this._getWorkingTagName( name );

            if ( _value && ( _value === true || _value.trim() !== '' ) ) {

                // create tag node
                if ( name === 'url' ) {
                    _tagNode = Y.Node.create( '<a href="' + _value + '"></a>' );
                } else {
                    _tagNode = Y.Node.create( '<' + _tag + '></' + _tag + '>' );
                }

                // update with css property
                if ( this._cssButtons.indexOf( name ) != -1 ) {
                    _tagNode.setStyle( Y.Bewype.Utils.camelize( name ), _value);
                    if ( name === 'background-color' ) {
                        _tagNode.setStyle( 'display', 'inline-block' );
                    }
                }
                //
                _tagNode.append( this._getInnerHTML( _host ) );

                // update current content
                _host.setContent( _tagNode );

            } else if ( name === 'reset' ) {
                
                // do reset
                this._resetStyle();

                // refresh buttons
                this._refreshButtons( true );
            }

            // fire custom event
            Y.fire( 'bewype-editor-tag:onChange' );
        },

        _onButtonEventClick : function ( name, e ) {

            var _activeButtons = this.get( 'activeButtons' );

            // close all pickers first
            Y.Object.each( this._pickerButtons , function( v, k ) {
                // check active
                if ( _activeButtons.indexOf( v ) != -1 && v != name ) { 
                    // hide
                    this._buttonDict[ v ].hidePicker();
                }
            }, this );

            // simple refresh
            this._refreshButtons( false, name );
        },

        _updateSpinnerMaxWidth : function () {

            var _spinnerMaxWidth = this.get( 'spinnerMaxWidth' ),
                _spinnerLeft     = this._buttonDict[ 'padding-left' ],
                _spinnerWidth    = this._buttonDict.width,
                _valueLeft       = _spinnerLeft  ? _spinnerLeft.getValue()  : 0,
                _valueWidth      = _spinnerWidth ? _spinnerWidth.getValue() : 0,
                _maxLeft         = _spinnerWidth ? _spinnerMaxWidth - _valueWidth  : _spinnerMaxWidth,
                _maxWidth        = _spinnerLeft  ? _spinnerMaxWidth - _valueLeft   : _spinnerMaxWidth;

            if ( _spinnerLeft  ) { _spinnerLeft.set(  'max', _maxLeft  ); }
            if ( _spinnerWidth ) { _spinnerWidth.set( 'max', _maxWidth ); }

            return {
                'padding-left' : _maxLeft,
                'width'        : _maxWidth
            };
        },

        _onSpinnerEventChange : function ( name, evt ) {
            // get host
            var _host        = this.get( 'host' ),
                _spinner     = this._buttonDict[ name ],
                _cssDict     = Y.Bewype.Utils.getCssDict( _host ),
                _oldStrValue = _cssDict[ name ],
                _oldValue    = _oldStrValue ? parseInt( _oldStrValue.replace( /px/i, '' ), 10 ) : 0,
                _newValue    = _spinner.getValue(),
                _cmpValue    = ( name == 'padding-left' ) ? _newValue / 2 : _newValue,
                _maxDict     = this._updateSpinnerMaxWidth(); // update spinner max value

            if ( _maxDict[name] && _cmpValue > _maxDict[name] ) {

                // restore old value
                _spinner.setValue( _oldValue );                

            } else {

                // style for the edited place
                _host.setStyle( Y.Bewype.Utils.camelize( name ), _newValue + 'px' );

                // fire custom event
                Y.fire( 'bewype-editor-tag:onChange' );
            }
        }
    } );

    // manage custom event
    Y.augment( EditorTag, Y.EventTarget );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorTag = EditorTag;

