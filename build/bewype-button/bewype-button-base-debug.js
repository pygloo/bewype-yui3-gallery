YUI.add('bewype-button-base', function(Y) {


    /**
     *
     */
    var BUTTON_TMPL = '',
        LABEL_TMPL  = '',
        IMAGE_TMPL  = '',
        Button      = null;
    
    /**
     *
     */
    BUTTON_TMPL += '<div class="{buttonClass}">';
    BUTTON_TMPL += '</div>';

    /**
     *
     */
    LABEL_TMPL += '<div class="{buttonClass}-label">';
    LABEL_TMPL += '  {label}';
    LABEL_TMPL += '</div>';

    /**
     *
     */
    IMAGE_TMPL += '<div class="{buttonClass}-image">';
    IMAGE_TMPL += '  <img src="{imageUrl}" />';
    IMAGE_TMPL += '</div>';

    Button = function(config) {
        Button.superclass.constructor.apply( this, arguments );
    };

    /**
     */
    Button.NAME = "button";

    /**
     * 
     */
    Button.NS = "button";

    /**
     *
     */
    Button.ATTRS = {
        buttonClass : {
            value : 'yui3-button-base',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        label : {
            value : null,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        imageUrl : {
            value : null,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        width : {
            value : 80,
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( Button, Y.Widget, {

        _init : function ( config ) {

            // our custom event
            this.publish( 'button:onClick' );

            // our custom event
            this.publish( 'button:onChange' );
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
                _buttonClass = this.get( 'buttonClass' ),
                _label       = this.get( 'label'       ),
                _imageUrl    = this.get( 'imageUrl'    ),
                _buttonNode  = null,
                _labelNode   = null,
                _imageNode   = null;

            // create table
            _buttonNode = new Y.Node.create(
                Y.substitute( BUTTON_TMPL, {
                    buttonClass : _buttonClass
                } )
            );
            _contentBox.append( _buttonNode );

            // add label
            if ( _label ) {
                _labelNode = new Y.Node.create(
                    Y.substitute( LABEL_TMPL, {
                        buttonClass : _buttonClass,
                        label       : _label
                    } )
                );
                _buttonNode.append( _labelNode );
            }

            // add image
            if ( _imageUrl ) {
                _imageNode = new Y.Node.create(
                    Y.substitute( IMAGE_TMPL, {
                        buttonClass : _buttonClass,
                        imageUrl    : _imageUrl
                    } )
                );
                _buttonNode.append( _imageNode );
            }

            // set handler
            _buttonNode.on( 'yui3-button-event|click' , Y.bind( this._onClick, this ) );
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
        _destroyBase : function () {

            // vars
            var _contentBox  = this.get( 'contentBox'  ),
                _buttonNode  = _contentBox.one( 'div' );

            // little check
            if ( _buttonNode ) {
                
                // remove events
                Y.detach('yui3-button-event|click');
    
                // remove nodes
                _buttonNode.remove();
            }
        },

        /**
         *
         */
        destructor : function () {
            this._destroyBase();
        },

        /**
         *
         */
        _onClick : function ( evt ) {

            // vars
            var _itemNode   = evt ? evt.target : null;

            // little check
            if (_itemNode) {

                // fire custom event
                this.fire("button:onClick");
            }
        },

        /**
         *
         */
        getValue : function () {
            return null;
        }

    } );

    // manage custom event
    Y.augment(Button, Y.EventTarget);

    Y.namespace('Bewype');
    Y.Bewype.Button = Button;



}, '@VERSION@' ,{requires:['stylesheet', 'substitute', 'widget', 'yui-base']});
