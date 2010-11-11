
    /**
     *
     */
    var LayoutDesigner = function ( config ) {
        LayoutDesigner.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesigner.NODE_SRC_TEMPLATE = '<div class="{designerClass}-sources"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_PAN_TEMPLATE = '<div class="{designerClass}-edit-panel"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout"><ul /></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    Y.extend( LayoutDesigner, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        nodeSource : null,

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        _dropHitGotcha : function ( evt ) {
            //
            var _host           = this.get( 'host' ),
                _dragNode       = evt.target.get( 'node' ), 
                _designerClass  = this.get( 'designerClass' ),
                _contentClass   = '.' + _designerClass + '-content',
                _srcClass       = '.' + _designerClass + '-src',
                _contentNode    = _dragNode.one( _contentClass ) || _dragNode.one( _srcClass ),
                _contentTag     = _contentNode.get( 'tagName' ).toLowerCase(),
                _dropNode       = _dragNode.ancestor( 'ul' ),
                _parentHost     = null,
                _config         = null,
                _forceWidth     = null,
                _cellWidth      = null,
                _ulNode         = null;

            if ( !_dropNode.layoutDesignerPlaces ) {
                return;
            } else if ( _contentNode.layoutDesignerContent ) {
                _parentHost = _contentNode.layoutDesignerContent.get( 'parentNode' );
            } else if ( _contentNode.layoutDesignerPlaces  ) {
                _parentHost = _contentNode.layoutDesignerPlaces.get( 'parentNode' );
            } else {
                // prepare config
                _config = this.getAttrs();
                _config.baseNode = _host;
                _config.parentNode = _host;
                // restaure source
                if ( _contentTag === 'div' ) {
                    // plug it
                    _config.contentType = 'text';
                    _contentNode.plug( Y.Bewype.LayoutDesignerContent, _config );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addTextSource();
                } else if ( _contentTag === 'img' ) {
                    // plug it
                    _config.contentType = 'image';
                    _contentNode.plug( Y.Bewype.LayoutDesignerContent, _config );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addImageSource();
                } else if ( _contentTag === 'table' ) {
                    // create ul on fly to avoid conflict
                    _ulNode = Y.Node.create( '<ul/>' );
                    _contentNode.all( 'td' ).each( function( v, k ) {
                        // prepare config
                        var _config = this.getAttrs(),
                            _clone  = v.one( 'div' ).cloneNode( true ),
                            _li     = Y.Node.create( '<li />' );
                        // update li
                        _li.append( _clone );
                        // update ul
                        _ulNode.append( _li );
                    }, this );
                    // replace table by ul
                    _contentNode.replace( _ulNode );
                    // plug it
                    _config.placesType = this.get( 'startingType' ) === 'horizontal' ? 'vertical' : 'horizontal';
                    _contentNode.plug( Y.Bewype.LayoutDesignerPlaces, _config );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addRowSource();
                } else {
                    return; // ??
                }
            }

            if ( _parentHost != _dropNode ) {

                // unregister
                if ( _parentHost ) {
                    _parentHost.layoutDesignerPlaces.unRegisterContent( _contentNode );
                }
                // register
                _dropNode.layoutDesignerPlaces.registerContent( _contentNode );

                // update parent node propertie
                if ( _contentNode.layoutDesignerContent ) {
                    _contentNode.layoutDesignerContent.set( 'parentNode', _dropNode );
                } else {
                    _contentNode.layoutDesignerPlaces.set( 'parentNode', _dropNode );
                }

                // refresh new parent
                _forceWidth = _dropNode.layoutDesignerPlaces.getMaxWidth();
                _cellWidth  = _dropNode.layoutDesignerPlaces.refresh( _forceWidth );

                // start width max width
                if ( _contentNode.layoutDesignerContent ) {
                    _contentNode.layoutDesignerContent.get( 'host' ).setStyle( 'width', _cellWidth);
                }
            }
        },

        /**
         *
         */
        initializer: function( config ) {

            // ??
            this.setAttrs( config );

            // tmp vars
            var _host          = this.get( 'host' ),
                _nodePan       = null,
                _designerClass = this.get( 'designerClass' ),
                _layoutWidth   = this.get( 'layoutWidth' );

            // update config for children
            config.baseNode   = _host;
            config.placesType = this.get( 'startingType' );

            // create source node
            this.nodeSource = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( this.nodeSource );
            // plug source bar
            this.nodeSource.plug( Y.Bewype.LayoutDesignerSources, config );

            // create edit panel node
            _nodePan = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_PAN_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( _nodePan );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_LAYOUT_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach layout node to main node
            _host.append( this.nodeLayout );
            //
            this.nodeLayout.setStyle( 'width', _layoutWidth );

            // plug places
            this.nodeLayout.one( 'ul' ).plug( Y.Bewype.LayoutDesignerPlaces, config );

            // refresh at start
            this.nodeLayout.one( 'ul' ).layoutDesignerPlaces.refresh();

            // ... 
            Y.DD.DDM.on( 'drag:end', Y.bind( this._dropHitGotcha, this ) );
        },

        /**
         *
         */
        destructor: function () { 

            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _srcNode       = _host.one( '.' + _designerClass + '-sources' ),
                _panNode       = _host.one( '.' + _designerClass + '-edit-panel' ),
                _tableOrUl     = this.nodeLayout.one( 'table' ) || this.nodeLayout.one( 'ul' );

            // remove our designer specific nodes
            _srcNode.remove();
            _panNode.remove();

            // unplug all
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerPlaces );

            // move layout table to top
            if ( _tableOrUl ) {
                this.nodeLayout.replace( _tableOrUl );
            } else {
                this.nodeLayout.remove();
            }
        },

        /**
         *
         */
        getContents : function () {
            if (this.nodeLayout.layoutDesignerPlaces) {
                return this.nodeLayout.layoutDesignerPlaces.getContents();
            } else {
                return [];
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesigner = LayoutDesigner;

