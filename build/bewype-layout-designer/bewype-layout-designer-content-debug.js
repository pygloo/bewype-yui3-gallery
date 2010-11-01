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
    LayoutDesignerContent.C_TEMPLATE = '<div class="{designerClass}-content">{defaultContent}</div>';

    /**
     *
     */
    LayoutDesignerContent.NAME       = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContent.NS         = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContent.ATTRS = {
        designerClass : {
            value : 'layout-designer',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        contentHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentWidth : {
            value : 140,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentZIndex : {
            value : 1,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        defaultContent : {
            value : 'Text..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        baseNode : {
            value : null,
            writeOnce : true
        },
        parentNode : {
            value : null
        }
    };

    Y.extend( LayoutDesignerContent, Y.Plugin.Base, {

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
            
            // temp var
            var _host        = this.get( 'host'       ),
                _parentNode  = this.get( 'parentNode' ),
                _contentNode = null;

            // add dest node
            _contentNode = new Y.Node.create( Y.substitute( LayoutDesignerContent.C_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) ); // create content node
            // dom add
            _host.append( _contentNode );
        
            // common default height
            _contentNode.setStyle( 'height', this.get( 'contentHeight' ) );
            _contentNode.setStyle( 'width',  this.get( 'contentWidth'  ) );

            // set default content
            _contentNode.set( 'innerHTML', this.get( 'defaultContent' ) );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ) , _host );
                    
            // register it
            _parentNode.layoutDesignerPlaces.registerContent( _host );

            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host           = this.get( 'host'          ),
                _parentNode     = this.get( 'parentNode'    ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _contentNode    = _host.one( 'div.' + _contentClass ),
                _contentNode    = _host.one( 'div.' + _contentClass + '-clone' );
            
            // detach editor
            this._detachEditor();
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            Y.detach( _host );

            // and remove the clone
            if ( _contentNode ) {
                // clean events
                Y.Event.purgeElement( _contentNode, true );
                // remove
                _contentNode.remove();
            }

            // remove host
            _host.remove();
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
                _contentNode    = _host.one( 'div.' + _contentClass );                

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
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _pNode         = this.get( 'parentNode' );
            
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
            var _host           = this.get( 'host'          ),
                _parentNode     = this.get( 'parentNode'    ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _contentNode    = _host.one( 'div.' + _contentClass + '-clone' ); // get existing clone

            // clean first
            _parentNode.layoutDesignerPlaces.cleanContentOver();

            if ( _contentNode ) {
                // set children visible
                Y.each( _contentNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'visible' );
                } );
                //
                _contentNode.setStyle( 'visibility', 'visible' );
            } else {
                _contentNode = this._addCloneNode();
            }

            // stop first
            this._q.stop();
            // add clean cb
            this._q.add(
                    { fn: function () {}, timeout: 1000 },
                    { fn: this.hideClone, args: [ _contentNode ] } );
            // restart
            this._q.run();
        },

        getContentHeight : function () {
            // temp var
            var _host           = this.get( 'host' ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _contentNode    = _host.one( 'div.' + _contentClass ),
                _cHeight = Y.Bewype.Utils.getHeight( _contentNode ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingTop' ) || 0;
            // return width
            return _cHeight + _pTop;

        },

        getContentWidth : function () {
            // temp var
            var _host           = this.get( 'host' ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _contentNode    = _host.one( 'div.' + _contentClass ),
                _cWidth = Y.Bewype.Utils.getWidth( _contentNode ),
                _pLeft  = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingLeft' ) || 0;
            // return width
            return _cWidth + _pLeft;
        },

        _refreshCloneNode : function () {

            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _cloneNode      = _host.one( 'div.' + _contentClass + '-clone' ),
                _h              = this.getContentHeight(),
                _w              = this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h );
                _cloneNode.setStyle( 'width',  _w );
            }
        },

        refresh : function () {

            // refresh clone
            this._refreshCloneNode();

            // temp var
            var _parentNode = this.get( 'parentNode' );

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute', 'bewype-editor']});
