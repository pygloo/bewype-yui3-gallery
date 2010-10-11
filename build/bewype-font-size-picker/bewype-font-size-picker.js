YUI.add('bewype-font-size-picker', function(Y) {


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
        fontSizes : {
            value : [ '8', '10', '12', '16', '20', '24', '32', '40' ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( FontSizePicker, Y.Widget, {

        _itemPicker : null,       

        /**
         *
         */
        initializer : function( config ) {
            this._itemPicker = new Y.Bewype.ItemPicker( {
                pickerClass : this.get( 'pickerClass' )
            } );
        },

        /**
         *
         */
        renderUI : function () {

            // render base picker
            this._itemPicker.render( this.get( 'contentBox'  ) );

            // add sizes
            Y.Object.each( this.get( 'fontSizes' ), function (v, k) {
                var _style = 'font-size: ' + v + 'px;';
                this._itemPicker.append( v,  v, _style);
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
            this._itemPicker.destroy();
        },

        /**
         *
         */
        getValue : function() {
            return this._itemPicker._currentName;
        },

        /**
         *
         */
        append : function ( name, text, style ) {
            this._itemPicker.append( name, text, style );
        },

        /**
         *
         */
        remove : function ( name ) {
            this._itemPicker.remove( name );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.FontSizePicker = FontSizePicker;



}, '@VERSION@' ,{requires:['yui-base', 'node', 'plugin', 'stylesheet', 'slider']});
