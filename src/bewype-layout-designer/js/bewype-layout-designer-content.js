
    /**
     *
     */
    var LayoutDesignerContent = function ( config ) {
        LayoutDesignerContent.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerContent.NAME  = 'layout-designer-content';

    LayoutDesignerContent.NS    = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContent.ATTRS = {
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
        contentClass : {
            value : 'content',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultContent : {
            value : 'Click to change your content..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultStyle : {
            value : null
        },
        parentNode : {
            value : null
        },
        removeCallback : {
            value : null
        },
        editCallback : {
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
        initializer : function( config ) {
            
            // temp var
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' );
        
            // common default height
            _host.setStyle( 'height', this.get( 'contentHeight' ) );
            _host.setStyle( 'width',  this.get( 'contentWidth'  ) );

            // set default content
            _host.set( 'innerHTML', this.get( 'defaultContent' ) );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ) , _host );
                    
            // register it
            _parentNode.layoutDesignerPlaces.registerContent(_host);

            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ), // get parent
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' ); // get existing clone
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            Y.detach( _host );

            // and remove the clone
            if ( _clone ) {
                // clean events
                Y.Event.purgeElement( _clone, true );
                // remove
                _clone.remove();
            }

            // remove host
            _host.remove();
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _editCallback   = this.get( 'editCallback'   );
            
            // do call
            if ( _editCallback ) {
                _editCallback( this.get( 'host' ) );
            }
        },

        /**
         *
         */
        _onClickRemove : function ( evt ) {

            // get callback
            var _removeCallback = this.get( 'removeCallback' );

            // do call
            if ( _removeCallback ) {
                _removeCallback( this.get( 'host' ) );
            }
        },

        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            if ( !cloneNode ) {
                // temp var
                var _host           = this.get( 'host'         ),
                    _contentClass   = this.get( 'contentClass' ),
                    _parentDiv      = _host.ancestor( 'div' );
                // get existing clone
                cloneNode = _parentDiv.one( 'div.' + _contentClass + '-clone' );
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

        _addCloneNode : function ( parentDiv ) {
            
            // temp var
            var _host           = this.get( 'host'           ),
                _contentClass   = this.get( 'contentClass'   ),
                _editCallback   = this.get( 'editCallback'   ),
                _removeCallback = this.get( 'removeCallback' ),
                _callbacksNode  = new Y.Node.create('<div class="' + _contentClass + '-clone-callbacks" />' ),
                _editNode       = null,
                _removeNode     = null;

            // create clone
            _cloneNode = _host.cloneNode( false );
            _cloneNode.set( 'innerHTML', '' );
            _cloneNode.set( 'className', _contentClass + '-clone');

            // add clone
            parentDiv.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'z-index',  this.get( 'contentZIndex' ));
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'bottom',   0 );

            // add to clone
            _cloneNode.append( _callbacksNode );

            // add edit div
            if ( _editCallback ) {
                // add cb div
                _editNode = new Y.Node.create(
                        '<div class="' + _contentClass + '-clone-edit" />' );
                // add to clone
                _callbacksNode.append( _editNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickEdit, this ), _editNode );
            }

            // add remove div
            if ( _removeCallback ) { 
                // add cb div
                _removeNode = new Y.Node.create(
                        '<div class="' + _contentClass + '-clone-remove" />' );
                // add to clone
                _callbacksNode.append( _removeNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );
            }

            //
            return _cloneNode;
        },

        /**
         *
         */
        _onMouseEnter : function ( evt ) {
            
            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ),
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' ); // get existing clone

            // clean first
            _parentNode.layoutDesignerPlaces.cleanContentOver();

            if ( _clone ) {
                // set children visible
                Y.each( _clone.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'visible' );
                } );
                //
                _clone.setStyle( 'visibility', 'visible' );
            } else {
                _clone = this._addCloneNode( _parentDiv );
            }

            // stop first
            this._q.stop();
            // add clean cb
            this._q.add(
                    { fn: function () {},       timeout: 1000 },
                    { fn: this.hideClone, args: [ _clone ] } );
            // restart
            this._q.run();
        },

        /**
         *
         */
        _getHeight : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int height
            return parseInt( node.getComputedStyle( 'height' )
                    || node.getAttribute( 'height' ), default_ );
        },

        /**
         *
         */
        _getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int width
            return parseInt( node.getComputedStyle( 'width' )
                    || node.getAttribute( 'width' ), default_ );
        },

        getContentHeight : function () {
            
            // temp var
            var _host = this.get( 'host' );

            // return width
            return this._getHeight( _host );
        },

        getContentWidth : function () {
            
            // temp var
            var _host = this.get( 'host' );

            // return width
            return this._getWidth( _host );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;

