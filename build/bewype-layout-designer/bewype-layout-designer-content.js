YUI.add('bewype-layout-designer-content', function(Y) {


    /**
     *
     */
    var LayoutDesignerContent = function ( config ) {
        LayoutDesignerContent.superclass.constructor.apply( this, arguments );
    };

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
        _q : null,

        /**
         *
         */
        editing : false,

        /**
         *
         */
        initializer : function( config ) {

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _contentType   = this.get( 'contentType' );

            // remove source classes
            _host.removeClass( _designerClass + '-src' );

            // add content classes
            _host.addClass( _designerClass + '-content' );
            _host.addClass( _designerClass + '-content-' +  _contentType );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ), _host );

            // init async queue
            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _parentNode      = this.get( 'parentNode' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneNode       = this.getCloneNode();
            
            // detach editor
            if ( this.editing === true ) {
                this._detachEditor();
            }
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            _host.detachAll( 'mouseenter' );

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
        getCloneNode : function () {
            var _host         = this.get( 'host' ),
                _div          = _host.ancestor( 'div' ),
                _contentClass = this.get( 'designerClass' ) + '-content';

            return _div.one( 'div.' + _contentClass + '-clone' );
        },

        /**
         *
         */
        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            cloneNode = cloneNode || this.getCloneNode();

            // re-check
            if ( cloneNode ) {
                // set children visible
                Y.each( cloneNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'hidden' );
                } );
                // hide the clone
                cloneNode.setStyle( 'visibility', 'hidden' );
            }
        },

        /**
         *
         */
        _addCloneNode : function () {
            
            // temp var
            var _host           = this.get( 'host' ),
                _div            = _host.ancestor( 'div' ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _cloneNode      = new Y.Node.create( '<div class="' + _contentClass + '-clone" />' ),
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _editNode       = null,
                _removeNode     = null;

            // add clone
            _div.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'bottom',   0 );
            _cloneNode.setStyle( 'left',     1 );
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'z-index',  this.get( 'contentZIndex' ));

            // add to clone
            _cloneNode.append( _callbacksNode );

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

            //
            return _cloneNode;
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _host            = this.get( 'host'          ),
                _bNode           = this.get( 'baseNode'      ),
                _pNode           = this.get( 'parentNode'    ),
                _sourcesClass    = this.get( 'designerClass' ) + '-sources',
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _sourcesNode     = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _pl              = _pNode.layoutDesignerPlaces,
                _placesType      = _pl.get( 'placesType' ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _activeButtons   = this.get( 'contentType' ) === 'image' ? 'editorImageButtons' : 'editorTextButtons',
                _conf            = null,
                _maxWidth        = null,
                _pPn             = ( _placesType === 'vertical' ) ? _pl.get( 'parentNode' ) : null,
                _pPl             = _pPn ? _pPn.layoutDesignerPlaces : null;

            // hide sources
            _sourcesNode.setStyle( 'display', 'none'  );
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
                activeButtons   : this.get( _activeButtons )
            };

            // plug
            _host.plug( _editorObj, _conf );
            // _host.ancestor( 'li' ).setStyle( 'border-width', '0' );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _host );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _host );

            // set editing flag to false
            this.editing = true;
        },

        /**
         *
         */
        _detachEditor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _bNode           = this.get( 'baseNode'      ),
                _sourcesClass    = this.get( 'designerClass' ) + '-sources',
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _sourcesNode     = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText;

            // set editing flag to false
            this.editing = false;

            if ( _editPanNode && _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );
                _host.unplug( _editorObj );
                // _host.ancestor( 'li' ).setStyle( 'border-width', '1px' );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }
                
            // show sources
            if ( _editPanNode ) {
                _editPanNode.setStyle( 'display', 'none'  );
            }

            if ( _sourcesNode ) {
                _sourcesNode.setStyle( 'display', 'block' );
            }                

            // refresh clone
            this._refreshCloneNode();

            return true;
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
        _onMouseEnter : function ( evt ) {
            
            // do nothing when editing
            if ( this.editing ) { return; }

            // temp var
            var _parentNode   = this.get( 'parentNode' ),
                _cloneNode    = this.getCloneNode();

            // clean first
            _parentNode.layoutDesignerPlaces.cleanContentOver();

            if ( _cloneNode ) {
                // set children visible
                Y.each( _cloneNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'visible' );
                } );
                //
                _cloneNode.setStyle( 'visibility', 'visible' );
            } else {
                _cloneNode = this._addCloneNode();
            }

            // stop first
            this._q.stop();
            // add clean cb
            this._q.add(
                    { fn: function () {}, timeout: 1000 },
                    { fn: this.hideClone, args: [ _cloneNode ] } );
            // restart
            this._q.run();
        },

        /**
         *
         */
        getContentHeight : function () {
            // temp var
            var _host    = this.get( 'host' ),
                _cHeight = Y.Bewype.Utils.getHeight( _host ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _host, 'paddingTop'    ) || 0,
                _pBottom = Y.Bewype.Utils.getStyleValue( _host, 'paddingBottom' ) || 0;
            // return width
            return _cHeight + _pTop + _pBottom + 2;

        },

        /**
         *
         */
        getContentWidth : function () {
            // temp var
            var _host   = this.get( 'host' ),
                _cWidth = Y.Bewype.Utils.getWidth( _host ),
                _pRight = Y.Bewype.Utils.getStyleValue( _host, 'paddingRight' ) || 0,
                _pLeft  = Y.Bewype.Utils.getStyleValue( _host, 'paddingLeft'  ) || 0;
            // return width
            return _cWidth + _pLeft + _pRight + 2;
        },

        /**
         *
         */
        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _cloneNode    = this.getCloneNode(),
                _h            = this.getContentHeight(),
                _w            = forcedWidth || this.getContentWidth();
            
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
            var _parentNode   = this.get( 'parentNode' ),
                _host         = this.get( 'host'       ),
                _contentWidth = null;

            // force node width
            if ( forcedWidth ) {

                // prepare content width
                _contentWidth = this.getContentWidth();
                _contentWidth = _contentWidth > forcedWidth ? forcedWidth : _contentWidth;

                _host.setStyle( 'width',  _contentWidth );
                _host.setStyle( 'paddingLeft',  0 );
                _host.setStyle( 'paddingRight', 0 );
            }

            // refresh clone
            this._refreshCloneNode( forcedWidth );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute', 'bewype-layout-designer-config', 'bewype-editor']});
