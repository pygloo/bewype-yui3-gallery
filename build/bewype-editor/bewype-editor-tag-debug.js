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
                _cssDict     = null,
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
                        _cssDict = Y.Bewype.Utils.getCssDict( _host );
                        // remove previous height and width
                        delete( _cssDict.height );
                        delete( _cssDict.width );
                        // apply cleared dict
                        Y.Bewype.Utils.setCssDict( _host, _cssDict );

                        // clear previous                        
                        // _host.setStyle( 'height', 'auto' );
                        // _host.setStyle( 'width',  'auto' );

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
