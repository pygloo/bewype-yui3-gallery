YUI.add('bewype-layout-designer-base', function(Y) {


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
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout {designerClass}-places"></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    Y.extend( LayoutDesigner, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        initializer: function( config ) {

            // ??
            this.setAttrs( config );

            // tmp vars
            var _host          = this.get( 'host' ),
                _nodeSrc       = null,
                _nodePan       = null,
                _designerClass = this.get( 'designerClass' ),
                _layoutWidth   = this.get( 'layoutWidth' );

            // create source node
            _nodeSrc = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( _nodeSrc );
            // plug source bar
            _nodeSrc.plug( Y.Bewype.LayoutDesignerSources, config );

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

            config.baseNode   = _host;
            config.targetType = this.get( 'startingTargetType' );
            // plug places
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerPlaces, config );
            // plug target
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, config );

            // refresh at start
            this.nodeLayout.layoutDesignerTarget.refresh();

            // ... 
            // Y.DD.DDM.on( 'drop:enter', Y.bind( this._dropHitGotcha, this ) ); // need some cleaning and enhancement ....
            Y.DD.DDM.on( 'drop:hit', Y.bind( this._dropHitGotcha, this ) );
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
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerTarget );

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
        _dropHitGotcha : function ( evt ) {
            //
            var _dragNode       = evt.drag.get( 'node' ),
                _dragTagName    = _dragNode.get( 'tagName' ).toLowerCase(),
                _placesClass    = '.' + this.get( 'designerClass' ) + '-places',
                _containerClass = '.' + this.get( 'designerClass' ) + '-container',
                _destNode       = _dragNode.one( _containerClass ),
                _contentNode    = _dragNode.one( _placesClass ) ? _destNode : _dragNode.one( _containerClass ),
                _parentHost     = null,
                _dropTagName    = _dragTagName === 'li' ? 'ul' : 'table',
                _dropSortNode   = _destNode ? _destNode.ancestor( _dropTagName ) : null,
                _dropNode       = _dropSortNode ? _dropSortNode.ancestor( 'div' ) : null,
                _forceWidth     = null;

            if ( !_contentNode || !_dropNode.layoutDesignerPlaces ) {
                return;
            } else if ( _contentNode.layoutDesignerContent ) {
                _parentHost = _contentNode.layoutDesignerContent.get( 'parentNode' );
            } else if ( _contentNode.layoutDesignerPlaces  ) {
                _parentHost = _contentNode.layoutDesignerPlaces.get( 'parentNode' );
            } else {
                return;
            }

            if ( _parentHost != _dropNode ) {

                // and register it
                _parentHost.layoutDesignerPlaces.unRegisterContent( _contentNode );
                _dropNode.layoutDesignerPlaces.registerContent( _contentNode );

                // udpate parent node propertie
                _contentNode.layoutDesignerContent.set( 'parentNode', _dropNode );

                // refresh new parent
                _forceWidth  = _dropNode.layoutDesignerPlaces.getMaxWidth();
                _dropNode.layoutDesignerTarget.refresh( _forceWidth );
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



}, '@VERSION@' ,{requires:['bewype-layout-designer-sources', 'bewype-layout-designer-target']});
