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
                content : _innerHTML
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
            this._oMainCssdict.height  = '100%';
            this._oMainCssdict.width   = '100%';
            this._oMainCssdict.padding = '0';
            this._oMainCssdict.margin  = '0';

            Y.each( [ 'iframe', 'html', 'body' ] , function ( v, k ) {
                // ensure nice rendering
                var _t = _host.one( v ) || _inst.one( v );
                _t.setStyle( 'cssText', 'padding: 0px; margin: 0px; height: 100%; width: 100%;');
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
                _inst      = this._editor.getInstance(),
                _body      = _inst.one( 'body' ),
                _window    = Y.Bewype.Utils.getWindow( _host ),
                _document  = Y.Bewype.Utils.getDocument( _host ),
                _selection = null, 
                _range     = null;
            
            if ( _window._node.getSelection ) { // Firefox, Google Chrome, Safari, Opera
                // ...
                _selection = _window._node.getSelection();
                // ...
                if (_selection.rangeCount > 0) {
                    _range = _selection.getRangeAt (0);
                    //
                    _body.append( node );
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
                _selectionNode = _body.one( '.selection' ),
                _button        = this._panel.getButton( name ),
                _value         = _button ? _button.getValue() : null,
                _img           = null,
                _tag           = null,
                _tagNode       = null,
                _newNode       = null;

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
                if ( _tag && _value && ( _value === true || _value.trim() !== '' ) ) {
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
