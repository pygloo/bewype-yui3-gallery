YUI.add('bewype-layout-designer-content-image', function(Y) {


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
    LayoutDesignerContentImage.C_TEMPLATE += 'src="{defaultImgSrc}" />';
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
    LayoutDesignerContentImage.ATTRS = {
        contentType : {
            value : 'image',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultImgSrc : {
            value : 'http://www.google.fr/images/logo.png',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

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

            // init content  node and plugin content base
            var _template = Y.substitute( LayoutDesignerContentImage.C_TEMPLATE, {
                    defaultImgSrc : this.get( 'defaultImgSrc' )
                } );
            // do init
            this._init( config, _template );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentImage = LayoutDesignerContentImage;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
