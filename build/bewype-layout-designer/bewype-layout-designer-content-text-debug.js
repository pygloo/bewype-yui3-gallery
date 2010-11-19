YUI.add('bewype-layout-designer-content-text', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentText = function ( config ) {
        LayoutDesignerContentText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentText.NAME = 'layout-designer-content-text';

    /**
     *
     */
    LayoutDesignerContentText.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContentText, Y.Bewype.LayoutDesignerContentBase );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentText = LayoutDesignerContentText;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
