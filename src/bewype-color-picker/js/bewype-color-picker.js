
    /**
     *
     */
    var PICKER_TMPL = '',
        RGB_TMPL    = '';
    
        /**
         *
         */
        PICKER_TMPL += '<div id="{pickerClass}-panel"><table>';
        PICKER_TMPL += '  <tr>';
        PICKER_TMPL += '    <td>';
        PICKER_TMPL += '      <div id="{pickerClass}-selector">';
        PICKER_TMPL += '        <img id="{pickerClass}-selector-bg" src="{pickerDir}/picker-{pickerSize}.png" />';
        PICKER_TMPL += '      </div>';
        PICKER_TMPL += '    </td>';
        PICKER_TMPL += '    <td>';
        PICKER_TMPL += '      <div id="{pickerClass}-hue">';
        PICKER_TMPL += '        <img id="{pickerClass}-hue-bg" src="{pickerDir}/hue-{pickerSize}.png" />';
        PICKER_TMPL += '      </div>';
        PICKER_TMPL += '    </td>';
        PICKER_TMPL += '    <td>';
        PICKER_TMPL += '      <div id="{pickerClass}-slider" class="{sliderSkin}"></div>';
        PICKER_TMPL += '    </td>';
        PICKER_TMPL += '    <td>';
        PICKER_TMPL += '      <div id="{pickerClass}-preview"></div>';
        PICKER_TMPL += '      <p>';
        PICKER_TMPL += '        <div id="{pickerClass}-r" class="{pickerClass}-rgb"></div>';
        PICKER_TMPL += '        <div id="{pickerClass}-g" class="{pickerClass}-rgb"></div>';
        PICKER_TMPL += '        <div id="{pickerClass}-b" class="{pickerClass}-rgb"></div>';
        PICKER_TMPL += '      </p>';
        PICKER_TMPL += '    </td>';
        PICKER_TMPL += '  </tr>';
        PICKER_TMPL += '</table></div>';

        /**
         *
         */
        RGB_TMPL += '<b>{rgb}</b>{value}';

    var ColorPicker = function(config) {
        ColorPicker.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    ColorPicker.NAME = "colorPicker";

    /**
     * 
     */
    ColorPicker.NS = "colorPicker";

    /**
     *
     */
    ColorPicker.ATTRS = {
        pickerClass : {
            value : 'color-picker',
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
        },
        sliderSkin : {
            value : 'yui3-skin-sam',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( ColorPicker, Y.Widget, {
        
        _slider   : null,

        _hexvalue : null,

        _size : null,

        _x : null,

        _y : null,

        /**
         *
         */
        initializer : function( config ) {
        },

        renderUI : function () {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _sLength      = ( _pickerSize == 180 ) ?  192 :  102,
                _pickerNode   = null,
                _selectorNode = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass,
                    pickerDir   : Y.config.base + 'bewype-color-picker/assets',
                    pickerSize  : _pickerSize,
                    sliderSkin  : this.get( 'sliderSkin' )
                } )
            );
            _contentBox.append( _pickerNode );

            // set event callback
            _selectorNode = Y.one( '#' + _pickerClass + '-selector' );
            Y.on( 'mousemove', Y.bind( this._onSelectorChange, this ), _selectorNode );

            this._slider = new Y.Slider( {
                axis: 'y',
                min   : -179,     // min is the value at the top
                max   : 180,      // max is the value at the bottom
                value : -1,        // initial value
                length: _sLength + 'px',  // rail extended to afford all values
                // construction-time event subscription
                after : {
                    valueChange: Y.bind( this._onSliderChange, this )
                }
            } );

            // render slider                       
            this._slider.render( '#' + _pickerClass + '-slider' );

            // update all
            this._onSliderChange();
        },

        bindUI : function () {
        },

        syncUI : function () {

            // update all
            this._onSliderChange();
        },

        /**
         *
         */
        destructor : function() {

            // tmp vars
            var _contentBox  = this.get( 'contentBox' ),
                _pickerSize  = this.get( 'pickerSize'  ),
                _pClass      = this.get( 'pickerClass' ),
                _pickerClass = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small';

            // remove main div
            _contentBox.one( '#' + _pickerClass + '-panel' ).remove();
        },

        getValue : function() {
            return this._hexvalue ? '#' + this._hexvalue.toLowerCase() : '#000000';
        },

        _getRgbInnerHtml : function ( rgb, value) {
            return Y.substitute( RGB_TMPL, {
                rgb   : rgb,
                value : value
            } );
        },

        _onSelectorChange : function ( evt ) {

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

            if ( !evt || _pickerNode.get( 'id' ) === _pickerClass + '-selector-bg') {

                _h   = ( 180 - _value ); /* compute hsv value */
                _s   = this._x / 180;
                _v   = ( 180 - this._y ) / 180;
                _rgb = Y.Bewype.Color.hsv2rgb( ( _h == 180 ) ? 0 : _h, _s, _v );   /* compute rgb       */

                // get hex value
                this._hexvalue = Y.Bewype.Color.rgb2hex( _rgb[0], _rgb[1], _rgb[2] );

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

        _onSliderChange : function ( evt ) {
            //
            var _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _value           = evt ? evt.newVal : 0,
                _h            = ( 180 - _value ),
                _rgb          = Y.Bewype.Color.hsv2rgb( ( _h == 1 ) ? 0 : _h , 1, 1 ),
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
            this._onSelectorChange();
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.ColorPicker = ColorPicker;

