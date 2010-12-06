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
        PICKER_TMPL += '<div class="{pickerClass}"><table>';
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
            value : 'bewype-picker-base',
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
        _previousName : null,

        /**
         *
         */
        _init : function ( config ) {

            // var init
            this._currentName = null;
            this._previousName = null;

            // our custom event
            this.publish( 'picker:onChange' );
        },

        /**
         *
         */
        initializer : function( config ) {
            this._init( config );
        },

        _renderBaseUI : function () {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _pickerClass = this.get( 'pickerClass' ),
                _pickerNode  = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass
                } )
            );
            _contentBox.append( _pickerNode );
        },

        /**
         * 
         */
        renderUI : function () {
            // render default
            this._renderBaseUI();
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
                _pickerClass = this.get( 'pickerClass' ),
                _pickerNode  = _contentBox.one( '.' + _pickerClass );

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
            if ( _itemNode ) {
                // update name
                this.setValue( name );
                // fire custom event
                this.fire("picker:onChange");
            }
        },

        /**
         *
         */
        getPrevious : function() {
            return this._previousName;
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
        setValue : function( value ) {
            this._previousName = this._currentName;
            this._currentName = value;
        },

        /**
         *
         */
        append : function ( name, text, style, active, lastItem ) {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _pClass      = this.get( 'pickerClass' ),
                _pickerClass = _pClass + '-row',
                _pickerNode  = _contentBox.one( '.' + _pClass ),
                _itemNode    = null; 

            // little check
            if ( _pickerNode ) {
                // create row
                _itemNode = new Y.Node.create(
                    Y.substitute( ITEM_TMPL, {
                        itemId    : _pickerClass + '-' + name,
                        itemClass : active ? _pickerClass + '-active' : _pickerClass,
                        text      : text,
                        style     : style ? 'style="' + style + '"' : ''
                    } )
                );
                // do add // won't work with chrome http://yuilibrary.com/projects/yui3/ticket/2529368 :(
                _pickerNode.one('table').append( _itemNode );

                if ( _pickerNode.all( 'td' ).size() == 1 ) {
                    _pickerNode.one( 'td' ).addClass( 'first' );
                }

                if ( lastItem ) {
                    _pickerNode.one( 'td' ).addClass( 'last' );
                }

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
                _itemId     = '#' + this.get( 'pickerClass' ) + '-row-' + name,
                _itemNode   = _contentBox.one( _itemId );

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

    // manage custom event
    Y.augment(Picker, Y.EventTarget);

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
    PICKER_TMPL += '<div class="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-selector">';
    PICKER_TMPL += '        <img class="{pickerClass}-selector-bg" src="{pickerDir}/picker-{pickerSize}.png" />';
    PICKER_TMPL += '      </div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-hue">';
    PICKER_TMPL += '        <img class="{pickerClass}-hue-bg" src="{pickerDir}/hue-{pickerSize}.png" />';
    PICKER_TMPL += '      </div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-slider {sliderSkin}"></div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-preview"></div>';
    PICKER_TMPL += '      <p>';
    PICKER_TMPL += '        <div class="{pickerClass}-rgb {pickerClass}-r"></div>';
    PICKER_TMPL += '        <div class="{pickerClass}-rgb {pickerClass}-g"></div>';
    PICKER_TMPL += '        <div class="{pickerClass}-rgb {pickerClass}-b"></div>';
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
            value : 'bewype-picker-color',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        pickerSize : {
            value : 180, /* can be 180 or 90 */
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

            // our custom event
            this.publish( 'picker:onChange' );
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
            _selectorNode = _contentBox.one( '.' + _pickerClass + '-selector' );
            Y.on( 'yui3-picker-event|click'    , Y.bind( this._onSelectorClick, this ) , _selectorNode );
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
            this._slider.render( _contentBox.one( '.' + _pickerClass + '-slider' ) );

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
            var _contentBox  = this.get( 'contentBox'  ),
                _pickerSize  = this.get( 'pickerSize'  ),
                _pClass      = this.get( 'pickerClass' ),
                _pickerClass = ( _pickerSize == 180 ) ? '.' + _pClass : '.' + _pClass + '-small',
                _pickernode  = _contentBox.one( _pickerClass );

            // little check
            if ( _pickernode ) {

                // remove events
                Y.detach( 'yui3-picker-event|click'     );
                Y.detach( 'yui3-picker-event|mousemove' );
                
                // remove main div
                _pickernode.remove();
            }
        },

        setValue : function( value ) {
            this._hexvalue = value;
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

        _onSelectorClick : function ( evt ) {

            // vars
            var _selectorNode = evt ? evt.target : null,
                _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),                
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small';

            // little check
            if ( !evt || _selectorNode.get( 'className' ) === _pickerClass + '-selector-bg') {
                // fire custom event
                this.fire("picker:onChange");
            }
        },

        _getNodePosition : function ( node, positionProperty ) {

            var _position = 0;                                

            while( node !== null ) {
                _position += node.get( positionProperty );
                node = node.get( 'offsetParent' );
            }

            return _position;
        },

        _onSelectorChange : function ( evt ) {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),  
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _targetNode   = evt ? evt.target : null,
                _pThreshO     = this.get( 'pickerThreshold' ),
                _value        = this._slider ? this._slider.getValue() : 0,
                _x            = 0,
                _y            = 0,
                _h            = 0,
                _s            = 0,
                _v            = 0,
                _rgb          = [],
                _bgVal        = '',
                _previewNode  = _contentBox.one( '.' + _pickerClass + '-preview' ),
                _rNode        = _contentBox.one( '.' + _pickerClass + '-r' ),
                _gNode        = _contentBox.one( '.' + _pickerClass + '-g' ),
                _bNode        = _contentBox.one( '.' + _pickerClass + '-b' );

            if ( _targetNode && _targetNode.get( 'className' ) === _pickerClass + '-selector-bg' ) {
                
				try {
					// get picker position
					_x = evt.pageX - _targetNode.getX();
					_y = evt.pageY - _targetNode.getY();
				} catch (e) {
				}

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

            if ( !evt || _targetNode.get( 'className' ) === _pickerClass + '-selector-bg') {

                _h   = ( 180 - _value ); /* compute hsv value */
                _s   = this._x / 180;
                _v   = ( 180 - this._y ) / 180;
                _rgb = Y.Bewype.Color.hsv2rgb( ( _h == 180 ) ? 0 : _h, _s, _v );   /* compute rgb       */

                // get hex value
                if ( evt || !this._hexvalue ) {
                    this._hexvalue = Y.Bewype.Color.rgb2hex( _rgb[0], _rgb[1], _rgb[2] );
                }

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
            var _contentBox   = this.get( 'contentBox' ),
                _pickerSize   = this.get( 'pickerSize'  ),
                _pClass       = this.get( 'pickerClass' ),
                _pickerClass  = ( _pickerSize == 180 ) ? _pClass : _pClass + '-small',
                _value           = evt ? evt.newVal : 0,
                _h            = ( 180 - _value ),
                _rgb          = Y.Bewype.Color.hsv2rgb( ( _h == 1 ) ? 0 : _h , 1, 1 ),
                _bgVal        = '',
                _selectorNode = _contentBox.one( '.' + _pickerClass + '-selector' );

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

    // manage custom event
    Y.augment( PickerColor, Y.EventTarget );

    Y.namespace('Bewype');
    Y.Bewype.PickerColor = PickerColor;




}, '@VERSION@' ,{requires:['bewype-color', 'slider', 'stylesheet', 'substitute', 'widget', 'yui-base']});

YUI.add('bewype-picker-file', function(Y) {


    /**
     *
     */
    var PICKER_TMPL = '',
        PickerFile  = function(config) {
        PickerFile.superclass.constructor.apply(this, arguments);
    };
    
    /**
     *
     */
    PICKER_TMPL += '<div class="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-label">File</div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <form enctype="multipart/form-data" >';
    PICKER_TMPL += '        <div>';
    PICKER_TMPL += '          <input class="{pickerClass}-input" type="file" name="file" />';
    PICKER_TMPL += '        <div>';
    PICKER_TMPL += '        <div>';
    PICKER_TMPL += '      </form>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '  </tr>';
    PICKER_TMPL += '</table></div>';

    /**
     */
    PickerFile.NAME = "pickerFile";

    /**
     *
     */
    PickerFile.ATTRS = {
        pickerClass : {
            value : 'bewype-picker-file',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        uploadUrl : {
            value : 'http://www.bewype.org/upload',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }                
        }
    };

    Y.extend( PickerFile, Y.Widget, {

        /**
         *
         */
        _fileInfo : null,

        /**
         *
         */
        _q : null,

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
                _pickerNode   = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass
                } )
            );
            _contentBox.append( _pickerNode );
        },

        bindUI : function () {
        },

        syncUI : function () {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerClass  = this.get( 'pickerClass' ),
                _inputNode    = null;

            // avoid previous value
            this._fileInfo = null;

            // set event callback
            _inputNode = _contentBox.one( '.' + _pickerClass + '-input' );

            //
            _inputNode.on( 'yui3-picker-event|change', Y.bind( this._onInputChange, this ) );

            // init q
            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function() {

            // tmp vars
            var _contentBox  = this.get( 'contentBox' ),
                _pickerNode  = _contentBox.one( '.' + this.get( 'pickerClass' ) );

            // little check
            if ( _pickerNode ) {

                // remove events
                Y.detach('yui3-picker-event|change');
                
                // remove main div
                _pickerNode.remove();
            }
        },

        getValue : function() {
            return this._fileInfo;
        },

        setValue : function( _fileInfo ) {
            this._fileInfo = _fileInfo;
        },

        _hideMessage : function ( msgNode ) {
            msgNode.remove();
        },

        _showMessage : function ( msg, error ) {

            // temp vars                           
            var _contentBox    = this.get( 'contentBox' ),
                _pickerForm    = _contentBox.one( 'form' ),
                _msgInner      = null,
                _msgClass      = this.get( 'pickerClass' ) + '-message',
                _errClass      = error ? 'error' : 'info',
                _msgNode       = _contentBox.one( '.' + _msgClass );

            // little check
            if ( !_pickerForm ) {
                return;
            }

            // remove previous message
            if ( _msgNode ) {
                _msgNode.remove();
            }
            
            // prepare message inner html
            _msgInner =  '<a class="';
            _msgInner += _msgClass;
            _msgInner += ' ';
            _msgInner += _msgClass + _errClass;
            _msgInner += '">';
            _msgInner += msg;
            _msgInner += '</a>';
            // create node
            _msgNode = new Y.Node.create( _msgInner );
            // add to dom
            _pickerForm.append( _msgNode );

            // stop first ( just in case )
            this._q.stop();

            // add clean cb
            this._q.add(
                { fn: function () {}, timeout: 1000 },
                { fn: this._hideMessage, args: [ _msgNode ] }
            );

            // restart
            this._q.run();
        },

        _doUpload : function () {

            // vars
            var _contentBox     = this.get( 'contentBox' ),
                _pickerForm     = _contentBox.one( 'form' ),
                _uploadUrl      = this.get( 'uploadUrl' ),
                _handleStart    = null,
                _handleComplete = null,
                _conf           = null,
                _request        = null;

    		//A function handler to use for successful requests:
	    	_handleStart = function( transactionid, args ) {
			    this._showMessage( 'Upload started...' );
            };

    		//A function handler to use for completed requests:
	    	_handleComplete = function( transactionid, response, args ) {
                if ( response.responseText === 'error' ) {  
                    // :(
    			    this._showMessage( 'Upload failed!', true );    
                } else {
                    // parse data
                    try {
                        // server should return some info for about the file it
                        // just receive, ex. for an image:
                        //  {
                        //      'contentType' : <image/png>,
                        //      'fileName'    : 'myFile.png',
                        //      'imgHeight'   : 20,
                        //      'imgWidth'    : 20
                        //  }
                        // ... in json string
                        this._fileInfo = Y.JSON.parse( response.responseText );
                        // :)
        			    this._showMessage( 'File successfully uploaded' );
                    } catch (e) {
                        // :(
        			    this._showMessage( 'Upload failed - Invalid Data!', true );
                    }                     
                    // fire custom event on success
                    this.fire("picker:onChange");
                }
            };
 
	    	//Subscribe our handlers to IO's global custom events:
		    Y.on('io:start',    Y.bind( _handleStart, this ) );
		    Y.on('io:complete', Y.bind( _handleComplete, this ) );
 
    		// Configuration object for POST transaction
	    	_conf = {
		    	method: 'POST',
    			form: { id : _pickerForm, upload: true },
            	headers: { 'Content-Type': 'multipart/form-data' }
		    };
 
            // do request
            _request = Y.io( _uploadUrl, _conf );
    	},

        _onInputChange : function ( evt ) {

            // vars
            var _inputNode   = evt ? evt.target : null;

            if ( _inputNode ) {
                this._doUpload();
            }
        }
    } );

    // manage custom event
    Y.augment( PickerFile, Y.EventTarget );

    Y.namespace('Bewype');
    Y.Bewype.PickerFile = PickerFile;




}, '@VERSION@' ,{requires:['async-queue', 'io', 'json-parse', 'stylesheet', 'substitute', 'widget', 'yui-base']});

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
            value : 'bewype-picker-font-size',
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

    Y.extend( PickerFontSize, Y.Bewype.Picker, {

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

            // add sizes
            Y.Object.each( this.get( 'fontSizes' ), function (v, k) {
                var _style = 'font-size: ' + v + 'px;';
                this.append( v,  v, _style);
            }, this );
        },

        /**
         *
         */
        getValue : function() {
            return this._currentName ? this._currentName + 'px' : null;
        },

        /**
         *
         */
        setValue : function( value ) {
            this._currentName = value ? value.replace( /px/i, '' ) : null;
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

        _currentFamilyName : null,

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

        _getFamilyName : function ( name ) {

            var _familyName = null;                         

            // get family
            Y.Object.each( this.get( 'fontFamilies' ), function ( v, k ) {
                if ( v[ 0 ] === name ) {
                    _familyName = v[ 1 ];
                }
            }, this );

            return _familyName;
        },

        /**
         *
         */
        getValue : function() {
            // return current or none
            return this._currentFamilyName;
        },

        setValue : function( value ) {
            // common use
            this._previousName = this._currentName;
            this._currentName = value;
            // specific for font family
            this._currentFamilyName = this._getFamilyName( this._currentName );                       
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerFontFamily = PickerFontFamily;




}, '@VERSION@' ,{requires:['bewype-picker-base']});

YUI.add('bewype-picker-text-align', function(Y) {


    var PickerTextAlign = function(config) {
        PickerTextAlign.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    PickerTextAlign.NAME = "pickerTextAlign";

    /**
     *
     */
    PickerTextAlign.ATTRS = {
        pickerClass : {
            value : 'bewype-picker-text-align',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        alignProps : {
            value : [ 'left', 'center', 'right' ],
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang. isArray( val );
            }
        }
    };

    Y.extend( PickerTextAlign, Y.Bewype.Picker, {

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

            // add sizes
            Y.Object.each( this.get( 'alignProps' ), function (v, k) {
                var _style = 'text-align: ' + v + ';',
                    _last  = k == ( this.get( 'alignProps' ).length - 1 );
                this.append( v,  v, _style, null, _last);
            }, this );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerTextAlign = PickerTextAlign;




}, '@VERSION@' ,{requires:['bewype-picker-base']});

YUI.add('bewype-picker-title', function(Y) {


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
                [ 'normal', 'Normal' ],
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
                var _text = !v[ 0 ] ? v[ 1 ] : '<' + v[ 0 ] + '>' + v[ 1 ] + '</' + v[ 0 ] + '>' ;
                // do add
                this.append( v[ 0 ], _text );
            }, this );
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.PickerTitle = PickerTitle;




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
    PICKER_TMPL += '<div class="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-label">Url</div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <input class="{pickerClass}-input" type="text" />';
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
            value : 'bewype-picker-url',
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
            // set value
            if ( this._url ) {
                _inputNode.set( 'value', this._url );
            }
            //
            _inputNode.on( 'yui3-picker-event|blur', Y.bind( this._onInputChange, this ) );
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

        setValue : function( url ) {
            this._url = url;
        },

        _onInputChange : function ( evt ) {

            // vars
            var _inputNode   = evt ? evt.target : null;

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



YUI.add('bewype-picker', function(Y){}, '@VERSION@' ,{use:['bewype-picker-base', 'bewype-picker-color', 'bewype-picker-file', 'bewype-picker-font-size', 'bewype-picker-font-family', 'bewype-picker-text-align', 'bewype-picker-title', 'bewype-picker-url']});

