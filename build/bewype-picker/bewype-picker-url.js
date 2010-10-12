YUI.add('bewype-picker-url', function(Y) {


    /**
     *
     */
    var PICKER_TMPL = '',
        PickerUrl   = function(config) {
        PickerUrl.superclass.constructor.apply(this, arguments);
    };
    
    /**
     *
     */
    PICKER_TMPL += '<div class="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-label">Url</div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <input class="{pickerClass}-input" type="text">';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '  </tr>';
    PICKER_TMPL += '</table></div>';

    /**
     */
    PickerUrl.NAME = "pickerUrl";

    /**
     *
     */
    PickerUrl.ATTRS = {
        pickerClass : {
            value : 'yui3-picker-url',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( PickerUrl, Y.Widget, {

        _url : null,

        /**
         *
         */
        initializer : function( config ) {

            // our custom event
            this.publish( 'picker:onChange' );
        },

        renderUI : function () {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerClass  = this.get( 'pickerClass' ),
                _pickerNode   = null,
                _inputNode    = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass
                } )
            );
            _contentBox.append( _pickerNode );

            // set event callback
            _inputNode = _contentBox.one( '.' + _pickerClass + '-input' );
            Y.on( 'yui3-picker-event|blur', Y.bind( this._onInputChange, this ), _inputNode );
        },

        bindUI : function () {
        },

        syncUI : function () {
        },

        /**
         *
         */
        destructor : function() {

            // tmp vars
            var _contentBox  = this.get( 'contentBox' ),
                _pickernode  = _contentBox.one( '.' + this.get( 'pickerClass' ) );

            // little check
            if ( _pickernode ) {

                // remove events
                Y.detach('yui3-picker-event|blur');
                
                // remove main div
                _pickernode.remove();
            }
        },

        getValue : function() {
            return this._url;
        },

        _onInputChange : function ( evt ) {

            // vars
            var _inputNode   = evt ? evt.target : null,
                _pickerClass = this.get( 'pickerClass' );

            if ( _inputNode ) {
                // TODO - may be check the url first ???
                this._url = _inputNode.get( 'value' );
                // fire custom event
                this.fire("picker:onChange");
            }
        }
    } );

    // manage custom event
    Y.augment( PickerUrl, Y.EventTarget );

    Y.namespace('Bewype');
    Y.Bewype.PickerUrl = PickerUrl;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});
