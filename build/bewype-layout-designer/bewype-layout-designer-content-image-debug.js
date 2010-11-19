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
    LayoutDesignerContentImage.NAME  = 'layout-designer-content-image';

    /**
     *
     */
    LayoutDesignerContentImage.NS    = 'layoutDesignerContent';

    /**
     *
     */
    Y.extend( LayoutDesignerContentImage, Y.Bewype.LayoutDesignerContentBase );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentImage = LayoutDesignerContentImage;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
