YUI.add('bewype-layout-designer-content-text', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentText = function ( config ) {
        LayoutDesignerContentText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentText.NAME  = 'layout-designer-content-text';

    /**
     *
     */
    LayoutDesignerContentText.NS    = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContentText.ATTRS = {
        contentType : {
            value : 'text',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultContent : {
            value : 'Text..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( LayoutDesignerContentText, Y.Bewype.LayoutDesignerContentBase, {

        /**
         *
         */
        _q : null,

        /**
         *
         */
        editing : false,

        /**
         *
         */
        initializer : function( config ) {

            // init content  node and plugin content base
            var _contentNode = this._init( config );

            // set default content
            _contentNode.set( 'innerHTML', config.defaultContent );
        },

        /**
         *
         */
        _detachEditor : function () {

            // temp var
            var _host           = this.get( 'host' ),
                _bNode          = this.get( 'baseNode'      ),
                _sourcesClass   = this.get( 'designerClass' ) + '-sources',
                _editPanClass   = this.get( 'designerClass' ) + '-edit-panel',
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _sourcesNode    = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode    = _bNode.one( 'div.' + _editPanClass ),
                _contentNode    = _host.one(  'div.' + _contentClass );                

            // detach events
            _host.detachAll( 'bewype-editor:onClose'  );
            _host.detachAll( 'bewype-editor:onChange' );

            // set editing flag to false
            this.editing = false;

            // just in case
            this.refresh();

            if ( _contentNode.bewypeEditor ) {

                // diconnect
                _contentNode.unplug( Y.Bewype.Editor );
            }
                
            // show sources
            _editPanNode.setStyle( 'display', 'none'  );
            _sourcesNode.setStyle( 'display', 'block' );
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _host           = this.get( 'host'          ),
                _bNode          = this.get( 'baseNode'      ),
                _pNode          = this.get( 'parentNode'    ),
                _sourcesClass   = this.get( 'designerClass' ) + '-sources',
                _editPanClass   = this.get( 'designerClass' ) + '-edit-panel',
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _sourcesNode    = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode    = _bNode.one( 'div.' + _editPanClass ),
                _availableWidth = _pNode.layoutDesignerPlaces.getAvailablePlace(),
                _contentNode    = _host.one( 'div.' + _contentClass ),
                _conf           = null,
                _maxWidth       = null;

            // hide sources
            _sourcesNode.setStyle( 'display', 'none'  );
            _editPanNode.setStyle( 'display', 'block' );

            // set max width or not
            if ( _availableWidth ) {

                // compute max width
                _maxWidth =  _availableWidth;
                _maxWidth += this.getContentWidth();

                // update conf
                _conf = {
                    panelNode       : _editPanNode,
                    spinnerMaxWidth : _maxWidth
                    };

            } else {

                // no max
                _conf = { panelNode : _editPanNode };
            }

            // plug
            _contentNode.plug( Y.Bewype.Editor, _conf );

            // set editing flag to false
            this.editing = true;
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _contentNode );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _contentNode );
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentText = LayoutDesignerContentText;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
