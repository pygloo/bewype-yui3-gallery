
    var PickerTitle = function(config) {
        PickerTitle.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    PickerTitle.NAME = "pickerTitle";

    /**
     *
     */
    PickerTitle.ATTRS = {
        pickerClass : {
            value : 'bewype-picker-title',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        titles : {
            value : [
                [ null, 'Normal' ],
                [ 'h1', 'Title 1' ],
                [ 'h2', 'Title 2' ],
                [ 'h3', 'Title 3' ],
                [ 'h4', 'Title 4' ]
            ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( PickerTitle, Y.Bewype.Picker, {

        _currentTitle : null,

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
            Y.Object.each( this.get( 'titles' ), function (v, k) {
                // prepare values
                var _text = '<' + v[ 0 ] + '>' + v[ 1 ] + '</' + v[ 0 ] + '>' ;
                // do add
                this.append( v[ 0 ], _text );
            }, this );
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerTitle = PickerTitle;

