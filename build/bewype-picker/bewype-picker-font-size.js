YUI.add('bewype-picker-font-size', function(Y) {


    var PickerFontSize = function(config) {
        PickerFontSize.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    PickerFontSize.NAME = "pickerFontSize";

    /**
     *
     */
    PickerFontSize.ATTRS = {
        pickerClass : {
            value : 'yui3-picker-font-size',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        fontSizes : {
            value : [ '8', '10', '12', '16', '20', '24', '32', '40' ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( PickerFontSize, Y.Bewype.Picker, {

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );
        },

        /**
         *
         */
        renderUI : function () {

            // render default
            this._renderBaseUI();

            // add sizes
            Y.Object.each( this.get( 'fontSizes' ), function (v, k) {
                var _style = 'font-size: ' + v + 'px;';
                this.append( v,  v, _style);
            }, this );
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerFontSize = PickerFontSize;



}, '@VERSION@' ,{requires:['bewype-picker-base']});
