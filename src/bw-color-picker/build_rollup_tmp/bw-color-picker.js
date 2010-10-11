YUI.add('bw-color-picker-plugin', function(Y) {


    /**
     *
     */
    var BW_PICKER_TMPL = '',
        BW_RGB_TMPL    = '';
    
        /**
         *
         */
        BW_PICKER_TMPL += '<div id="{pickerClass}-panel"><table>';
        BW_PICKER_TMPL += '  <tr>';
        BW_PICKER_TMPL += '    <td>';
        BW_PICKER_TMPL += '      <div id="{pickerClass}-selector">';
        BW_PICKER_TMPL += '        <img id="{pickerClass}-selector-bg" src="{pickerDir}/picker-{pickerSize}.png" />';
        BW_PICKER_TMPL += '      </div>';
        BW_PICKER_TMPL += '    </td>';
        BW_PICKER_TMPL += '    <td>';
        BW_PICKER_TMPL += '      <div id="{pickerClass}-hue">';
        BW_PICKER_TMPL += '        <img id="{pickerClass}-hue-bg" src="{pickerDir}/hue-{pickerSize}.png" />';
        BW_PICKER_TMPL += '      </div>';
        BW_PICKER_TMPL += '    </td>';
        BW_PICKER_TMPL += '    <td>';
        BW_PICKER_TMPL += '      <div id="{pickerClass}-slider" class="{pickerSkin}"></div>';
        BW_PICKER_TMPL += '    </td>';
        BW_PICKER_TMPL += '    <td>';
        BW_PICKER_TMPL += '      <div id="{pickerClass}-preview"></div>';
        BW_PICKER_TMPL += '      <p>';
        BW_PICKER_TMPL += '        <div id="{pickerClass}-r" class="{pickerClass}-rgb"></div>';
        BW_PICKER_TMPL += '        <div id="{pickerClass}-g" class="{pickerClass}-rgb"></div>';
        BW_PICKER_TMPL += '        <div id="{pickerClass}-b" class="{pickerClass}-rgb"></div>';
        BW_PICKER_TMPL += '      </p>';
        BW_PICKER_TMPL += '    </td>';
        BW_PICKER_TMPL += '  </tr>';
        BW_PICKER_TMPL += '</table></div>';

        /**
         *
         */
        BW_RGB_TMPL += '<b>{rgb}</b>{value}';

    var ColorPickerPlugin = function(config) {
        ColorPickerPlugin.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    ColorPickerPlugin.NAME = "colorPickerPlugin";

    /**
     * 
     */
    ColorPickerPlugin.NS = "colorPicker";

    /**
     *
     */
    ColorPickerPlugin.ATTRS = {
        pickerClass : {
            value : 'color-picker',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        pickerSkin : {
            value : 'yui3-skin-sam',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        pickerSize : {
            value : 180, /* can be normal or small */
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        pickerThreshold : {
            value : 4,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( ColorPickerPlugin, Y.Plugin.Base, {
        
        _slider   : null,

        _hexvalue : null,

        _size : null,

        _x : null,

        _y : null,

        /**
         *
         */
        initializer : function( config ) {

            // vars
            var _host        = this.get( 'host'        ),
                _pickerSize  = this.get( 'pickerSize'  ),
                _pClass      = this.get( 'pickerClass' ),
                _pickerClass = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _sLength     = ( _pickerSize == 180 ) ?  192 :  102,
                _table       = null,
                _pickerNode  = Y.one( '#' + _pickerClass + '-selector' );

            // create table
            _table = new Y.Node.create(
                Y.substitute( BW_PICKER_TMPL, {
                    pickerClass : _pickerClass,
                    pickerSkin  : this.get( 'pickerSkin' ),
                    pickerDir   : Y.config.base + 'bw-color-picker/assets',
                    pickerSize   : _pickerSize
                } )
            );
            _host.append( _table );

            // set event callback
            Y.on( 'mousemove', Y.bind( this._updatePicker, this ), _pickerNode );

            this._slider = new Y.Slider( {
                axis: 'y',
                min   : -179,     // min is the value at the top
                max   : 180,      // max is the value at the bottom
                value : -1,        // initial value
                length: _sLength + 'px',  // rail extended to afford all values
                // construction-time event subscription
                after : {
                    valueChange: Y.bind( this._sliderUpdate, this )
                }
            } );
            this._slider.render( '#' + _pickerClass + '-slider' );

            this._sliderUpdate();
        },          
        
        /**
         *
         */
        destructor : function() {

            // tmp vars
            var _host        = this.get( 'host' ),
                _pickerSize  = this.get( 'pickerSize'  ),
                _pClass      = this.get( 'pickerClass' ),
                _pickerClass = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small';

            // remove main div
            _host.one( '#' + _pickerClass + '-panel' ).remove();
        },

        getValue : function() {
            return this._hexvalue ? '#' + this._hexvalue.toLowerCase() : '#000000';
        },

        _getRgbInnerHtml : function ( rgb, value) {
            return Y.substitute( BW_RGB_TMPL, {
                rgb   : rgb,
                value : value
            } );
        },

        _updatePicker : function ( evt ) {

            // vars
            var _pickerNode   = evt ? evt.target : null,
                _pickerSize   = this.get( 'pickerSize'  ),
                _pThreshO     = this.get( 'pickerThreshold' ),
                _pClass       = this.get( 'pickerClass' ),                
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _value           = this._slider ? this._slider.getValue() : 0,
                _x            = 0,
                _y            = 0,
                _h            = 0,
                _s            = 0,
                _v            = 0,
                _rgb          = [],
                _bgVal        = '',
                _previewNode  = Y.one( '#' + _pickerClass + '-preview' ),
                _rNode        = Y.one( '#' + _pickerClass + '-r' ),
                _gNode        = Y.one( '#' + _pickerClass + '-g' ),
                _bNode        = Y.one( '#' + _pickerClass + '-b' );

            if ( evt ) {
                // get picker position
                _x = evt.pageX - _pickerNode.get( 'x' );
                _y = evt.pageY - _pickerNode.get( 'y' );
                // manage small picker
                _x = ( _pickerSize == 180 ) ? _x : _x * 2;
                _y = ( _pickerSize == 180 ) ? _y : _y * 2;
                // force min or max
                this._x = ( _x <= _pThreshO ) ? 0 : ( ( _x >= 180 - _pThreshO ) ? 180 : _x );
                this._y = ( _y <= _pThreshO ) ? 0 : ( ( _y >= 180 - _pThreshO ) ? 180 : _y );
            } else {
                // init x y
                this._x = 90;
                this._y = 90;
            }

            if ( !evt
                || _pickerNode.get( 'id' ) === _pickerClass + '-selector-bg') {

                _h   = ( 180 - _value ); /* compute hsv value */
                _s   = this._x / 180;
                _v   = ( 180 - this._y ) / 180;
                _rgb = Y.BwColor.hsv2rgb( ( _h == 180 ) ? 0 : _h, _s, _v );   /* compute rgb       */

                // get hex value
                this._hexvalue = Y.BwColor.rgb2hex( _rgb[0], _rgb[1], _rgb[2] );

                //
                _bgVal += 'rgb(';
                _bgVal += _rgb[0] + ', ';
                _bgVal += _rgb[1] + ', ';
                _bgVal += _rgb[2];
                _bgVal += ')';

                // update preview style
                _previewNode.setStyle( 'backgroundColor', _bgVal );
    
                // udpate rgb info
                _rNode.set( 'innerHTML', this._getRgbInnerHtml( 'R', _rgb[0] ) );
                _gNode.set( 'innerHTML', this._getRgbInnerHtml( 'G', _rgb[1] ) );
                _bNode.set( 'innerHTML', this._getRgbInnerHtml( 'B', _rgb[2] ) );
            }
        },

        _sliderUpdate : function ( evt ) {
            //
            var _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _value           = evt ? evt.newVal : 0,
                _h            = ( 180 - _value ),
                _rgb          = Y.BwColor.hsv2rgb( ( _h == 1 ) ? 0 : _h , 1, 1 ),
                _bgVal        = '',
                _selectorNode = Y.one( '#' + _pickerClass + '-selector' );

            // set bg val
            _bgVal += 'rgb(';
            _bgVal += _rgb[0] + ', ';
            _bgVal += _rgb[1] + ', ';
            _bgVal += _rgb[2];
            _bgVal += ')';

            // update selector style
            _selectorNode.setStyle( 'backgroundColor', _bgVal );
            
            // refresh update picker
            this._updatePicker();
        }

    } );

    Y.namespace('Plugin.BwColorPicker');
    Y.Plugin.BwColorPicker.ColorPickerPlugin = ColorPickerPlugin;



}, '@VERSION@' ,{requires:['yui-base', 'node', 'plugin', 'stylesheet', 'slider', 'bw-color']});


YUI.add('bw-color-picker', function(Y){}, '@VERSION@' ,{use:['bw-color-picker-plugin']});

