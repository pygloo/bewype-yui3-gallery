YUI.add('bewype-editor-config', function(Y) {


    /**
     *
     */
    var EditorConfig = function(config) {
        EditorConfig.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorConfig.NAME = 'bewype-editor-config';

    /**
     *
     */
    EditorConfig.ATTRS = {
        editorClass : {
            value : 'bewype-editor-panel',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        activeButtons : {
            value : [
                    'height',
                    'width',
                    'padding-top',
                    'padding-right',
                    'padding-bottom',
                    'padding-left',
                    'bold',
                    'italic',
                    'underline',
                    'title',
                    'font-family',
                    'font-size',
                    'text-align',
                    'color',
                    'background-color',
                    'url',
                    'file',
                    'reset',
                    'apply'
                    ],
            writeOnce : true
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
        },       
        spinnerLabelPaddingTop : {
            value : 'padding-top',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },    
        spinnerLabelPaddingRight : {
            value : 'padding-right',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },    
        spinnerLabelPaddingBottom : {
            value : 'padding-bottom',
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
        fileStaticPath : {
            value : Y.config.doc.location.href + 'static/',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        uploadUrl : {
            value : Y.config.doc.location.href + 'upload',
            writeOnce : true
        },
        panelNode : {
            value : null,
            writeOnce : true
        },
        spinnerValues : {
            value : {}
        },
        selectionColor : {
            value : '#ddd',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( EditorConfig, Y.Plugin.Base );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorConfig = EditorConfig;



}, '@VERSION@' ,{requires:['plugin']});
YUI.add('bewype-editor-panel', function(Y) {


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
    SPINNER_TMPL += '<div class="{editorClass}">';
    SPINNER_TMPL += '{label}';
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

        _cssButtons  : [ 'font-family', 'font-size', 'text-align', 'color', 'background-color' ],

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

            if ( this._pickerButtons.indexOf( name ) != -1 ) {
                _customEventClick = 'button:onClick';
                button.before( _customEventClick, Y.bind( this._onButtonClick, this, name ) );
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

        _initPanel : function ( config ) {

            var _activeButtons = this.get( 'activeButtons' );

            Y.Object.each( this._spinnerButtons, function( v, k ) {
                // check active
                if ( _activeButtons.indexOf( v ) != -1 ) { 
                    // do add
                    this._addSpinnerButton( v, config );
                }
            }, this );
            // set max value
            this.updateSpinnerMaxWidth();

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
            var _host        = this.get( 'host' ),
                _editorClass = this.get( 'editorClass' );

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
            if ( this._editors.indexOf( editor ) == -1 ) {
                this._editors.push( editor );
            }
        },

        unRegisterEditor : function ( editor ) {

            // get editor position
            var _i = this._editors.indexOf( editor );

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
            return this._cssButtons.indexOf( name ) != -1;
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
                if ( this.get( 'activeButtons' ).indexOf(v) === -1) {
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
                        this._buttonDict.height.setValue( node._node.height );
                        this._buttonDict.width.setValue(  node._node.width );
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
                if ( _activeButtons.indexOf( v ) != -1 && v != name ) { 
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



}, '@VERSION@' ,{requires:['bewype-button', 'bewype-entry-spinner', 'bewype-utils', 'dataschema', 'event-custom', 'json-stringify', 'bewype-editor-config']});
YUI.add('bewype-editor-base', function(Y) {


    /**
     *
     */
    var EditorBase = null;

    /**
     *
     */
    EditorBase = function(config) {
        EditorBase.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorBase.NAME = 'bewype-editor-base';

    /**
     *
     */
    Y.extend( EditorBase, Y.Bewype.EditorConfig, {

        /**
         *
         */
        _panel : null,

        /**
         * common init file
         */
        _init : function ( config, spinnerValues ) {

            // temp var
            var _panelNode = this.get( 'panelNode' );

            // unplug panel
            if ( !_panelNode.bewypeEditorPanel ) {

                // plug panel using passed config
                config.spinnerValues = spinnerValues;
                _panelNode.plug( Y.Bewype.EditorPanel, config );

                // register
                _panelNode.bewypeEditorPanel.registerEditor( this.get( 'host' ) );
            }                

            // set our global panel var
            this._panel = _panelNode.bewypeEditorPanel;


        },

        /**
         *
         */
        initializer : function( config ) {             
        },

        /**
         *
         */
        destructor : function () {
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

        getInnerHTML : function ( node, raw ) {
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

        removeTagOrStyle : function ( node, selector, styleProperty ) {
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
                    _innerHTML = this.getInnerHTML( v );
                    if ( !_innerHTML ) {
                        v.remove();
                    } else {
                        v.replace( _innerHTML );
                    }
                }, this );
            }
        },

        updateStyle : function ( node, name ) {

            // tmp vars
            var _button = this._panel.getButton( name ),
                _value  = _button ? _button.getValue() : null;

            if ( _value ) {
                // do update
                node.setStyle( Y.Bewype.Utils.camelize( name ), _value );
            }
        },

        resetStyle : function ( node, tagOnly) {

            // do reset
            Y.Object.each( [ 'h1', 'h2', 'h3', 'h4', 'span', 'a', 'b', 'i', 'u' ], function( v, k ) {
                this.removeTagOrStyle( node, v );
            }, this );

            // and clear tag style
            if ( !tagOnly ) {
                var _cssDict = Y.Bewype.Utils.getCssDict( node );
                // remove buttons
                Y.Object.each( this._panel.get( 'activeButtons' ) , function( v, k ) {
                    if ( this._panel._cssButtons.indexOf( v ) != -1) {
                        delete( _cssDict[ v ] );
                    }
                }, this );
                // set updated dict
                Y.Bewype.Utils.setCssDict( node, _cssDict );
            }
        },

        onButtonClick : function ( name, e ) {
            // should be overriden                            
        },

        onButtonChange : function ( name, e ) {
            // should be overriden
            return false;
        },

        _onSpinnerChange : function ( node, name, evt ) {
            // get host
            var _spinner     = this._panel.getButton( name ),
                // compute current css value
                _cssDict     = Y.Bewype.Utils.getCssDict( node ),
                _oldStrValue = _cssDict[ name ],
                _oldValue    = _oldStrValue ? parseInt( _oldStrValue.replace( /px/i, '' ), 10 ) : 0,
                // ensure new value - should not happen
                _newValue    = _spinner ? _spinner.getValue() : 0,
                // specific for horizontal padding ??
                _cmpValue    = ( name === 'padding-left' || name === 'padding-right' ) ? _newValue / 2 : _newValue,
                _maxDict     = _spinner ? this._panel.updateSpinnerMaxWidth() : 0,
                _max         = _maxDict[ name ]; // update spinner max value

            if ( !_spinner ) {
                return false;
            }

            if ( _max && _cmpValue > _max ) {

                // restore old value
                _spinner.setValue( _oldValue );
                // nothing has changed
                return false;

            } else {

                // style for the edited place
                node.setStyle( Y.Bewype.Utils.camelize( name ), _newValue + 'px' );
                // changed
                return true;
            }
        },

        onSpinnerChange : function ( name, evt ) {
            // should be overriden
            return false;
        }
    } );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorBase = EditorBase;



}, '@VERSION@' ,{requires:['bewype-editor-panel']});
YUI.add('bewype-editor-tag', function(Y) {


    /**
     *
     */
    var EditorTag = function(config) {
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
     *
     */
    EditorTag.ATTRS = {
    };

    Y.extend( EditorTag, Y.Bewype.EditorBase, {

        _initSpinnerValues : function () {

            // get host
            var _host          = this.get( 'host' ),
                _cssDict       = Y.Bewype.Utils.getCssDict( _host ),
                _fn            = null,
                _h             = Y.Bewype.Utils.getHeight( _host ) + 'px',    
                _w             = Y.Bewype.Utils.getWidth(  _host ) + 'px',
                _spinnerValues = {};       

            // ensure height and width values
            if ( !Y.Object.hasKey( _cssDict, 'height' ) ) {       
                _cssDict.height = _h;
            }                     

            if ( !Y.Object.hasKey( _cssDict, 'width' ) ) {                  
                _cssDict.width = _w; 
            }  

            _fn = function ( key, val ) {

                var _isHeight        = key === 'height',            
                    _isWidth         = key === 'width',            
                    _keySplt         = key.split( '-' ),            
                    _hasBorder       = _keySplt.indexOf( 'border'  ) != -1,
                    _hasPadding      = _keySplt.indexOf( 'padding' ) != -1;

                // place or content style factory
                if ( _isHeight || _isWidth || _hasBorder || _hasPadding ) {
                    // update spinner dict
                    _spinnerValues[ key ] = val;
                }

                // return something to continue
                return val;
            };

            // separate place and content style
            Y.JSON.stringify( _cssDict, Y.bind( _fn, this ) );

            //
            return _spinnerValues;
        },

        /**
         *
         */
        initializer : function( config ) {

            // set editor content
            var _spinnerValues = this._initSpinnerValues();

            // set panel
            this._init( config, _spinnerValues );
        },

        onButtonClick : function ( name, e ) {

            // simple refresh
            this._panel.refreshButtons( this.get( 'host' ), false, name );
        },

        onButtonChange : function ( name, e ) {

            var _host        = this.get( 'host' ),
                _hostTagName = _host.get( 'tagName' ),
                _button      = this._panel.getButton( name ),
                _value       = _button ? _button.getValue() : null,
                _filePath    = ( name === 'file' ) ? ( this.get( 'fileStaticPath' ) + _value ) : null,
                _tag         = null,
                _tagNode     = null;

            switch ( name ) {

                case 'cancel':
                    break;

                case 'file':
                    if ( _hostTagName && _hostTagName.toLowerCase() === 'img' ) {

                        // update file src after upload
                        _host.setAttribute( 'src', _filePath );
                        
                        // get current css - do not work yet
                        // _cssDict = Y.Bewype.Utils.getCssDict( _host );
                        // remove previous height and width
                        // delete( _cssDict.height );
                        // delete( _cssDict.width );
                        // apply cleared dict
                        // Y.Bewype.Utils.setCssDict( _host, _cssDict );

                        // clear previous                        
                        _host.setStyle( 'height', 'auto' );
                        _host.setStyle( 'width',  'auto' );

                        // refresh buttons
                        this._panel.refreshButtons( _host, false, name );  

                        // changed
                        return true;
                    }
                    return false;

                default:
                    break;
            }

            // get previous tag
            _tag = this._panel.getWorkingTagName( name, true );

            // do some cleaning
            if ( _tag ) {
                this.removeTagOrStyle( _host, _tag, name );
            }
            
            // current tag
            _tag = this._panel.getWorkingTagName( name );

            // has new value to set
            if ( _value && ( _value === true || _value.trim() !== '' ) ) {

                // update with css property
                if ( this._panel.isCssButton( name ) ) {

                    // simple style update
                    _host.setStyle( Y.Bewype.Utils.camelize( name ), _value);

                } else {
                    // create tag node
                    if ( name === 'url' ) {
                        _tagNode = Y.Node.create( '<a href="' + _value + '"></a>' );
                    } else {
                        _tagNode = Y.Node.create( '<' + _tag + '></' + _tag + '>' );
                    }
                    //
                    _tagNode.append( this.getInnerHTML( _host ) );
                    // update current content
                    _host.setContent( _tagNode );
                }


            } else if ( name === 'reset' ) {
                
                // do reset
                this.resetStyle( _host );
                // refresh buttons
                this._panel.refreshButtons( _host, true );
            }

            // changed
            return true;
        },

        onSpinnerChange : function ( name, evt ) {
            // do change
            return this._onSpinnerChange( this.get( 'host' ), name, evt );
        }
    } );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorTag = EditorTag;



}, '@VERSION@' ,{requires:['bewype-editor-base']});
YUI.add('bewype-editor-text', function(Y) {


    /**
     *
     */
    var PLACE_TMPL   = '',
        IMAGE_TMPL   = '',
        EditorText   = null;

    /**
     *
     */
    PLACE_TMPL += '<div class="{editorClass}-place">';
    PLACE_TMPL += '</div>';

    /**
     *
     */
    IMAGE_TMPL += '<img src="{filePath}" />';

    /**
     *
     */
    EditorText = function(config) {
        EditorText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorText.NAME = 'bewype-editor-text';

    /**
     *
     */
    EditorText.NS   = 'bewypeEditorText';

    /**
     * disabled: 'color', 'background-color'
     */
    EditorText.ATTRS = {
    };

    Y.extend( EditorText, Y.Bewype.EditorBase, {

        /**
         *
         */
        _editor     : null,

        _oMainCssdict : {},

        /**
         *
         */
        _initEditor : function () {

            var _host        = this.get( 'host'        ),
                _editorClass = this.get( 'editorClass' ),
                _cssDict     = Y.Bewype.Utils.getCssDict( _host ),
                _innerHTML   = _host.get( 'innerHTML' ),
                _placeNode   = null;
                // _main        = new Y.Node.create( '<div><div class="main" /></div>' );

            // set content to main
            // _main.one( '.main' ).append( this.getInnerHTML( _host ) );
            
            // and empty tag content temporary
            _host.set( 'innerHTML', '' );

            // create place node
            _placeNode = new Y.Node.create(
                Y.substitute( PLACE_TMPL, {
                    editorClass : _editorClass
                } )
            );
            // add new node for the editor
            _host.append( _placeNode );

            // Create the Base Editor
            this._editor = new Y.EditorBase( {
                content : _innerHTML // _main.get( 'innerHTML' )
            } );

            // Rendering the Editor
            this._editor.render( _placeNode );

            // add custom event listener
            this._editor.after( 'nodeChange', Y.bind( this._onEditorChange, this ) );

            //
            return _cssDict;
        },

        _initContent : function ( cssDict ) {

            // get host
            var _host          = this.get( 'host' ),
                _placeClass    = this.get( 'editorClass' ) + '-place',
                _placeNode     = _host.one( '.' + _placeClass ),
                _inst          = this._editor.getInstance(),
                _body          = _inst.one( 'body' ),
                _fn            = null,
                _spinnerValues = {};

            _fn = function ( key, val ) {

                var _isHeightOrWidth = [ 'height', 'width' ].indexOf( key ) != -1,
                    _keySplt         = key.split( '-' ),
                    _hasBorder       = _keySplt.indexOf( 'border'  ) != -1,
                    _hasPadding      = _keySplt.indexOf( 'padding' ) != -1;

                // place or content style factory
                if ( _isHeightOrWidth || _hasBorder || _hasPadding ) {
                    // style for the edited place
                    _placeNode.setStyle( Y.Bewype.Utils.camelize( key ), val );
                    // update spinner dict
                    _spinnerValues[ key ] = val;
                } else if ( key ) {
                    // style for the edited content
                    _body.setStyle( Y.Bewype.Utils.camelize( key ), val );
                }

                // return something to continue
                return val;
            };

            // ensure height width
            this._oMainCssdict.height = '100%';
            this._oMainCssdict.width  = '100%';

            Y.each( [ 'iframe', 'html', 'body' ] , function ( v, k ) {
                // ensure nice rendering
                var _t = _host.one( v ) || _inst.one( v );
                _t.setStyle( 'cssText', 'padding: 0px; margin: 0px; height: 100%; width: 100%;');

                // specific for chrome
                if ( Y.UA.chrome && v === 'iframe' ) {
                    _t.setStyle( 'margin-top', '-15px' );
                }

            } );

            // separate place and content style
            Y.JSON.stringify( cssDict, Y.bind( _fn, this ) );

            // clear previous css
            _host.setStyle( 'cssText',  '');
        
            //
            return _spinnerValues;
        },

        /**
         *
         */
        initializer : function( config ) {

            var _cssDict       = this._initEditor(), // add editor
                _spinnerValues = this._initContent( _cssDict ); // set editor content

            // set panel
            this._init( config, _spinnerValues );
        },

        /**
         *
         */
        destructor : function () {

            if ( !this._editor ) {
                return;
            }
    
            // tmp vars
            var _host          = this.get( 'host'        ),
                _editorClass   = this.get( 'editorClass' ),
                _placeClass    = '.' + _editorClass + '-place',
                _placeNode     = _host.one( _placeClass  ),
                _body          = this._editor.getInstance().one( 'body' ),
                // _main          = _body.one( '.main' ),
                _selectionNode = _body.one( '.selection' ),
                _fn            = null;

            // hide first
            this._editor.hide();

            // remove selection node
            if ( _selectionNode ) {
                _selectionNode.replace( this.getInnerHTML( _selectionNode ) );
            }

            // restore content
            _host.set( 'innerHTML', _body.get( 'innerHTML' ) );

            // css spliter
            _fn = function ( type_, key, val ) {
                // do update
                if ( key ) {
                    if ( type_ === 'content' && ( key.split( '-' ).indexOf( 'padding' ) != -1 || key === 'height' || key === 'width' ) ) {
                        // do nothing
                    } else {
                        _host.setStyle( Y.Bewype.Utils.camelize( key ), val );
                    }
                }
                // return somethign to continue
                return val;
            };
            // separate place and content style
            Y.JSON.stringify( Y.Bewype.Utils.getCssDict( _placeNode ), Y.bind( _fn, this, 'place'   ) );
            Y.JSON.stringify( Y.Bewype.Utils.getCssDict( _body      ), Y.bind( _fn, this, 'content' ) );

            // destroy editor
            this._editor.destroy();
        },

        updateStyle : function ( name ) {

            // tmp vars
            var _host            = this.get( 'host' ),
                _isHeightOrWidth = [ 'height', 'width' ].indexOf( name ) != -1,
                _keySplt         = name.split( '-' ),
                _hasPadding      = _keySplt.indexOf( 'padding' ) != -1,
                _node            = null,
                _button          = this._panel.getButton( name ),
                _value           = _button ? _button.getValue() : null;

            // get place or content node factory
            if ( _isHeightOrWidth || _hasPadding ) {
                // get place node
                _node = _host.one( '.' + this.get( 'editorClass' ) + '-place' );
            } else {
                // get content node
                _node = this._editor.getInstance().one( 'body' ); // .one( '.main' );
            }

            // do update
            _node.setStyle( Y.Bewype.Utils.camelize( name ), _value );
        },
        
        _clearSelection : function ( selection, range, removeSelectionNode ) {
            if ( selection.clear ) {
                selection.clear();
            } else if ( selection.removeAllRanges ) {
                range.detach();
                selection.removeAllRanges();
            } else {
                return;
            }

            if ( removeSelectionNode !== false ) {
                var _inst = this._editor.getInstance(),
                    _body = _inst.one( 'body' ); // _main = _inst.one( 'body' ).one( '.main' );

                this.removeTagOrStyle( _body, '.selection' );
            }
        },

        _isFocusNodeFisrt : function ( selection ) {

            var _inst             = this._editor.getInstance(),
                _mNode            = _inst.one( 'body' )._node, // .one( '.main' )
                _aNode            = selection.anchorNode,
                _fNode            = selection.focusNode,
                _aOffset          = selection.anchorOffset,
                _fOffset          = selection.focusOffset,
                _mContent         = _mNode.innerHTML ? _mNode.innerHTML : _mNode.textContent,
                _aContent         = _aNode.innerHTML ? _aNode.innerHTML : _aNode.textContent,
                _fContent         = _fNode.innerHTML ? _fNode.innerHTML : _fNode.textContent,
                _aPosition        = 0,
                _fPosition        = 0;

            if ( _aNode == _fNode ) {

                // position test
                return _fOffset < _aOffset;

            } else {
                // get positions
                _aPosition = _mContent.indexOf( _aContent );
                _fPosition = _mContent.indexOf( _fContent );

                // position test
                return _fPosition < _aPosition;
            }
        },

        _ensureRangeFirstNode : function ( selection, range, firstNode ) {

            var _inst = this._editor.getInstance(),
                // _main     = _inst.one( 'body' ).one( '.main' ),
                _mNode    = _inst.one( 'body' )._node,
                _cK       = 0,
                _err      = null;

            if ( firstNode.parentNode != _mNode ) {
                try {
                    while ( firstNode.parentNode && firstNode.parentNode != _mNode ) {
                        firstNode = firstNode.parentNode;
                        // manage endless case :s
                        _cK += 1;
                        if ( _cK == 10 ) {
                            break;
                        }
                    }
                    range.setStartBefore( firstNode );
                } catch ( err ) {
                    _err = err;
                    return this._clearSelection( selection, range );
                }
            } else if ( selection.anchorOffset === 0 && !selection.anchorNode.previousSibling ) {
                range.setStart( _mNode, 0 );
            }
            return true;
        },

        _ensureRangeLastNode : function ( selection, range, lastNode ) {

            var _inst   = this._editor.getInstance(),
                // _main     = _inst.one( 'body' ).one( '.main' ),
                _mNode  = _inst.one( 'body' )._node,
                _cK     = 0,
                _err    = null;

            if ( lastNode.parentNode != _mNode ) {
                try {
                    while ( lastNode.parentNode && lastNode.parentNode != _mNode ) {
                        lastNode = lastNode.parentNode;
                        // manage endless case :s
                        _cK += 1;
                        if ( _cK == 10 ) {
                            break;
                        }
                    }
                    range.setEndAfter( lastNode );
                } catch ( err ) {
                    _err = err;
                    return this._clearSelection( selection, range );
                }
            }
            return true;
        },

        _refreshSelectionNode : function () {

            var _inst           = this._editor.getInstance(),
                _selectionNode  = _inst.one( '.selection' ),
                _selectionColor = this.get( 'selectionColor' );

            if ( !_selectionNode ) {
                return;
            }

            _selectionNode.setStyle( 'backgroundColor', _selectionColor );
            _selectionNode.setStyle( 'display',         'inline-block'  );
        },

        _updateSelection : function () {

            var _host          = this.get( 'host' ),
                _inst          = this._editor.getInstance(),
                _body          = _inst.one( 'body'  ),
                // _main          = _body.one( '.main' ),
                _selectionNode = _body.one( '.selection' ),
                _selection     = Y.Bewype.Utils.getSelection( _host ),
                _range         = Y.Bewype.Utils.getRange( _selection ),
                _firstNode     = null,
                _lastNode      = null;

            // little check
            if ( !_selection.anchorNode || !_selection.focusNode ) {
                return this._clearSelection( _selection, _range );
            }                        

            // remove previous surrounding node
            if ( _selectionNode ) {
                _selectionNode.replace( this.getInnerHTML( _selectionNode ) );
            }
            
            if ( _selection.anchorNode != _selection.focusNode || _selection.anchorOffset != _selection.focusOffset ) {

                if ( this._isFocusNodeFisrt( _selection ) ) {
                    _firstNode = _selection.focusNode;
                    _lastNode  = _selection.anchorNode;
                } else {
                    _firstNode = _selection.anchorNode;
                    _lastNode  = _selection.focusNode;
                }

                // ensure valid range
                if ( !this._ensureRangeFirstNode( _selection, _range, _firstNode ) ) {
                    return;
                }
                if ( !this._ensureRangeLastNode(  _selection, _range, _lastNode ) ) {
                    return;
                }

                try {
                    // create new surrounding node                             
                    _selectionNode = Y.Node.create( '<span class="selection"></span>' );
                    _body.append( _selectionNode );
                    // set range surrounding node
                    _range.surroundContents( _body.one( '.selection' )._node );
                } catch ( err ) {
                    // Oops! clear all
                    return this._clearSelection( _selection, _range );
                }

                // can clear native selection now
                this._clearSelection( _selection, _range, false );

            } else {
                this.removeTagOrStyle( _body, '.selection' );
            }

            // update button status
            this._panel.refreshButtons( _selectionNode );

            // custom rendering
            this._refreshSelectionNode();
        },

        _insertNodeToSelection : function ( node ) {

            var _host      = this.get( 'host' ),
                _window    = Y.Bewype.Utils.getWindow( _host ),
                _document  = Y.Bewype.Utils.getDocument( _host ),
                _selection = null, 
                _range     = null;
            
            if ( _window._node.getSelection ) { // Firefox, Google Chrome ??? , Safari, Opera
                // ...
                _selection = _window._node.getSelection();
                // ...
                if (_selection.rangeCount > 0) {
                    _range = _selection.getRangeAt (0);
                    _range.insertNode ( node._node );
                }
            } else {  // Internet Explorer
                // ...
                _range = _document._node.selection.createRange();
                _range.collapse (true);
                _range.pasteHTML ( node._node );
            }
        },

        _onEditorChange : function ( e ) {
            //
            if ( e.changedEvent.type === 'dblclick' ) {

            } else if ( e.changedEvent.type === 'mouseup' ) {
                this._updateSelection();
            }
            /*
            else if ( e.changedEvent.type === 'keyup' &&  e.changedEvent.charCode === 13 ) {
                var _inst = this._editor.getInstance(),
                    _body = _inst.one( 'body' ),
                    _main = _body.one( '.main' );
                // merge content just in case
                _body.get( 'children' ).each( function ( v, k ) {
                    if ( v != _main ) {
                        // set node cotent to main
                        _main.append( Y.Node.create( '<br />' ) );
                        _main.append( this.getInnerHTML( v ) );
                        // remove node
                        v.remove();
                    }
                } );
            }
            */
        },

        onButtonClick : function ( name, e ) {

            var _inst           = this._editor.getInstance(),
                _selectionNode  = _inst.one( '.selection' );

            // simple refresh
            this._panel.refreshButtons( _selectionNode, false, name );
        },

        onButtonChange : function ( name, e ) {

            var _inst          = this._editor.getInstance(),
                _body          = _inst.one( 'body'  ),
                // _main          = _body.one( '.main' ),
                _selectionNode = _body.one( '.selection' ),
                _button        = this._panel.getButton( name ),
                _value         = _button ? _button.getValue() : null,
                _img           = null,
                _tag           = null,
                _tagNode       = null,
                _newNode       = null,
                _caretNode     = null;

            if ( !_selectionNode ) {

                if ( this._panel.isCssButton( name ) ) {
                    // style update
                    this.updateStyle( name );
                    // fire custom event
                    return true;

                }  else if ( name === 'file' ) {
                    // ...
                    _img = Y.Node.create( Y.substitute( IMAGE_TMPL, {
                            filePath : this.get( 'fileStaticPath' ) + _value
                        } )
                    );
                    // ...
                    this._insertNodeToSelection( _img );
                    // fire custom event
                    return true;

                } else if ( name === 'reset') {
                    // reset main node
                    this.resetStyle( _body );
                    // restore original values and quit
                    Y.Bewype.Utils.setCssDict( _body, this._oMainCssdict );
                    // fire custom event
                    return true;
                }
            } else if ( name === 'file' ) {
                // pass
            } else {
                // get previous tag
                _tag = this._panel.getWorkingTagName( name, true );
                // do some cleaning
                if ( _tag ) {
                    this.removeTagOrStyle( _selectionNode, _tag, name );
                }
                // current tag
                _tag = this._panel.getWorkingTagName( name );
                // ...
                if ( _value && ( _value === true || _value.trim() !== '' ) ) {
                    // create tag node
                    if ( name === 'url' ) {
                        _tagNode = Y.Node.create( '<a href="' + _value + '"></a>' );
                    } else {
                        _tagNode = Y.Node.create( '<' + _tag + '></' + _tag + '>' );
                    }
                    // update with css property
                    if ( this._panel.isCssButton( name ) ) {
                        _tagNode.setStyle( Y.Bewype.Utils.camelize( name ), _value);
                        if ( name === 'background-color' ) {
                            _tagNode.setStyle( 'display', 'inline-block' );
                        }
                    }
                    // create surrounding node
                    _newNode = Y.Node.create( '<span class="selection"></span>' );
                    _newNode.append( _tagNode );
                    //
                    _newNode.one( _tag ).append( this.getInnerHTML( _selectionNode ) );
                    // update current selection
                    _selectionNode.replace(_newNode);

                } else if ( name === 'reset' ) {
                    // do reset
                    this.resetStyle( _selectionNode, true );
                    // refresh buttons
                    this._panel.refreshButtons( _selectionNode, true );
                }

                // custom rendering
                this._refreshSelectionNode();
                // fire custom event
                return true;
            }
            // default
            return false;
        },

        onSpinnerChange : function ( name, evt ) {
            // get place node
            var _host        = this.get( 'host' ),
                _placeClass  = this.get( 'editorClass' ) + '-place',
                _placeNode   = _host.one( '.' + _placeClass );
            // do change
            return this._onSpinnerChange( _placeNode, name, evt );
        }
    } );

    // manage custom event
    Y.augment( EditorText, Y.EventTarget );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorText = EditorText;



}, '@VERSION@' ,{requires:['bewype-editor-base', 'editor']});


YUI.add('bewype-editor', function(Y){}, '@VERSION@' ,{use:['bewype-editor-config', 'bewype-editor-panel', 'bewype-editor-base', 'bewype-editor-tag', 'bewype-editor-text']});

