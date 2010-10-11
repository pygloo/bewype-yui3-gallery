
    /**
     *
     */
    var BW_PICKER_TMPL = '';
    
        /**
         *
         */
        BW_PICKER_TMPL += '';

    var FontSizePicker = function(config) {
        FontSizePicker.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    FontSizePicker.NAME = "fontSizePicker";

    /**
     * 
     */
    FontSizePicker.NS = "fontSizePicker";

    /**
     *
     */
    FontSizePicker.ATTRS = {
        pickerClass : {
            value : 'font-size-picker',
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

    Y.extend( FontSizePicker, Y.Widget, {

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
    Y.Widget.FontSizePicker = FontSizePicker;

