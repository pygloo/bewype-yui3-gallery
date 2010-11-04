YUI.add('bewype-editor-config', function(Y) {


    /**
     *
     */
    var EditorConfig = function(config) {
        EditorConfig.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    EditorConfig.NAME = 'bewype-editor-config';

    /**
     *
     */
    EditorConfig.ATTRS = {
        editorClass : {
            value : 'bewype-editor-panel',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        activeButtons : {
            value : [
                    'height',
                    'width',
                    'padding-top',
                    'padding-right',
                    'padding-bottom',
                    'padding-left',
                    'bold',
                    'italic',
                    'underline',
                    'title',
                    'font-family',
                    'font-size',
                    'color',
                    'background-color',
                    'url',
                    'file',
                    'reset',
                    'apply'
                    ],
            writeOnce : true
        },
        spinnerLabelHeight : {
            value : 'height',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        spinnerLabelWidth : {
            value : 'width',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },              
        spinnerMaxHeight : {
            value : 480,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        spinnerMaxWidth : {
            value : 640,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },       
        spinnerLabelPaddingTop : {
            value : 'padding-top',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },    
        spinnerLabelPaddingRight : {
            value : 'padding-right',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },    
        spinnerLabelPaddingBottom : {
            value : 'padding-bottom',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },    
        spinnerLabelPaddingLeft : {
            value : 'padding-left',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        fileStaticPath : {
            value : Y.config.doc.location.href + 'static/',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        uploadUrl : {
            value : Y.config.doc.location.href + 'upload',
            writeOnce : true
        },
        panelNode : {
            value : null,
            writeOnce : true
        },
        spinnerValues : {
            value : {}
        },
        selectionColor : {
            value : '#ddd',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( EditorConfig, Y.Plugin.Base );

    Y.namespace( 'Bewype' );
    Y.Bewype.EditorConfig = EditorConfig;



}, '@VERSION@' ,{requires:['plugin']});
