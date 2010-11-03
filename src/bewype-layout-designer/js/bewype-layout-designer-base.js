
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
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout"></div>';


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
            var _host     = this.get( 'host' ),
                _nodeSrc  = null,
                _nodePan  = null;

            // create source node
            _nodeSrc = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach src parent to widget
            _host.append( _nodeSrc );
            // plug source bar
            _nodeSrc.plug( Y.Bewype.LayoutDesignerSources, {
                layoutWidth : this.get( 'layoutWidth' )
            } );

            // create edit panel node
            _nodePan = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_PAN_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach src parent to widget
            _host.append( _nodePan );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_LAYOUT_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach layout node to main node
            _host.append( this.nodeLayout );
            //
            this.nodeLayout.setStyle( 'width', this.get( 'layoutWidth' ) );

            // plug target
            config.baseNode   = _host;
            config.targetType = 'start';
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, config );
        },

        /**
         *
         */
        destructor: function () { 
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerTarget );
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

