
    /**
     *
     */
    var LayoutDesignerSources = function ( config ) {
        LayoutDesignerSources.superclass.constructor.apply( this, arguments );
    };
  
    LayoutDesignerSources.NAME  = 'layout-designer-sources';

    LayoutDesignerSources.NS    = 'layoutDesignerSources';

    /**
     *
     */
    LayoutDesignerSources.ITEM_SRC_TEMPLATE = '<div class="{designerClass}-src {designerClass}-src-{itemType}">{itemLabel}</div>';

    Y.extend( LayoutDesignerSources, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        initializer: function( config ) {

            // ??
            this.setAttrs( config );

            // create table for sources and attach it
            var _host     = this.get( 'host' ),
                _groups   = this.get( 'sourceGroups' ),
                _labels   = this.get( 'sourceLabels' ),
                _tableSrc = new Y.Node.create( '<table><tr /></table>' );

            //
            _host.append( _tableSrc );

            // add sources
            Y.Object.each(_groups, function( v, k ) {
                var _n      = null,
                    _td     = null,
                    _drag   = null;

                // create source components & attach
                _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.ITEM_SRC_TEMPLATE, {
                    itemType      : v,
                    designerClass : this.get( 'designerClass' ),
                    itemLabel     : _labels[ k ]
                } ) );

                // prepare td for the source item
                _td = new Y.Node.create( "<td />" );
                _td.append( _n );
                // udpate source row
                _tableSrc.append( _td );
        
                // common default height
                _n.setStyle( 'height', this.get( 'sourceHeight' ) );
                _n.setStyle( 'width' , this.get( 'sourceWidth'  ) );

                // make it draggable
                _drag = new Y.DD.Drag( {
                    node    : _n,
                    groups  : [ v ],
                    dragMode: 'point'
                } );
                // additionnal drag features
                _drag.plug( Y.Plugin.DDProxy, {
                    moveOnEnd : false
                } );
                _drag.plug( Y.Plugin.DDConstrained, {
                    constrain2node  : [ _host, _host.next() ]
                } );
                // set drag events
                _drag.on( 'drag:start', Y.bind( this._onDragStart, this, _drag ) );
                _drag.on( 'drag:end'  , Y.bind( this._onDragEnd  , this, _drag ) );

            }, this );
        },

        destructor: function () {
        },

        /**
         *
         */
        _onDragStart : function ( drag, evt ) {
            //
            var _node = drag.get( 'node' ),
                _dragNode = drag.get( 'dragNode' );
            //
            _node.setStyle( 'opacity', 0.2 );
            //
            _dragNode.set( 'innerHTML', _node.get( 'innerHTML') );
            _dragNode.setStyles( {
                backgroundColor : _node.getStyle( 'backgroundColor' ),
                color           : _node.getStyle( 'color' ),
                opacity         : 0.65
            } );
        },

        /**
         *
         */
        _onDragEnd : function ( drag, evt ) {
            drag.get( 'node' ).setStyle('opacity', 1);
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerSources = LayoutDesignerSources;

