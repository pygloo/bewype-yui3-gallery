YUI.add('bewype-picker-base', function(Y) {


    /**
     *
     */
    var PICKER_TMPL = '',
        ITEM_TMPL = '',
        Picker  = null;
    
        /**
         *
         */
        PICKER_TMPL += '<div id="{pickerId}"><table>';
        PICKER_TMPL += '</table></div>';

        /**
         *
         */
        ITEM_TMPL += '<tr>';
        ITEM_TMPL += '  <td>';
        ITEM_TMPL += '    <div id="{itemId}" class="{itemClass}" {style}>{text}</div>';
        ITEM_TMPL += '  </td>';
        ITEM_TMPL += '</tr>';

    Picker = function(config) {
        Picker.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    Picker.NAME = "picker";

    /**
     * 
     */
    Picker.NS = "picker";

    /**
     *
     */
    Picker.ATTRS = {
        pickerClass : {
            value : 'yui3-picker',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( Picker, Y.Widget, {

        /**
         *
         */
        _currentName : null,

        /**
         *
         */
        initializer : function( config ) {

            //
            this._currentName = null;
        },

        /**
         * 
         */
        renderUI : function () {

            // vars
            var _contentBox = this.get( 'contentBox'  ),
                _pickerId   = this.get( 'pickerClass' ),
                _pickerNode = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerId : _pickerId
                } )
            );
            _contentBox.append( _pickerNode );
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

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _pickerId    = this.get( 'pickerClass' ),
                _pickerNode  = null;

            // get picker node
            _pickerNode = _contentBox.one( '#' + _pickerId );

            // little check
            if ( _pickerNode ) {
                
                // remove events
                Y.detach('yui3-picker-event|click');
    
                // remove nodes
                _pickerNode.remove();
            }
        },

        /**
         *
         */
        _onItemClick : function ( name, evt ) {

            // vars
            var _itemNode   = evt ? evt.target : null;

            // little check
            if (_itemNode) {
                // update name
                this._currentName = name;
            }
        },

        /**
         *
         */
        getValue : function() {
            return this._currentName;
        },

        /**
         *
         */
        append : function ( name, text, style ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _pickerClass = this.get( 'pickerClass' ),
                _pickerNode  = null,
                _itemNode    = null;

            // get picker node
            _pickerNode = _contentBox.one( '#' + _pickerClass );

            // little check
            if ( _pickerNode ) {
                // create row
                _itemNode = new Y.Node.create(
                    Y.substitute( ITEM_TMPL, {
                        itemId    : _pickerClass + '-' + name,
                        itemClass : _pickerClass + '-row',
                        text      : text,
                        style     : style ? 'style="' + style + '"' : ''
                    } )
                );
                // do add
                _pickerNode.one('table').append( _itemNode );

                // add on click event
                Y.on( 'yui3-picker-event|click', Y.bind( this._onItemClick, this, name ), _itemNode );
            }
        },

        /**
         *
         */
        remove : function ( name ) {

            // vars
            var _contentBox = this.get( 'contentBox'  ),
                _itemId     = '#' + this.get( 'pickerClass' ) + '-' + name,
                _itemNode   = null;

            // get item node
            _itemNode = _contentBox.one( _itemId );

            // little check
            if ( _itemNode ) {

                // do remove
                _itemNode.ancestor( 'tr' ).remove();

                // avoid current value
                if ( this._currentName === name ) {
                    this._currentName = null;
                }
            }
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.Picker = Picker;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});
YUI.add('bewype-picker-color', function(Y) {


    /**
     *
     */
    var PICKER_TMPL = '',
        RGB_TMPL    = '',
        PickerColor = function (config) {
        PickerColor.superclass.constructor.apply(this, arguments);
    };
    
    /**
     *
     */
    PICKER_TMPL += '<div id="{pickerClass}"><table>';
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

    /**
     */
    PickerColor.NAME = "pickerColor";

    /**
     *
     */
    PickerColor.ATTRS = {
        pickerClass : {
            value : 'yui3-picker-color',
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

    Y.extend( PickerColor, Y.Widget, {
        
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
                    pickerDir   : Y.config.base + 'bewype-picker/assets',
                    pickerSize  : _pickerSize,
                    sliderSkin  : this.get( 'sliderSkin' )
                } )
            );
            _contentBox.append( _pickerNode );

            // set event callback
            _selectorNode = Y.one( '#' + _pickerClass + '-selector' );
            Y.on( 'yui3-picker-event|mousemove', Y.bind( this._onSelectorChange, this ), _selectorNode );

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
                _pickerId    = ( _pickerSize == 180 ) ? '#' + _pClass : '#' + _pClass + '-small',
                _pickernode  = _contentBox.one( _pickerId );

            // little check
            if ( _pickernode ) {

                // remove events
                Y.detach('yui3-picker-event|click');
                
                // remove main div
                _pickernode.remove();
            }
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
            var _selectorNode = evt ? evt.target : null,
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
                _x = evt.pageX - _selectorNode.get( 'x' );
                _y = evt.pageY - _selectorNode.get( 'y' );
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

            if ( !evt || _selectorNode.get( 'id' ) === _pickerClass + '-selector-bg') {

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
    Y.Bewype.PickerColor = PickerColor;



}, '@VERSION@' ,{requires:['bewype-color', 'slider', 'stylesheet', 'substitute', 'widget', 'yui-base']});
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
    PICKER_TMPL += '<div id="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-label">Url</div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <input id="{pickerClass}-input" type="text">';
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
            _inputNode = Y.one( '#' + _pickerClass + '-input' );
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
                _pickerId    = '#' + this.get( 'pickerClass' ),
                _pickernode  = _contentBox.one( _pickerId );

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

            if ( _inputNode.get( 'id' ) === _pickerClass + '-input') {
                // TODO - may be check the url first ???
                this._url = _inputNode.get( 'value' );
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerUrl = PickerUrl;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});


YUI.add('bewype-picker', function(Y){}, '@VERSION@' ,{use:['bewype-picker-base', 'bewype-picker-color', 'bewype-picker-font-size', 'bewype-picker-font-family', 'bewype-picker-url']});

