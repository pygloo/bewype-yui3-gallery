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
    LayoutDesigner.NODE_SRC_TEMPLATE = '<div id="{idSource}"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_DST_TEMPLATE = '<div id="{idDest}"></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    LayoutDesigner.ATTRS = {
        idSource : {
            value : 'layout-source',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        idDest : {
            value : 'layout-dest',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetOverHeight : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetMinHeight : {
            value : 8,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetOverWidth : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetMinWidth : {
            value : 8,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetZIndex : {
            value : 1,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentWidth : {
            value : 120,
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
        editCallback : {
            value : null
        },
        layoutWidth : {
            value : 600,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( LayoutDesigner, Y.Plugin.Base, {

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        initializer: function( config ) {

            // tmp vars
            _idSource = this.get( 'idSource' );
            _idDest   = this.get( 'idDest' );

            // create source node
            var _nodeSrc = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                idSource : _idSource
            } ) );
            // attach src parent to widget
            this.get( 'host' ).append( _nodeSrc );
            // plug source bar
            _nodeSrc.plug( Y.Bewype.LayoutDesignerSources, {
                layoutWidth : this.get( 'layoutWidth' )
            } );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_DST_TEMPLATE, {
                idDest : _idDest
            } ) );
            // attach layout node to main node
            this.get( 'host' ).append( this.nodeLayout );
            //
            this._setLayoutWidth( this.get( 'layoutWidth' ) );

            // plug target
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, {
                targetOverHeight : this.get( 'targetOverHeight' ),
                targetOverWidth  : this.get( 'targetOverWidth'  ),
                targetMinHeight  : this.get( 'targetMinHeight'  ),
                targetMinWidth   : this.get( 'targetMinWidth'   ),
                targetType       : 'start',
                targetZIndex     : this.get( 'targetZIndex'     ),
                contentHeight    : this.get( 'contentHeight'    ),
                contentWidth     : this.get( 'contentWidth'     ),
                contentZIndex    : this.get( 'contentZIndex'    ),
                contentClass     : this.get( 'contentClass'     ),
                defaultContent   : this.get( 'defaultContent'   ),
                editCallback     : this.get( 'editCallback'     ),
                idDest           : _idDest
            } );
        },

        destructor: function () {
        },

        /**
         *
         */
        _setLayoutWidth : function ( width ) {
            this.nodeLayout.setStyle( 'width' , width );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesigner = LayoutDesigner;



}, '@VERSION@' ,{requires:['bewype-layout-designer-sources', 'bewype-layout-designer-target']});