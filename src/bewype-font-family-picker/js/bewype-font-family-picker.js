
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
        fontFamilies : {
            value : [
                [ 'arial-helvetica', 'Arial, Helvetica, sans-serif' ],
                [ 'arial-black', 'Arial Black, Gadget, sans-serif' ],
                [ 'comic', '\'Comic Sans MS\', cursive, sans-serif' ],
                [ 'courier', '\'Courier New\', Courier, monospace' ],
                [ 'georgia', 'Georgia, serif' ],
                [ 'impact', 'Impact, Charcoal, sans-serif' ],
                [ 'lucida-console', '\'Lucida Console\', Monaco, monospace' ],
                [ 'lucida-sans', '\'Lucida Sans Unicode\', "Lucida Grande", sans-serif' ],
                [ 'palatino', '\'Palatino Linotype\', "Book Antiqua", Palatino, serif' ],
                [ 'tahoma', 'Tahoma, Geneva, sans-serif' ],
                [ 'trebuchet', '\'Trebuchet MS\', Helvetica, sans-serif' ],
                [ 'verdana', 'Verdana, Geneva, sans-serif' ]
            ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( FontFamilyPicker, Y.Widget, {

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

            // add familys
            Y.Object.each( this.get( 'fontFamilies' ), function (v, k) {
                var _style = v[ 1 ],
                    _text = v[ 1 ].split(',')[ 0 ].replace(/\'/g, '');
                this._itemPicker.append( v[ 0 ], _text, _style );
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

            // get selected name
            var _name = this._itemPicker._currentName;

            // get family
            var _currentFamily = null;
            Y.Object.each( this.get( 'fontFamilies' ), function (v, k) {
                if ( v[ 0 ] === _name ) {
                    _currentFamily = v[ 1 ];
                }
            }, this );

            // return current or none
            return _currentFamily;
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
    Y.Bewype.FontFamilyPicker = FontFamilyPicker;

