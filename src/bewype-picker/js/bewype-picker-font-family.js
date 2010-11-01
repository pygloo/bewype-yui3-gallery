
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
            value : 'bewype-picker-font-family',
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

    Y.extend( PickerFontFamily, Y.Bewype.Picker, {

        _currentFamily : null,

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

            // add familys
            Y.Object.each( this.get( 'fontFamilies' ), function (v, k) {
                // prepare values
                var _style = 'font-family: ' + v[ 1 ] + ';',
                    _text = v[ 1 ].split(',')[ 0 ].replace(/\'/g, '');
                // do add
                this.append( v[ 0 ], _text, _style );
            }, this );
        },

        /**
         *
         */
        getValue : function() {

            // get family
            Y.Object.each( this.get( 'fontFamilies' ), function ( v, k ) {
                if ( v[ 0 ] == this._currentName ) {
                    this._currentFamily = v[ 1 ];
                }
            }, this );

            // return current or none
            return this._currentFamily;
        },

        setValue : function( value ) {
            this._currentFamily = value;                       
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerFontFamily = PickerFontFamily;

