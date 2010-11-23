YUI.add('bewype-layout-designer-config', function(Y) {


    /**
     *
     */
    var LayoutDesignerConfig = function ( config ) {
        LayoutDesignerConfig.superclass.constructor.apply( this, arguments );
    };


    LayoutDesignerConfig.NAME = 'layout-designer-config';

    LayoutDesignerConfig.ATTRS = {
        designerClass : {
            value : 'layout-designer',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetStartActions : {
            value : [ 'row', 'column' ],
            writeOnce : true
        },
        targetHorizontalActions : {
            value : [ 'column', 'text', 'image', 'remove' ],
            writeOnce : true
        },
        targetVerticalActions : {
            value : [ 'row', 'text', 'image', 'remove' ],
            writeOnce : true
        },
        contentHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentWidth : {
            value : 40,
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
        defaultContent : {
            value : 'Text..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        baseNode : {
            value : null,
            writeOnce : true
        },
        parentNode : {
            value : null
        },
        layoutWidth : {
            value : 600,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        placesType : {
            value : 'start',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetType : {
            value : 'start',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        contentType : {
            value : 'text',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultText : {
            value : '',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultImg : {
            value : Y.config.base + 'bewype-layout-designer/assets/blank.png',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        editorTextButtons : {
            value : [
                    'height',
                    'width',
                    'bold',
                    'italic',
                    'underline',
                    'font-family',
                    'font-size',
                    'text-align',
                    'color',
                    'background-color',
                    'url',
                    'file',
                    'reset',
                    'apply'
                    ]
        },
        editorImageButtons : {
            value : [
                    'background-color',
                    'height',
                    'padding-top',
                    'padding-bottom',
                    'text-align',
                    'file',
                    'reset',
                    'apply'
                    ]
        },
        fileStaticPath : {
            value : 'http://www.bewype.org/uploads/',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        uploadUrl : {
            value : 'http://www.bewype.org/upload',
            writeOnce : true
        },
        startingTargetType : {
            value: 'start', 
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        panelPosition : {
            value: 'left', 
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        panelOffsetY : {
            value : 80,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        panelOffsetX : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        pickerColorSize : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( LayoutDesignerConfig, Y.Plugin.Base );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerConfig = LayoutDesignerConfig;



}, '@VERSION@' ,{requires:['plugin']});
