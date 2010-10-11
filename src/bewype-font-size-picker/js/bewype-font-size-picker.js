
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
            this._itemPicker.render( this.get( 'contentBox'  ) );
            this._itemPicker.append(  '8',  '8');
            this._itemPicker.append( '10', '10');
            this._itemPicker.append( '12', '12');
            this._itemPicker.append( '16', '16');
            this._itemPicker.append( '20', '20');
            this._itemPicker.append( '24', '24');
            this._itemPicker.append( '32', '32');
            this._itemPicker.append( '40', '40');
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

