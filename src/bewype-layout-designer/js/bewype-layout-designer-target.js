
    /**
     *
     */
    var LayoutDesignerTarget = function ( config ) {
        LayoutDesignerTarget.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerTarget.NAME  = 'layout-designer-target';

    LayoutDesignerTarget.NS    = 'layoutDesignerTarget';

    LayoutDesignerTarget.ATTRS = {
        designerClass : {
            value : 'layout-designer',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetOverHeight : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetMinHeight : {
            value : 8,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetOverWidth : {
            value : 20,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetMinWidth : {
            value : 8,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        targetType : {
            value : 'vertical',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetZIndex : {
            value : 1,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentWidth : {
            value : 140,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentZIndex : {
            value : 1,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        defaultContent : {
            value : 'Text..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        layoutWidth : {
            value : 600,
            setter : '_setLayoutWidth',
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        baseNode : {
            value : null,
            writeOnce : true
        },
        parentNode : {
            value : null
        }
    };

    Y.extend( LayoutDesignerTarget, Y.Plugin.Base, {

        /**
         *
         */
        _targetNode: null,

        /**
         *
         */
        _dd : null,

        /**
         *
         */
        _groups : [ 'horizontal', 'vertical', 'text', 'image' ],

        /**
         *
         */
        initializer: function( config ) {

            // temp vars
            var _host  = this.get( 'host'       ),
                _type  = this.get( 'targetType' ),
                _class = this.get( 'designerClass' ) + '-target',
                _layoutWidth     = this.get( 'layoutWidth'     ),
                _targetMaxHeight = this.get( 'contentHeight'   ),
                _targetMaxWidth  = this.get( 'contentWidth'    ),
                _targetMinHeight = this.get( 'targetMinHeight' ),
                _targetMinWidth  = this.get( 'targetMinWidth'  ),
                _width           = null;

            // add target
            this._targetNode = new Y.Node.create(
                    '<div class="' + _class + ' ' + _class + '-' + _type + '" />' );
            _host.append( this._targetNode );

            //
             if ( _type === 'vertical' || _type === 'start' ) {

                // depends if first or not
                _width = _host.ancestor( 'table' ) ? _targetMaxWidth : _layoutWidth;

                // set size
                this._targetNode.setStyle( 'height', _targetMinHeight );
                this._targetNode.setStyle( 'width',  _width  );

            } else if ( _type === 'horizontal' ) {

                // set size
                this._targetNode.setStyle( 'height', _targetMaxHeight );
                this._targetNode.setStyle( 'width',  _targetMinWidth  );

            } else {

                return; // ??

            }

            // upper all
            this._targetNode.setStyle( 'z-index',  this.get( 'targetZIndex' ) );

            // init start drop
            this._dd = new Y.DD.Drop( {
                node    : this._targetNode,
                groups  : this._groups,
                target  : true,
                after   : {
                    'drop:enter': Y.bind( this._onDropEnter,   this ),
                    'drop:hit'  : Y.bind( this._onDropHit,     this ),
                    'drop:exit' : Y.bind( this._afterDropExit, this )
                }
            } );             

            if ( _type != 'start' ) {
                // set event management
                Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ), this._targetNode );
                Y.on( 'mouseleave', Y.bind( this._onMouseLeave, this ), this._targetNode );
            }
        },

        /**
         *
         */
        destructor: function () {

            // get host
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' ),
                _removeNode = this._targetNode.one( 'div' );

            // destroy plugins
            if ( _host.layoutDesignerPlaces ) {
                _host.unplug( Y.Bewype.LayoutDesignerPlaces );
            }
            
            // detatch dd events
            this._dd.detachAll( 'drop:enter' );
            this._dd.detachAll( 'drop:hit'   );
            this._dd.detachAll( 'drop:exit'  );

            if ( _removeNode ) {
                _removeNode.detachAll( 'click' );
            }

            // clean events
            this._targetNode.detachAll( 'mouseenter' );
            this._targetNode.detachAll( 'mouseleave' );
            this._targetNode.remove();


            // restore start target if necessary
            if ( _parentNode ) {

                // refresh parent
                _parentNode.layoutDesignerTarget.refresh();

            } else {

                // set start div size
                _host.setStyle( 'height' , this.get( 'targetMinHeight' ) );

                // add start target
                this._addTarget( _host, 'start' );
            }
        },

        _onDropEnter : function ( evt ) {

            // update target style
            switch( this.get( 'targetType' ) ) {

                case 'start':
                case 'vertical':
                    this._targetNode.setStyle( 'height', this.get( 'contentHeight' ) );
                    break;

                case 'horizontal':
                    // set enter width
                    this._targetNode.setStyle( 'width',  this.get( 'contentWidth'  ) );
                    break;
            }

            // keep default position
            this.refresh( evt );
        },

        _afterDropExit : function ( evt ) {

            // update target style
            switch( this.get( 'targetType' ) ) {

                case 'start':
                case 'vertical':
                    this._targetNode.setStyle( 'height', this.get( 'targetMinHeight' ) );
                    break;

                case 'horizontal':
                    this._targetNode.setStyle( 'width',  this.get( 'targetMinWidth'  ) );
                    break;
            }

            // keep default position
            this.refresh( evt );
        },

        _onClickRemove: function ( evt ) {

            // temp vars
            var _host     = this.get( 'host' );
            
            // and destroy itself
            _host.unplug( Y.Bewype.LayoutDesignerTarget );

            // restore start target if necessary
            if ( !this.get( 'parentNode' ) ) {

                // set start div size
                _host.setStyle( 'height' , this.get( 'targetMinHeight' ) );

                // add start target
                this._addTarget( _host, 'start' );
            }
        },

        /**
         *
         */
        _onMouseEnter: function ( evt ) {

            // temp vars
            var _type  = this.get( 'targetType'    ),
                _class = this.get( 'designerClass' ) + '-target',
                _removeNode  = this._targetNode.one( 'div' );

            // update target style
            switch( _type ) {

                case 'start':
                case 'vertical':
                    this._targetNode.setStyle( 'height', this.get( 'targetOverHeight' ) );
                    break;

                case 'horizontal':
                    // set enter width
                    this._targetNode.setStyle( 'width',  this.get( 'targetOverWidth'  ) );
                    break;
            }

            // render remove button
            if ( _removeNode ) {
                _removeNode.setStyle( 'display', 'block' );
            } else {
                // add cb div
                _removeNode = new Y.Node.create(
                        '<div class="' + _class + '-remove ' + _class + '-' + _type + '-remove" />' );
                // add to clone
                this._targetNode.append( _removeNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );
            }

            // keep default position
            this.refresh( evt );
        },

        /**
         *
         */
        _onMouseLeave: function ( evt ) {

            // hide remove node
            var _removeNode = this._targetNode.one( 'div' );
            _removeNode.setStyle( 'display', 'none' );

            // restore default value
            this._afterDropExit( evt );
        },

        _addPlaces : function ( destNode, type ) {

            // temp vars
            var _host = this.get( 'host' ),
                _parentNode = ( destNode.ancestor( 'td' ) ) ? _host : null;

            // plug places
            destNode.plug( Y.Bewype.LayoutDesignerPlaces, {
                placesMinHeight : this.get( 'targetMinHeight' ),
                placesMinWidth  : this.get( 'targetMinWidth'  ),
                contentHeight   : this.get( 'contentHeight'   ),
                contentWidth    : this.get( 'contentWidth'    ),
                contentZIndex   : this.get( 'contentZIndex'   ),
                defaultContent  : this.get( 'defaultContent'  ),
                designerClass   : this.get( 'designerClass'   ),
                placesType      : type,
                baseNode        : this.get( 'baseNode'        ),
                parentNode      : _parentNode
            } );
        },

        _addTarget : function ( destNode, type ) {

            // temp vars
            var _host = this.get( 'host' ),
                _parentNode = ( destNode.ancestor( 'td' ) ) ? _host : null;

            // plug target
            destNode.plug( Y.Bewype.LayoutDesignerTarget, {
                targetOverHeight : this.get( 'targetOverHeight' ),
                targetMinHeight  : this.get( 'targetMinHeight'  ),
                targetOverWidth  : this.get( 'targetOverWidth'  ),
                targetMinWidth   : this.get( 'targetMinWidth'   ),
                contentHeight    : this.get( 'contentHeight'    ),
                contentWidth     : this.get( 'contentWidth'     ),
                contentZIndex    : this.get( 'contentZIndex'    ),
                defaultContent   : this.get( 'defaultContent'   ),
                designerClass    : this.get( 'designerClass'    ),
                targetType       : type,
                baseNode         : this.get( 'baseNode'         ),
                parentNode       : _parentNode
            } );
        },

        _getHitType : function ( evt ) {

            // temp var
            var _drag = evt.drag;
            
            // places/target factory
            if ( _drag._groups.vertical ) {

                return 'vertical';

            } else if ( _drag._groups.horizontal ) {

                return 'horizontal';

            } else if ( _drag._groups.text ) {

                return 'text';

            }  else if ( _drag._groups.image ) {

                return 'image';

            } else {

                return null;

            }
        },

        _onDropHitStart : function ( evt ) {

            // get hitType
            var _hitType = this._getHitType( evt ),
                _host = this.get( 'host' );

            // specific for text or image .. nothing to do ..
            if ( _hitType === 'text' || _hitType === 'image' ) { return this._afterDropExit( evt ); }

            // destroy plugins
            _host.unplug( Y.Bewype.LayoutDesignerTarget );

            // add places and target
            this._addPlaces( _host, _hitType );
            this._addTarget( _host, _hitType );
            
            // refresh parent
            _host.layoutDesignerTarget.refresh();
        },

        _onDropHitHorizontal : function ( evt ) {

            // temp vars
            var _host       = this.get( 'host' ),
                _hitType    = this._getHitType( evt ),
                _destNode   = null;

            if ( _hitType === 'vertical' ) {
                // add dest node
                _destNode = _host.layoutDesignerPlaces.addDestNode();
                // add places and target
                this._addPlaces( _destNode, _hitType );
                this._addTarget( _destNode, _hitType );
                // refresh dest node
                _destNode.layoutDesignerTarget.refresh();
            } else {
                // default: add content text or image
                _host.layoutDesignerPlaces.addContent( _hitType );
            }
            
            // restore width
            this._afterDropExit( evt );
        },

        _onDropHitVertical : function ( evt ) {

            // temp vars
            var _host       = this.get( 'host' ),
                _hitType    = this._getHitType( evt ),
                _destNode   = null;

            if ( _hitType === 'horizontal' ) {
                // add dest node
                _destNode = _host.layoutDesignerPlaces.addDestNode();
                // add places and target
                this._addPlaces( _destNode, _hitType );
                this._addTarget( _destNode, _hitType );
                // refresh dest node
                _destNode.layoutDesignerTarget.refresh();
            } else {
                // add content text or image
                _host.layoutDesignerPlaces.addContent( _hitType );
            }
            
            // restore width
            this._afterDropExit( evt );
        },

        _onDropHit : function ( evt ) {

            // hit factory
            switch( this.get( 'targetType' ) ) {

                case 'start':
                    return this._onDropHitStart( evt );

                case 'horizontal':
                    return this._onDropHitHorizontal( evt );

                case 'vertical':
                    return this._onDropHitVertical( evt );
            }
        },

        refresh : function () {

            // tmp vars
            var _host       = this.get( 'host'       ),
                _type       = this.get( 'targetType' ),
                _HW         = null,
                _pHeight    = null,
                _pWidth     = null,
                _hHeight    = null,
                _hWidth     = null,
                _parentNode = null;
            
            // refresh corresponding places first
            if (_host.layoutDesignerPlaces) {
                // refresh place node only
                _HW = _host.layoutDesignerPlaces.refresh();
            } else {
                return;
            }

            // get places size
            _pHeight = _HW[ 0 ];
            _pWidth  = _HW[ 1 ];

            // get host size
            _hHeight = Y.Bewype.Utils.getHeight( this._targetNode );
            _hWidth  = Y.Bewype.Utils.getWidth(  this._targetNode );

            // update position
            _parentNode = this._targetNode.ancestor( 'td' ) || this._targetNode.ancestor( 'div' );
            // update target style
            switch( _type ) {

                case 'vertical':
                    // set host position
                    _pHeight  = Y.Bewype.Utils.getHeight( _parentNode );
                    // this._targetNode.setY( _parentNode.getY() + _pHeight - _hHeight );

                    // set host position
                    if ( _parentNode.get( 'tagName' ).toLowerCase() === 'div') {
                        this._targetNode.setY( _parentNode.getY() + _pHeight - _hHeight );
                    } else {
                        this._targetNode.setStyle( 'position', 'absolute');
                        this._targetNode.setStyle( 'bottom', 0 );
                    }
                    // always set width
                    this._targetNode.setStyle( 'width' , _pWidth );
                    break;

                case 'horizontal':
                    // etbi way
                    // _host.setX( _parentNode.getX() + _pWidth );
                    // magic way
                    _pWidth  = Y.Bewype.Utils.getWidth( _parentNode );
                    this._targetNode.setX( _parentNode.getX() + _pWidth - _hWidth );

                    // set host position
                    if ( _parentNode.get( 'tagName' ).toLowerCase() === 'div') {
                        this._targetNode.setY( _parentNode.getY() );
                    } else {
                        this._targetNode.setStyle( 'position', 'absolute');
                        this._targetNode.setStyle( 'bottom', 0 );
                    }
                    // always set height
                    this._targetNode.setStyle( 'height' , _pHeight );
                    break;
            }

            _parentNode = _host.layoutDesignerPlaces.get( 'parentNode' );
            if ( _parentNode ) {
                _parentNode.layoutDesignerTarget.refresh();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerTarget = LayoutDesignerTarget;

