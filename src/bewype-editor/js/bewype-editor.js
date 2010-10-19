
    /**
     *
     */
    var PLACE_TMPL  = '',
        BUTTON_TMPL = '',
        Editor      = null;

    /**
     *
     */
    PLACE_TMPL += '<div class="{editorClass}-place">';
    PLACE_TMPL += '</div>';

    /**
     *
     */
    BUTTON_TMPL += '<div class="{editorClass}">';
    BUTTON_TMPL += '</div>';

    /**
     *
     */
    Editor = function(config) {
        Editor.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    Editor.NAME = "bewypeEditor";

    /**
     *
     */
    Editor.NS   = 'bewypeEditor';

    /**
     *
     */
    Editor.ATTRS = {
        editorClass : {
            value : 'yui3-bewype-editor',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        activeButtons : {
            value : [ 'reset', 'bold', 'italic', 'underline', 'font-family', 'font-size', 'color', 'background-color' ],
            writeOnce : true
        },
        panelNode : {
            value : null,
            writeOnce : true
        },
        selectionColor: {
            value : '#ddd',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( Editor, Y.Plugin.Base, {

        /**
         *
         */
        _editor     : null,

        _buttonDict : {},

        _toggleButtons  : [ 'bold', 'italic', 'underline' ],

        _pickerButtons  : [ 'font-family', 'font-size', 'color', 'background-color' ],

        _pickerObjDict : {
            'font-family'      : Y.Bewype.PickerFontFamily,
            'font-size'        : Y.Bewype.PickerFontSize,
            'color' : Y.Bewype.PickerColor,
            'background-color' : Y.Bewype.PickerColor
        },

        _tagButtons  : [ 'bold', 'italic', 'underline' ],

        _cssButtons  : [ 'font-family', 'font-size', 'color', 'background-color' ],

        _selectedNodeList : null,

        _oMainCssdict : {},

        /**
         *
         */
        _initEditor : function () {

            var _host        = this.get( 'host'        ),
                _editorClass = this.get( 'editorClass' ),
                _cssDict     = Y.Bewype.Utils.getCssDict( _host ),
                _placeNode   = null,
                _main        = new Y.Node.create( '<div><div class="main" /></div>' );

            // set content to main
            _main.one( '.main' ).append( this._getInnerHTML( _host ) );
            
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

            //Create the Base Editor
            this._editor = new Y.EditorBase( {
                content : _main.get( 'innerHTML' )
            } );

            //Rendering the Editor
            this._editor.render( _placeNode );

            // add custom event listener
            this._editor.after( 'nodeChange', Y.bind( this._onEditorChange, this ) );

            //
            return _cssDict;
        },

        _initContent : function ( cssDict ) {

            // get host
            var _host       = this.get( 'host' ),
                _placeClass = this.get( 'editorClass' ) + '-place',
                _placeNode  = _host.one( '.' + _placeClass ),
                _body       = this._editor.getInstance().one( 'body' ),
                _main       = _body.one( '.main' ),
                _fn         = null;

            // ensure nice body
            _body.setStyle( 'cssText', 'padding: 0; margin: 0; height: 100%; width: 100%;');

            _fn = function ( key, val ) {

                var _isHeightOrWidth = [ 'height', 'width' ].indexOf( key ) != -1,
                    _keySplt         = key.split( '-' ),
                    _hasBorder       = _keySplt.indexOf( 'border'  ) != -1,
                    _hasPadding      = _keySplt.indexOf( 'padding' ) != -1;

                // place or content style factory
                if ( _isHeightOrWidth || _hasBorder || _hasPadding ) {

                    // style for the edited place
                    _placeNode.setStyle( Y.Bewype.Utils.camelize( key ), val );

                } else if ( key ) {
                    // style for the edited content
                    _main.setStyle( Y.Bewype.Utils.camelize( key ), val );
                }

                // return something to continue
                return val;
            };

            // ensure height width
            this._oMainCssdict.height = '100%';
            this._oMainCssdict.width  = '100%';
            _main.setStyle( 'height', '100%' );
            _main.setStyle( 'width' , '100%' );

            // separate place and content style
            Y.JSON.stringify( cssDict, Y.bind( _fn, this ) );

            // clear previous css
            _host.setStyle( 'cssText',  '');
        },

        __buttonFactory : function ( name, buttonClass, button ) {

            var _panelNode   = this.get( 'panelNode'   ),
                _editorClass = this.get( 'editorClass' ),
                _buttonNode  = null,
                _customEvent = null;

            // create node
            _buttonNode = new Y.Node.create(
                Y.substitute( BUTTON_TMPL, {
                    editorClass : _editorClass + '-' + buttonClass + '-' + name
                } )
            );
            // add new node for the panel
            _panelNode.append( _buttonNode );

            // render button after add
            button.render( _buttonNode );

                // add custom event listener
            if ( buttonClass === 'button') {
                _customEvent = 'button:onClick';
            } else {
                _customEvent = 'button:onChange';
            }
            button.on( _customEvent, Y.bind( this._onButtonEvent, this, name ) );

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

            this._addButton( 'reset' );

            var _activeButtons = this.get( 'activeButtons' );

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
        },

        /**
         *
         */
        initializer : function( config ) {

            // add editor
            var _cssDict = this._initEditor();

            // set editor content
            this._initContent( _cssDict );

            // set panel
            this._initPanel();
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
                _placeNode     = _host.one( _placeClass ),
                _body          = this._editor.getInstance().one( 'body' ),
                _main          = _body.one( '.main' ),
                _selectionNode = _main.one( '.selection' ),
                _fn            = null;

            // hide first
            this._editor.hide();

            // remove selection node
            if ( _selectionNode ) {
                _selectionNode.replace( this._getInnerHTML( _selectionNode ) );
            }

            // restore content
            _host.set( 'innerHTML', _main.get( 'innerHTML' ) );

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
            Y.JSON.stringify( Y.Bewype.Utils.getCssDict( _main      ), Y.bind( _fn, this, 'content' ) );

            // destroy editor
            this._editor.destroy();

            Y.Object.each( this.get( 'activeButtons' ) , function( v, k ) {

                // remove button
                this._buttonDict[ v ].destroy();
                delete( this._buttonDict[ v ] );

            }, this );

            this._buttonDict = {};
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

        _getWorkingTagName : function ( name ) {

            switch( name ) {
                case 'bold':
                    return 'b';

                case 'italic':
                    return 'i';

                case 'underline':
                    return 'u';

                default:
                    return 'span';
            }
        },

        _removeTag : function ( node, selector, styleProperty ) {
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
                        v.replace( this._getInnerHTML( v ) );
                    }
                }, this );
            }
        },

        _updateMainStyle : function ( name, node ) {

            // tmp vars
            var _host            = this.get( 'host' ),
                _isHeightOrWidth = [ 'height', 'width' ].indexOf( name ) != -1,
                _keySplt         = name.split( '-' ),
                _hasPadding      = _keySplt.indexOf( 'padding' ) != -1,
                _node            = node ? node : null,
                _value           = this._buttonDict[ name ].getValue();

            if ( !_node ) {
                // get place or content node factory
                if ( _isHeightOrWidth || _hasPadding ) {
                    // get place node
                    _node = _host.one( '.' + this.get( 'editorClass' ) + '-place' );
                } else {
                    // get content node
                    _node = this._editor.getInstance().one( '.main' );
                }
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
                    _main = _inst.one( 'body' ).one( '.main' );

                this._removeTag(_main, '.selection');
            }
        },

        _isFocusNodeFisrt : function ( selection ) {

            var _inst             = this._editor.getInstance(),
                _mNode            = _inst.one( 'body' ).one( '.main' )._node,
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
                _main     = _inst.one( 'body' ).one( '.main' ),
                _mainNode = _main._node,
                _cK       = 0;

            if ( firstNode.parentNode != _mainNode ) {
                try {
                    while ( firstNode.parentNode && firstNode.parentNode != _mainNode ) {
                        firstNode = firstNode.parentNode;
                        // manage endless case :s
                        _cK += 1;
                        if ( _cK == 10 ) {
                            break;
                        }
                    }
                    range.setStartBefore( firstNode );
                } catch ( err ) {
                    return this._clearSelection( selection, range );
                }
            } else if ( selection.anchorOffset === 0 && !selection.anchorNode.previousSibling ) {
                range.setStart( _mainNode, 0 );
            }
            return true;
        },

        _ensureRangeLastNode : function ( selection, range, lastNode ) {

            var _inst     = this._editor.getInstance(),
                _main     = _inst.one( 'body' ).one( '.main' ),
                _mainNode = _main._node,
                _cK       = 0;

            if ( lastNode.parentNode != _mainNode ) {
                try {
                    while ( lastNode.parentNode && lastNode.parentNode != _mainNode ) {
                        lastNode = lastNode.parentNode;
                        // manage endless case :s
                        _cK += 1;
                        if ( _cK == 10 ) {
                            break;
                        }
                    }
                    range.setEndAfter( lastNode );
                } catch ( err ) {
                    return this._clearSelection( selection, range );
                }
            }
            return true;
        },

        _refreshSelectionNode : function () {

            var _inst           = this._editor.getInstance(),
                _selectionNode  = _inst.one( 'body' ).one( '.selection' ),
                _selectionColor = this.get( 'selectionColor' );

            if ( !_selectionNode ) {
                return;
            }

            _selectionNode.setStyle( 'backgroundColor', _selectionColor );
            _selectionNode.setStyle( 'display',         'inline-block'  );
        },

        _updateSelection : function () {

            var _host             = this.get( 'host' ),
                _inst             = this._editor.getInstance(),
                _body             = _inst.one( 'body'  ),
                _main             = _body.one( '.main' ),
                _selectionNode    = _main.one( '.selection' ),
                _selection        = Y.Bewype.Utils.getSelection( _host ),
                _range            = Y.Bewype.Utils.getRange( _selection ),
                _firstNode        = null,
                _lastNode         = null;

            // little check
            if ( !_selection.anchorNode || !_selection.focusNode ) {
                return this._clearSelection( _selection, _range );
            }                        

            // remove previous surrounding node
            if ( _selectionNode ) {
                _selectionNode.replace( this._getInnerHTML( _selectionNode ) );
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
                    _main.append( _selectionNode );
                    // set range surrounding node
                    _range.surroundContents( _main.one( '.selection' )._node );
                } catch ( err ) {
                    // Oops! clear all
                    return this._clearSelection( _selection, _range );
                }

                // can clear native selection now
                this._clearSelection( _selection, _range, false );

            } else {
                this._removeTag(_main, '.selection');
            }

            // update button status
            this._refreshButtons();

            // custom rendering
            this._refreshSelectionNode();
        },

        _onEditorChange : function ( e ) {
            //
            if ( e.changedEvent.type == 'dblclick' ) {

            } else if ( e.changedEvent.type == 'mouseup' ) {
                this._updateSelection();
            }
        },

        _getAncestor : function ( node ) {
            var _ancestor = node;

            Y.each( [ 'span', 'a', 'b', 'i', 'u' ], function ( v, k ) {
                var _anc = node.ancestor( 'v' );
                if ( _anc && _anc.get( 'textContent' ) === node.get( 'ancestor' ) ) {
                    _ancestor = _anc;
                }
            } );
            return _ancestor;
        },

        _resetSelection : function ( main ) {

            var _inst = this._editor.getInstance(),
                _body = _inst.one( 'body' ),
                _node = main ? _body.one( '.main' ) : _body.one( '.selection' );

            if ( !_node ) {
                return;
            }

            // find top node
            _node = this._getAncestor( _node );

            // do reset
            this._removeTag( _node, 'span' );
            this._removeTag( _node, 'b' );
            this._removeTag( _node, 'i' );
            this._removeTag( _node, 'u' );
        },

        _refreshButtons : function ( reset ) {

            var _inst          = this._editor.getInstance(),
                _selectionNode = _inst.one( 'body' ).one( '.selection' );

            if ( !_selectionNode ) {
                reset = true;
            }

            Y.Object.each( this.get( 'activeButtons' ) , function( v, k ) {

                var _value = null;

                switch( v ) {
                    case 'bold':
                        _value = reset ? false : ( _selectionNode && _selectionNode.one( 'b' ) !== null );
                        return this._buttonDict[ v ].setValue( _value );
                    case 'italic':
                        _value = reset ? false : ( _selectionNode && _selectionNode.one( 'i' ) !== null );
                        return this._buttonDict[ v ].setValue( _value );
                    case 'underline':
                        _value = reset ? false : ( _selectionNode && _selectionNode.one( 'u' ) !== null );
                        return this._buttonDict[ v ].setValue( _value );
                }

            }, this );
        },

        _onButtonEvent : function ( name, e ) {

            var _inst             = this._editor.getInstance(),
                _body             = _inst.one( 'body'  ),
                _main             = _body.one( '.main' ),
                _selectionNode    = _main.one( '.selection' ),
                _value            = this._buttonDict[ name ].getValue(),
                _tag              = null,
                _tagNode          = null,
                _newNode          = null;             

            if ( !_selectionNode ) {
                if ( this._cssButtons.indexOf( name ) != -1 ) {
                    return this._updateMainStyle( name );
                } else if ( name === 'reset') {
                    // reset main node
                    this._resetSelection( true );
                    // restore original values and quit
                    return Y.Bewype.Utils.setCssDict( _main, this._oMainCssdict );
                }
            }
            
            if ( _selectionNode ) {
                // get new tag
                _tag = this._getWorkingTagName( name );

                // do some cleaning
                this._removeTag( _selectionNode, _tag, name );

                if ( _value ) {

                    // create tag node
                    _tagNode = Y.Node.create( '<' + _tag + '></' + _tag + '>' );

                    // update with css property
                    if ( this._cssButtons.indexOf( name ) != -1 ) {
                        _tagNode.setStyle( Y.Bewype.Utils.camelize( name ), _value);
                        if ( name === 'background-color' ) {
                            _tagNode.setStyle( 'display', 'inline-block' );
                        }
                    }

                    // create surrounding node
                    _newNode = Y.Node.create( '<span class="selection"></span>' );
                    _newNode.append( _tagNode );
                    //
                    _newNode.one( _tag ).append( this._getInnerHTML( _selectionNode ) );

                    // update current selection
                    _selectionNode.replace(_newNode);

                } else if ( name === 'reset' ) {
                    
                    // do reset
                    this._resetSelection();

                    // refresh buttons
                    this._refreshButtons( true );
                }

                // custom rendering
                this._refreshSelectionNode();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.Editor = Editor;

