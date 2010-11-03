
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

    /**
     *
     */
    LayoutDesignerSources.ATTRS = {
        designerClass : {
            value : 'layout-designer',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        sourceHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        sourceWidth : {
            value : 140,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( LayoutDesignerSources, Y.Plugin.Base, {

        /**
         *
         */
        _groups : [ 'horizontal', 'vertical', 'text', 'image' ],

        /**
         *
         */
        _labels: [ 'Layout Horizontal', 'Layout Vertical', 'Text', 'Image' ],

        /**
         *
         */
        initializer: function( config ) {

            // create table for sources and attach it
            var _tableSrc = new Y.Node.create( '<table><tr /></table>' );
            this.get( 'host' ).append( _tableSrc );

            // add sources
            Y.Object.each(this._groups, function( v, k ) {
                var _n      = null,
                    _td     = null,
                    _drag   = null;

                // create source components & attach
                _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.ITEM_SRC_TEMPLATE, {
                    itemType      : v,
                    designerClass : this.get( 'designerClass' ),
                    itemLabel     : this._labels[ k ]
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
                    dragMode: 'intersect'
                } );
                // additionnal drag features
                _drag.plug( Y.Plugin.DDProxy, {
                    moveOnEnd : false
                } );
                _drag.plug( Y.Plugin.DDConstrained, {
                    constrain2node  : [ this.get( 'host' ), this.get( 'host' ).next() ]
                } );
                // set drag events
                _drag.on( 'drag:start', Y.bind( this._onDragStart,   this, _drag ) );
                _drag.on( 'drag:end'  , Y.bind( this._onDragEnd  ,   this, _drag ) );

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

