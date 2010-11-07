YUI.add('bewype-layout-designer-target', function(Y) {


    /**
     *
     */
    var LayoutDesignerTarget = function ( config ) {
        LayoutDesignerTarget.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerTarget.NAME  = 'layout-designer-target';

    LayoutDesignerTarget.NS    = 'layoutDesignerTarget';

    Y.extend( LayoutDesignerTarget, Y.Bewype.LayoutDesignerConfig, {

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

            // ??
            this.setAttrs( config );

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
            this.refresh();
        },

        _afterDropExit : function ( evt, forceWidth ) {

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
            this.refresh( forceWidth );
        },

        _onClickRemove: function ( evt ) {

            // temp vars
            var _host = this.get( 'host' );
            
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
            this.refresh();
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
            var _host       = this.get( 'host' ),
                _targetType = this.get( 'targetType' ),
                _config     = this.getAttrs();

            // prepare config
            _config.placesType = type;
            _config.parentNode = ( _targetType === 'start' || type === 'start' ) ? null : _host;

            // plug places
            destNode.plug( Y.Bewype.LayoutDesignerPlaces, _config );
        },

        _addTarget : function ( destNode, type ) {

            // temp vars
            var _host       = this.get( 'host'       ),
                _targetType = this.get( 'targetType' ),
                _config     = this.getAttrs();

            // prepare config
            _config.targetType = type;
            _config.parentNode = ( _targetType === 'start' || type === 'start' ) ? null : _host;

            // plug target
            destNode.plug( Y.Bewype.LayoutDesignerTarget, _config );
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

        _onDropHit : function ( evt ) {

            // get hitType
            var _host       = this.get( 'host' ),
                _targetType = this.get( 'targetType' ),
                _hitType    = this._getHitType( evt ),
                _destNode   = null,
                _pl         = _host.layoutDesignerPlaces,
                _forceWidth = null;

            // specific for text or image .. nothing to do ..
            if ( _targetType === 'start' ) {
                // do not manage content at start
                if ( _hitType === 'text' || _hitType === 'image' ) {
                    return this._afterDropExit( evt );
                }
                // destroy plugins to add places
                _host.unplug( Y.Bewype.LayoutDesignerTarget );
            }

            if ( _hitType === _targetType ) {

                // do nothing
                return;

            } else if ( _hitType === 'start' || _hitType === 'horizontal' || _hitType === 'vertical' ) {
                // has place?
                if ( _pl ) {
                    _forceWidth  = _pl.getMaxWidth();
                }
                // get dest node
                _destNode = _targetType === 'start' ? _host : _pl.addDestNode();
                // add places and target
                this._addPlaces( _destNode, _hitType );
                this._addTarget( _destNode, _hitType );
                // refresh dest node
                if ( _hitType !== 'start' ) {
                    _destNode.layoutDesignerTarget.refresh();
                }
            } else {
                // default: add content text or image
                _forceWidth = _pl.addContent( _hitType );
            }

            // restore width
            this._afterDropExit( evt, _forceWidth );
        },

        refresh : function ( forcedWidth ) {

            // tmp vars
            var _host       = this.get( 'host'       ),
                _type       = this.get( 'targetType' ),
                _parentNode = this.get( 'parentNode' ) || _host,
                _HW         = null,
                _pHeight    = null,
                _pWidth     = null,
                _hHeight    = null,
                _hWidth     = null,
                _cellNode   = null;
            
            // refresh corresponding places first
            if (_host.layoutDesignerPlaces) {
                // refresh place node only
                _HW = _host.layoutDesignerPlaces.refresh( forcedWidth );
            } else {
                return;
            }

            // get places size
            _pHeight = _HW[ 0 ];
            _pWidth  = _HW[ 1 ];

            // get host size
            _hHeight = Y.Bewype.Utils.getHeight( this._targetNode );
            _hWidth  = Y.Bewype.Utils.getWidth(  this._targetNode );

            // ...
            _cellNode = this._targetNode.ancestor( 'div' );
            // update target style
            switch( _type ) {

                case 'vertical':
                    // set host position
                    _pHeight  = Y.Bewype.Utils.getHeight( _parentNode );

                    // set host position
                    if ( _parentNode == _host ) {
                        this._targetNode.setY( _parentNode.getY() + _pHeight - _hHeight );
                    } else {
                        this._targetNode.setStyle( 'position', 'absolute');
                        this._targetNode.setStyle( 'bottom', 0 );
                    }
                    // always set width
                    this._targetNode.setStyle( 'width' , _pWidth );
                    break;

                case 'horizontal':
                    // magic way
                    _pWidth  = Y.Bewype.Utils.getWidth( _parentNode );
                    this._targetNode.setX( _parentNode.getX() + _pWidth - _hWidth );

                    // set host position
                    if ( _parentNode == _host ) {
                        this._targetNode.setY( _parentNode.getY() );
                    } else {
                        this._targetNode.setStyle( 'position', 'absolute');
                        this._targetNode.setStyle( 'bottom', 0 );
                    }
                    // always set height
                    this._targetNode.setStyle( 'height' , _pHeight );
                    break;

                default:
                    return;
            }

            if ( _parentNode != _host && !forcedWidth ) {
                _parentNode.layoutDesignerTarget.refresh();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerTarget = LayoutDesignerTarget;



}, '@VERSION@' ,{requires:['bewype-layout-designer-places']});
