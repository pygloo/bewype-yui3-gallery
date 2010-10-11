YUI.add('bewype-picker-font-family', function(Y) {


    var PickerFontFamily = function(config) {
        PickerFontFamily.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    PickerFontFamily.NAME = "pickerFontFamily";

    /**
     *
     */
    PickerFontFamily.ATTRS = {
        pickerClass : {
            value : 'yui3-picker-font-family',
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

    Y.extend( PickerFontFamily, Y.Widget, {

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

            // add familys
            Y.Object.each( this.get( 'fontFamilies' ), function (v, k) {
                var _style = 'font-family: ' + v[ 1 ] + ';',
                    _text = v[ 1 ].split(',')[ 0 ].replace(/\'/g, '');
                this._picker.append( v[ 0 ], _text, _style );
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

            // get selected name
            var _name          = this._picker._currentName,
                _currentFamily = null;

            // get family
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
    Y.Bewype.PickerFontFamily = PickerFontFamily;



}, '@VERSION@' ,{requires:['bewype-picker-base']});
