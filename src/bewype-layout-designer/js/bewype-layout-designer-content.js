
    /**
     *
     */
    var LayoutDesignerContent = function ( config ) {
        LayoutDesignerContent.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContent.C_TEXT_TEMPLATE =  '<div class="{designerClass}-content ';
    LayoutDesignerContent.C_TEXT_TEMPLATE += '{designerClass}-content-{contentType}">';
    LayoutDesignerContent.C_TEXT_TEMPLATE += '{defaultContent}</div>';

    /**
     *
     */
    LayoutDesignerContent.C_IMG_TEMPLATE =  '<div class="{designerClass}-content ';
    LayoutDesignerContent.C_IMG_TEMPLATE += '{designerClass}-content-{contentType}">';
    LayoutDesignerContent.C_IMG_TEMPLATE += '<img src="{defaultContent}" />';
    LayoutDesignerContent.C_IMG_TEMPLATE += '</div>';

    /**
     *
     */
    LayoutDesignerContent.NAME = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContent.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContent, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        initializer : function( config ) {
            // ??
            this.setAttrs( config );
            
            // temp var
            var _host          = this.get( 'host' ),
                _parentNode    = this.get( 'parentNode' ),
                _contentType   = this.get( 'contentType' ),
                _designerClass = this.get( 'designerClass' ),
                _contentNode   = _contentType === 'text' ? _host.one( 'div' ) : _host.one( 'img' ),
                _template      = _contentType === 'text' ? LayoutDesignerContent.C_TEXT_TEMPLATE : LayoutDesignerContent.C_IMG_TEMPLATE;

            if ( !_contentNode ) {
                // add dest node
                _contentNode = new Y.Node.create( Y.substitute( _template, {
                    designerClass  : _designerClass,
                    contentType    : _contentType,
                    defaultContent : _contentType === 'text' ?  this.get( 'defaultText' ) : this.get( 'defaultImg' )
                } ) ); // create content node
                // dom add
                _host.append( _contentNode );
                // common default height
                _contentNode.setStyle( 'height', this.get( 'contentHeight' ) );
                _contentNode.setStyle( 'width',  this.get( 'contentWidth'  ) );
                /* 
                if ( _contentType === 'image' ) {
                    _contentNode.one( 'img' ).setStyle( 'height', this.get( 'contentHeight' ) );
                    _contentNode.one( 'img' ).setStyle( 'width',  this.get( 'contentWidth'  ) );
                }
                */
            }

            // add clone
            this._addCloneNode();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host'          ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneNode       = _host.one( '.' + _contentClass + '-clone' );

            // and remove the clone
            if ( _cloneNode ) {
                // detach events
                _cloneNode.one( '.' + _contentClass + '-clone-edit'   ).detachAll( 'click' );
                _cloneNode.one( '.' + _contentClass + '-clone-remove' ).detachAll( 'click' );
                // remove clone node
                _cloneNode.remove();
            }
        },

        /**
         *
         */
        _detachEditor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _bNode           = this.get( 'baseNode'      ),
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _contentNode     = this.getContentNode(),
                _cloneNode       = this.getCloneNode();

            if ( _editPanNode && _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );
                _contentNode.unplug( _editorObj );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }
                
            // hide edit panel
            if ( _editPanNode ) {
                _editPanNode.setStyle( 'display', 'none' );
            }

            // show clone
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'display', 'block' );
            }

            // refresh clone
            this._refreshCloneNode();

            return true;
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _bNode           = this.get( 'baseNode'      ),
                _pNode           = this.get( 'parentNode'    ),
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _pl              = _pNode.layoutDesignerPlaces,
                _placesType      = _pl.get( 'placesType' ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _activeButtons   = this.get( 'contentType' ) === 'image' ? 'editorImageButtons' : 'editorTextButtons',
                _contentNode     = this.getContentNode(),
                _cloneNode       = this.getCloneNode(),
                _conf            = null,
                _maxWidth        = null,
                _pPn             = ( _placesType === 'vertical' ) ? _pl.get( 'parentNode' ) : null,
                _pPl             = _pPn ? _pPn.layoutDesignerPlaces : null;

            // hide sources and clone
            _cloneNode.setStyle(   'display', 'none'  );
            _editPanNode.setStyle( 'display', 'block' );

            // compute max width
            if (  _placesType === 'vertical' ) {
                _maxWidth =  _pNode.layoutDesignerPlaces.getMaxWidth();
                _maxWidth += _pPl ? _pPl.getAvailablePlace() : 0;
            } else {
                _maxWidth = _pNode.layoutDesignerPlaces.getAvailablePlace();
                _maxWidth += this.getContentWidth();
            }

            // update conf
            _conf = {
                panelNode       : _editPanNode,
                spinnerMaxWidth : _maxWidth,
                activeButtons   : this.get( _activeButtons ),
                fileStaticPath  : this.get( 'fileStaticPath' ),
                uploadUrl       : this.get( 'uploadUrl' )
            };

            // plug
            _contentNode.plug( _editorObj, _conf );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _contentNode );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _contentNode );
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _pNode    = this.get( 'parentNode' );
            
            // stop editing all
            Y.each( _pNode.layoutDesignerPlaces.getContents(), function( v, k ) {
                // update editing flag
                v.layoutDesignerContent._detachEditor();
            } );

            // attach
            this._attachEditor();
        },

        /**
         *
         */
        _onClickRemove : function ( evt ) {
            // temp var
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' );

            // call parent remove content
            _parentNode.layoutDesignerPlaces.removeContent( _host );
        },

        /**
         *
         */
        _addCloneNode : function () {
            
            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _cloneNode      = null,
                _dragNode       = null,
                _editNode       = null,
                _removeNode     = null;

            // create clone
            _cloneNode = _host.cloneNode( false );
            _cloneNode.set( 'innerHTML', '' );
            _cloneNode.set( 'className', _contentClass + '-clone');

            // add clone
            _host.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'z-index',  this.get( 'contentZIndex' ));
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'bottom',   0 );

            // add to clone
            _cloneNode.append( _callbacksNode );

            // add drag div
            _dragNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-drag" />' );
            // add to clone
            _callbacksNode.append( _dragNode );

            // add cb div
            _editNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-edit" />' );
            // add to clone
            _callbacksNode.append( _editNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickEdit, this ), _editNode );

            // add cb div
            _removeNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-remove" />' );
            // add to clone
            _callbacksNode.append( _removeNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );

            // refresh clone
            this._refreshCloneNode();
        },

        /**
         *
         */
        getContentHeight : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cHeight = Y.Bewype.Utils.getHeight( _contentNode ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingTop'    ) || 0,
                _pBottom = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingBottom' ) || 0;
            // return width
            return _cHeight + _pTop + _pBottom;

        },

        /**
         *
         */
        getContentWidth : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cWidth      = Y.Bewype.Utils.getWidth( _contentNode ),
                _pRight      = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingRight' ) || 0,
                _pLeft       = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingLeft'  ) || 0;
            // return width
            return _cWidth + _pLeft + _pRight;
        },

        /**
         *
         */
        getContentNode : function () {
            // ...
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content';
            // ...
            return _host.one( 'div.' + _contentClass );
        },

        /**
         *
         */
        getCloneNode : function () {
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneSelector   = 'div.' + _contentClass + '-clone';

            return _host.one( _cloneSelector );
        },

        /**
         *
         */
        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _cloneNode      = this.getCloneNode(),
                _h              = this.getContentHeight(),
                _w              = forcedWidth || this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h - 2 );
                _cloneNode.setStyle( 'width',  _w - 2 );
            }
        },

        /**
         *
         */
        refresh : function ( forcedWidth ) {

            // temp var
            var _parentNode  = this.get( 'parentNode' ),
                _contentNode = forcedWidth ? this.getContentNode() : null;

            // force node width
            if ( _contentNode ) {
                _contentNode.setStyle( 'width',  forcedWidth );
                _contentNode.setStyle( 'paddingLeft',  0 );
                _contentNode.setStyle( 'paddingRight', 0 );
            }

            // refresh clone
            this._refreshCloneNode( forcedWidth );

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;

