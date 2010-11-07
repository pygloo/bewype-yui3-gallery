YUI.add('bewype-layout-designer-content-base', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentBase = function ( config ) {
        LayoutDesignerContentBase.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentBase.NAME = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContentBase.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContentBase, Y.Bewype.LayoutDesignerConfig, {

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
        _init: function ( template ) {
            
            // temp var
            var _host        = this.get( 'host' ),
                _parentNode  = this.get( 'parentNode' ),
                _contentNode = null;

            // add dest node
            _contentNode = new Y.Node.create( Y.substitute( template, {
                designerClass : this.get( 'designerClass' ),
                contentType   : this.get( 'contentType' )
            } ) ); // create content node
            // dom add
            _host.append( _contentNode );
        
            // common default height
            _contentNode.setStyle( 'height', this.get( 'contentHeight' ) );
            _contentNode.setStyle( 'width',  this.get( 'contentWidth'  ) );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ) , _host );
                    
            // register it
            _parentNode.layoutDesignerPlaces.registerContent( _host );

            //
            this._q = new Y.AsyncQueue();

            // return the new content node
            return _contentNode;
        },

        /**
         *
         */
        initializer : function( config ) {
            // ??
            this.setAttrs( config );
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host'          ),
                _parentNode      = this.get( 'parentNode'    ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _contentSelector = this.get( 'contentType' ) === 'image' ? 'img.' : 'div.',
                _contentNode     = _host.one( _contentSelector + _contentClass ),
                _cloneNode       = _host.one( 'div.' + _contentClass + '-clone' );
            
            // detach editor
            this._detachEditor();
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            Y.detach( _host );

            // and remove the clone
            if ( _cloneNode ) {
                // clean events
                Y.Event.purgeElement( _cloneNode, true );
                // remove
                _cloneNode.remove();
            }

            // replace host
            _host.replace( _contentNode );
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
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _contentNode     = this.getContentNode();

            // set editing flag to false
            this.editing = false;

            if ( _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );
                _contentNode.unplug( _editorObj );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }
                
            // show sources
            _editPanNode.setStyle( 'display', 'none'  );
            _sourcesNode.setStyle( 'display', 'block' );

            // refresh clone
            this._refreshCloneNode();

            return true;
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
                _contentNode     = this.getContentNode(),
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
            _contentNode.plug( _editorObj, _conf );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _contentNode );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _contentNode );

            // set editing flag to false
            this.editing = true;
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
        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            if ( !cloneNode ) {
                // temp var
                var _host           = this.get( 'host'          ),
                    _contentClass   = this.get( 'designerClass' ) + '-content';
                // get existing clone
                cloneNode = _host.one( 'div.' + _contentClass + '-clone' );
            }

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
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _cloneNode      = null,
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
        _onMouseEnter : function ( evt ) {
            
            // do nothing when editing
            if ( this.editing ) { return; }

            // temp var
            var _host         = this.get( 'host'          ),
                _parentNode   = this.get( 'parentNode'    ),
                _contentClass = this.get( 'designerClass' ) + '-content',
                _cloneNode    = _host.one( 'div.' + _contentClass + '-clone' ); // get existing clone

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
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _contentSelector = this.get( 'contentType' ) === 'image' ? 'img.' : 'div.';

            return _host.one( _contentSelector + _contentClass );
        },

        /**
         *
         */
        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _cloneNode      = _host.one( 'div.' + _contentClass + '-clone' ),
                _h              = this.getContentHeight(),
                _w              = forcedWidth || this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h );
                _cloneNode.setStyle( 'width',  _w );
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
    Y.Bewype.LayoutDesignerContentBase = LayoutDesignerContentBase;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute']});
