
    /**
     *
     */
    var LayoutDesignerContentText = function ( config ) {
        LayoutDesignerContentText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentText.C_TEMPLATE = '<div class="{designerClass}-content {designerClass}-content-{contentType}"></div>';

    /**
     *
     */
    LayoutDesignerContentText.NAME  = 'layout-designer-content-text';

    /**
     *
     */
    LayoutDesignerContentText.NS    = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContentText.ATTRS = {
        contentType : {
            value : 'text',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultContent : {
            value : 'Text..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( LayoutDesignerContentText, Y.Bewype.LayoutDesignerContentBase, {

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

            // init content  node and plugin content base
            var _contentNode = this._init( config, LayoutDesignerContentText.C_TEMPLATE );

            // set default content
            _contentNode.set( 'innerHTML', config.defaultContent );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentText = LayoutDesignerContentText;

