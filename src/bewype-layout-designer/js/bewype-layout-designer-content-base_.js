
    /**
     *
     */
    var LayoutDesignerContentBase = function ( config ) {
        LayoutDesignerContentBase.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentBase.C_TEMPLATE = '<div class="{designerClass}-content">{defaultContent}</div>';

    /**
     *
     */
    LayoutDesignerContentBase.NAME       = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContentBase.NS         = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContentBase.ATTRS = {
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
            value : 40,
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
        baseNode : {
            value : null,
            writeOnce : true
        },
        parentNode : {
            value : null
        }
    };

    Y.extend( LayoutDesignerContentBase, Y.Plugin.Base, {

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
            _contentNode = new Y.Node.create( Y.substitute( LayoutDesignerContentBase.C_TEMPLATE, {
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
        },

        /**
         *
         */
        _attachEditor : function () {
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
    Y.Bewype.LayoutDesignerContentBase = LayoutDesignerContentBase;
