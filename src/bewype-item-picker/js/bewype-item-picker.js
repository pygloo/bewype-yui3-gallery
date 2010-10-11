
    /**
     *
     */
    var PICKER_TMPL = '',
        ITEM_TMPL = '',
        ItemPicker  = null;
    
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

    ItemPicker = function(config) {
        ItemPicker.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    ItemPicker.NAME = "itemPicker";

    /**
     * 
     */
    ItemPicker.NS = "itemPicker";

    /**
     *
     */
    ItemPicker.ATTRS = {
        pickerClass : {
            value : 'item-picker',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( ItemPicker, Y.Widget, {

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
                Y.detach('bewype-item-pickers|click');
    
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
                        style     : style ? 'style="font-family: ' + style + ';"' : ''
                    } )
                );
                // do add
                _pickerNode.one('table').append( _itemNode );

                // add on click event
                Y.on( 'bewype-item-picker|click', Y.bind( this._onItemClick, this, name ), _itemNode );
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
    Y.Bewype.ItemPicker = ItemPicker;

