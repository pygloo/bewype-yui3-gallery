
    /**
     *
     */
    var LayoutDesignerContentText = function ( config ) {
        LayoutDesignerContentText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentText.C_TEMPLATE =  '<div class="{designerClass}-content ';
    LayoutDesignerContentText.C_TEMPLATE += '{designerClass}-content-{contentType}">';
    LayoutDesignerContentText.C_TEMPLATE += '</div>';

    /**
     *
     */
    LayoutDesignerContentText.NAME = 'layout-designer-content-text';

    /**
     *
     */
    LayoutDesignerContentText.NS   = 'layoutDesignerContent';

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

            // ??
            this.setAttrs( config );

            // init content  node and plugin content base
            var _contentNode = this._init( LayoutDesignerContentText.C_TEMPLATE );

            // set default content
            _contentNode.set( 'innerHTML', this.get( 'defaultText' ) );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentText = LayoutDesignerContentText;

