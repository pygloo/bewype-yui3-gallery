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
