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
