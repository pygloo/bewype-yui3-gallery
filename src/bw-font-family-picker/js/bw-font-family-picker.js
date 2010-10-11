
    /**
     *
     */
    var BW_PICKER_TMPL = '';
    
        /**
         *
         */
        BW_PICKER_TMPL += '';

    var FontFamilyPicker = function(config) {
        FontFamilyPicker.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    FontFamilyPicker.NAME = "fontFamilyPicker";

    /**
     * 
     */
    FontFamilyPicker.NS = "fontFamilyPicker";

    /**
     *
     */
    FontFamilyPicker.ATTRS = {
        pickerClass : {
            value : 'font-family-picker',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        pickerSkin : {
            value : 'yui3-skin-sam',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( FontFamilyPicker, Y.Widget, {

        /**
         *
         */
        initializer : function( config ) {
        },

        /**
         *
         */
        renderUI : function () {

        },

        /**
         *
         */
        bindUI : function () {

        },

        /**
         *
         */
        syncUI : function () {

        },

        /**
         *
         */
        destructor : function() {

        },

        getValue : function() {
            return '';
        },

        /**
         *
         */
        _updatePicker : function ( evt ) {

        }

    } );

    Y.namespace('Widget');
    Y.Widget.FontFamilyPicker = FontFamilyPicker;

