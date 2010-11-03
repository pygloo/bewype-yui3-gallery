
    /**
     *
     */
    var LayoutDesignerContentImage = function ( config ) {
        LayoutDesignerContentImage.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentImage.C_TEMPLATE =  '<image class="{designerClass}-content ';
    LayoutDesignerContentImage.C_TEMPLATE += '{designerClass}-content-{contentType}" ';
    LayoutDesignerContentImage.C_TEMPLATE += 'src="{defaultImg}" />';
    /**
     *
     */
    LayoutDesignerContentImage.NAME  = 'layout-designer-content-image';

    /**
     *
     */
    LayoutDesignerContentImage.NS    = 'layoutDesignerContent';

    /**
     *
     */
    Y.extend( LayoutDesignerContentImage, Y.Bewype.LayoutDesignerContentBase, {

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
            var _template = Y.substitute( LayoutDesignerContentImage.C_TEMPLATE, {
                    defaultImg : this.get( 'defaultImg' )
                } );

            // do init
            this._init( _template );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentImage = LayoutDesignerContentImage;

