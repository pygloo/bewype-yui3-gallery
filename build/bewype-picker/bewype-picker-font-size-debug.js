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

    Y.extend( PickerFontSize, Y.Widget, {

        _picker : null,       

        /**
         *
         */
        initializer : function( config ) {
            this._picker = new Y.Bewype.Picker( {
                pickerClass : this.get( 'pickerClass' )
            } );
        },

        /**
         *
         */
        renderUI : function () {

            // render base picker
            this._picker.render( this.get( 'contentBox'  ) );

            // add sizes
            Y.Object.each( this.get( 'fontSizes' ), function (v, k) {
                var _style = 'font-size: ' + v + 'px;';
                this._picker.append( v,  v, _style);
            }, this );
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
            this._picker.destroy();
        },

        /**
         *
         */
        getValue : function() {
            return this._picker._currentName;
        },

        /**
         *
         */
        append : function ( name, text, style ) {
            this._picker.append( name, text, style );
        },

        /**
         *
         */
        remove : function ( name ) {
            this._picker.remove( name );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerFontSize = PickerFontSize;



}, '@VERSION@' ,{requires:['bewype-picker-base']});
