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
        initializer: function( config ) {

            // ??
            this.setAttrs( config );

            // temp vars
            var _host          = this.get( 'host' ),
                _type          = this.get( 'targetType' ),
                _designerClass = this.get( 'designerClass' ),
                _targetClass   = _designerClass + '-target',
                _children      = _host.get( 'children' ),
                _placesNode    = _children ? _children.item( 0 ) : null,
                _innerNode     = null;

            if ( _type !== 'start' || _placesNode ) {
                // prepare config
                config.targetType = null;
                // on start load found type
                if ( _placesNode ) {                    
                    if ( _placesNode.hasClass( _designerClass + '-places-vertical' ) ) {                    
                        config.placesType = 'vertical';
                    } else {
                        config.placesType = 'horizontal';
                    }
                // use passed type
                } else {
                    config.placesType = _type;
                }
                // override starting type
                this.set( 'targetType', config.placesType );
                _type = config.placesType;
                // plug places
                _host.plug( Y.Bewype.LayoutDesignerPlaces, config );
            }

            // add target
            this._targetNode = new Y.Node.create( '<div class="' + _targetClass + ' ' + _targetClass + '-' + _type + '" />' );
            _host.append( this._targetNode );

            // add target
            _innerNode = new Y.Node.create( '<div class="' + _targetClass + ' ' + _targetClass + '-inner" />' );
            this._targetNode.append( _innerNode );
            
            Y.Object.each( this._getTargetActions(), function ( v, k ) {
                this._addTargetAction( _innerNode, v );
            }, this );
        },

        /**
         *
         */
        destructor: function () {

            // get host
            var _host = this.get( 'host' );

            // remove actions and inner
            Y.Object.each( this._getTargetActions(), function ( v, k ) {
                this._removeTargetAction( v );
            }, this );

            // clean events
            this._targetNode.remove();

            // destroy plugins
            if ( _host.layoutDesignerPlaces ) {
                // unplug
                _host.unplug( Y.Bewype.LayoutDesignerPlaces );
            }
        },

        _addPlaces : function ( action ) {

            // temp vars
            var _host       = this.get( 'host' ),
                _parentNode = this.get( 'parentNode' ),
                _targetType = this.get( 'targetType' ),
                _addType    = action === 'column' ? 'vertical' : 'horizontal',
                _destNode   = null,
                _config     = this.getAttrs(),
                _places     = _host.layoutDesignerPlaces,
                _forceWidth = _places ? _places.getMaxWidth() : Y.Bewype.Utils.getWidth( _host );

            // specific for text or image .. nothing to do ..
            if ( _targetType === 'start' ) {
                // destroy plugins of the current host
                _host.unplug( Y.Bewype.LayoutDesignerTarget );
                _host.unplug( Y.Bewype.LayoutDesignerPlaces );
            } else if ( !_places ) {
                return; // ??
            }

            // get dest node
            _destNode = _targetType === 'start' ? _host : _places.addDestNode();

            // prepare config
            _config.targetType = _addType;
            _config.parentNode = _targetType === 'start' ? null : _host;

            // plug target
            _destNode.plug( Y.Bewype.LayoutDesignerTarget, _config );
            if ( _places ) {
                _places.registerContent( _destNode );
            }

            // refresh at start
            this.refresh( _forceWidth );
        },

        _onClickRemove: function () {

            // temp vars
            var _host       = this.get( 'host' ),
                _parentNode = this.get( 'parentNode' ),
                _placesType = _host.layoutDesignerPlaces.get( 'placesType' ),
                _config     = null;
            
            // destroy plugins
            _host.unplug( Y.Bewype.LayoutDesignerTarget );
            // remove dom node too
            _host.one( 'table' ).remove();

            // restore start target if necessary
            if ( _parentNode ) {

                // unregister
                _parentNode.layoutDesignerPlaces.unRegisterContent( _host );
                // then remove dest node
                _host.remove( true );
                // do refresh after
                _parentNode.layoutDesignerTarget.refresh();

            } else {

                // prepare config
                _config            = this.getAttrs();
                _config.targetType = 'start';
                // plug start target
                _host.plug( Y.Bewype.LayoutDesignerTarget, _config );
            }
        },

        _onClickAction : function ( action, evt ) {
            // action factory                             
            switch( action ) {
                case 'column':
                case 'row':
                    return this._addPlaces( action );

                case 'text':
                case 'image':
                    var _host       = this.get( 'host' ),
                        _forceWidth = _host.layoutDesignerPlaces.getMaxWidth();
                    // do add
                    _host.layoutDesignerPlaces.addContent( action );
                    // refresh
                    return this.refresh( _forceWidth );

                case 'remove':
                    return this._onClickRemove();
                
                default:
                    break; // ???
            }
        },

        _getTargetActions : function () {

            switch( this.get( 'targetType' ) ) {

                case 'start':
                    return this.get( 'targetStartActions' );

                case 'horizontal':
                    return this.get( 'targetHorizontalActions' );

                case 'vertical':
                    return this.get( 'targetVerticalActions' );
                
                default:
                    break; // ???
            }
        },

        _addTargetAction : function ( innerNode, action ) {

            // temp vars
            var _actionClass = this.get( 'designerClass' ) + '-target-action',
                _actionNode  = innerNode.one( 'div.' + _actionClass + '-' + action );

            // render action button
            if ( _actionNode ) {
                _actionNode.setStyle( 'display', 'block' );
            } else {
                // add cb div
                _actionNode = new Y.Node.create( '<div class="' + _actionClass + ' ' + _actionClass + '-' + action + '" />' );
                // add to target
                innerNode.append( _actionNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickAction, this, action ), _actionNode );
            }
        },

        _removeTargetAction : function ( action ) {

            // temp vars
            var _actionClass = this.get( 'designerClass' ) + '-target-action',
                _actionNode  = this.get( 'host' ).one( 'div.' + _actionClass + '-' + action );

            // render action button
            if ( _actionNode ) {
                _actionNode.detachAll( 'click' );
                _actionNode.remove();
            }
        },

        refresh : function ( forcedWidth ) {

            // tmp vars
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' ) || _host;
            
            // refresh corresponding places first
            if (_host.layoutDesignerPlaces) {
                // refresh place node only
                _host.layoutDesignerPlaces.refresh( forcedWidth );
            } else {
                return;
            }

            if ( _parentNode.layoutDesignerTarget && _parentNode != _host && !forcedWidth ) {
                _parentNode.layoutDesignerTarget.refresh();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerTarget = LayoutDesignerTarget;



}, '@VERSION@' ,{requires:['bewype-layout-designer-places']});
