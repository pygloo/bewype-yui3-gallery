
    var PickerTextAlign = function(config) {
        PickerTextAlign.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    PickerTextAlign.NAME = "pickerTextAlign";

    /**
     *
     */
    PickerTextAlign.ATTRS = {
        pickerClass : {
            value : 'bewype-picker-text-align',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        alignProps : {
            value : [ 'left', 'center', 'right' ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( PickerTextAlign, Y.Bewype.Picker, {

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
            Y.Object.each( this.get( 'alignProps' ), function (v, k) {
                var _style = 'text-align: ' + v + ';',
                    _last  = k == ( this.get( 'alignProps' ).length - 1 );
                this.append( v,  v, _style, null, _last);
            }, this );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerTextAlign = PickerTextAlign;

