
    /**
     *
     */
    var LayoutDesignerPlaces = function ( config ) {
        LayoutDesignerPlaces.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerPlaces.NAME  = 'layout-designer-places';

    LayoutDesignerPlaces.NS    = 'layoutDesignerPlaces';

    /**
     *
     */
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  =  '<table class="{designerClass}-places {designerClass}-places-horizontal">';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '<tr />';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '</table>';

    LayoutDesignerPlaces.V_PLACES_TEMPLATE  = '<table class="{designerClass}-places {designerClass}-places-vertical"></table>';

    LayoutDesignerPlaces.H_DEST_TEMPLATE    =  '<td class="{designerClass}-cell {designerClass}-cell-horizontal">';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '<div class="{designerClass}-container">';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '</div>';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '</td>';

    LayoutDesignerPlaces.V_DEST_TEMPLATE    =  '<tr class="{designerClass}-cell {designerClass}-cell-vertical">';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<td>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<div class="{designerClass}-container"></div>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</td>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</tr>';

    Y.extend( LayoutDesignerPlaces, Y.Bewype.LayoutDesignerConfig, {

        placesNode : null,

        contents   : null,
        
        sortable   : null,

        /**
         *
         */
        initializer: function ( config ) {

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host           = this.get( 'host'       ),
                _placesType     = this.get( 'placesType' ),
                _hTmpl          = LayoutDesignerPlaces.H_PLACES_TEMPLATE,
                _vTmpl          = LayoutDesignerPlaces.V_PLACES_TEMPLATE,
                _placesTempl    = ( _placesType === 'horizontal' ) ? _hTmpl : _vTmpl,
                _parentNode     = this.get( 'parentNode' );

            // add places
            this.placesNode = new Y.Node.create( Y.substitute( _placesTempl, {
                designerClass : this.get( 'designerClass' )
            } ) );

            // set place content
            _host.append(this.placesNode);

            // common default height/width
            this.placesNode.setStyle( 'height', this.get( 'contentHeight' ) );
            this.placesNode.setStyle( 'width' , this.get( 'contentWidth'  ) );

            // make it sortable
            this._initSortable();

            // register it
            if ( _parentNode ) {
                _parentNode.layoutDesignerPlaces.registerContent( _host );
            }
            this.contents = [];
        },

        _initSortable: function () {
            // get type                       
            var _placesType = this.get( 'placesType' ),
                _nodes = ( _placesType === 'horizontal' ) ? 'td' : 'tr';

            if ( this.sortable ) {
                this.sortable.destroy();
            }

            // make it sortable
            this.sortable = new Y.Sortable( {
                container   : this.placesNode,
                nodes       : _nodes,
                opacity     : '.2'
            } );

            // ... 
            Y.DD.DDM.on( 'drop:hit',   Y.bind( this._dropHitGotcha, this ), this.placesNode );
        },

        _dropHitGotcha : function ( evt ) {
            //
            var _dragNode           = evt.drag.get( 'node' ),
                _placesClass        = '.' + this.get( 'designerClass' ) + '-places',
                _containerClass     = '.' + this.get( 'designerClass' ) + '-container',
                _destNode           = _dragNode.one( _containerClass ),
                _contentNode        = _dragNode.one( _placesClass ) ? _destNode : _dragNode.one( _containerClass ),
                _contentWidth       = null,
                _parentHost         = null,
                _dropTable          = _destNode  ? _destNode.ancestor(  'table' ) : null,
                _dropPlaces         = _dropTable ? _dropTable.ancestor( 'div'   ).layoutDesignerPlaces : null,
                _finalPlaces        = null,
                _newDest            = null;

            if ( !_contentNode || !_dropPlaces ) {
                return;
            } else if ( _contentNode.layoutDesignerContent ) {
                _parentHost   = _contentNode.layoutDesignerContent.get( 'parentNode' );
                _contentWidth = _contentNode.layoutDesignerContent.getContentWidth();
            } else if ( _contentNode.layoutDesignerPlaces  ) {
                _parentHost   = _contentNode.layoutDesignerPlaces.get( 'parentNode' );
                _contentWidth = _contentNode.layoutDesignerPlaces.getPlacesWidth();
            } else {
                return;
            }

            if ( _parentHost.layoutDesignerPlaces != _dropPlaces ) {

                // remove from parent
                _parentHost.layoutDesignerPlaces.removeContent( _contentNode );

                // final places factory
                _finalPlaces = _dropPlaces.hasPlace( _contentWidth ) ? _dropPlaces : _parentHost.layoutDesignerPlaces;
                
                // get new dest node
                _newDest = _finalPlaces.addDestNode();
                _newDest.append( _contentNode );

                // and register it
                _finalPlaces.registerContent( _contentNode );

                // update parent node
                if ( _contentNode.layoutDesignerContent ) {
                    _contentNode.layoutDesignerContent.set( 'parentNode', _finalPlaces.get( 'host' ) );
                    _contentNode.layoutDesignerContent.refresh();
                } else {
                    _contentNode.layoutDesignerPlaces.set(  'parentNode', _finalPlaces.get( 'host' ) );
                    _finalPlaces.get( 'host' ).layoutDesignerTarget.refresh();
                }

                // and refresh old parent
                _parentHost.layoutDesignerTarget.refresh();
            }
        },

        /**
         *
         */
        destructor: function () {

            // copy contents
            var _host       = this.get( 'host' ),
                _parentNode = this.get( 'parentNode' );
            
            // first remove all the children
            Y.Object.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerPlaces ) {
                    v.layoutDesignerPlaces.destroy();
                } else {
                    this.removeContent( v );
                }
            }, this );

            // unregister it
            if ( _parentNode ) {
                _parentNode.layoutDesignerPlaces.unRegisterContent( _host );
            }

            // and remove host
            this.placesNode.remove();
        },

        /**
         *
         */
        hasSubPlaces : function () {
            var _has = false;
            Y.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerPlaces ) { _has = true; }
            } );
            return _has;
        },

        /**
         *
         */
        getAvailablePlace : function () {

            // get the target node
            var _parentNode = this.get( 'parentNode' ) || this.placesNode.ancestor( 'div' ),
                _pPlaces    = this.get( 'parentNode' ) ? _parentNode.layoutDesignerPlaces : null,
                _pWidth     = _pPlaces ? _pPlaces.getPlacesWidth() : Y.Bewype.Utils.getWidth( _parentNode ),
                _cWidth     = this.getPlacesWidth();

            // compute available place
            return _pWidth - _cWidth;
        },

        /**
         *
         */
        hasPlace : function ( contentWidth ) {

            // get the target node
            var _parentNode = this.get( 'parentNode' ) || this.placesNode.ancestor( 'div' ),
                _pWidth     = null,
                _cWidth     = null;

            // ensure content width
            contentWidth = contentWidth ? contentWidth : this.get( 'contentWidth' );
            
            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':
                    return true;

                case 'horizontal':
                    // get parent width
                    _pWidth = Y.Bewype.Utils.getWidth( _parentNode );
                    // get contents width
                    _cWidth = this.getPlacesWidth();
                    return _pWidth >= ( _cWidth + contentWidth );
            }
        },

        getPlacesWidth : function () {

            // result
            var _cWidth = 0;

            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':
                    Y.each( this.contents, function( v, k ) {
                        var _w = 0;
                        if ( v.layoutDesignerPlaces ) {
                            _w = v.layoutDesignerPlaces.getPlacesWidth();
                        } else {
                            _w = v.layoutDesignerContent.getContentWidth();
                        }
                        if ( _w > _cWidth ) { _cWidth = _w; }
                    } );
                    break;

                case 'horizontal':
                    Y.each( this.contents, function( v, k ) {
                        if ( v.layoutDesignerPlaces ) {
                            _cWidth += v.layoutDesignerPlaces.getPlacesWidth();
                        } else {
                            _cWidth += v.layoutDesignerContent.getContentWidth();
                        }
                    } );
                    break;
            }
            // return it
            return _cWidth;
        },

        getPlacesHeight : function () {
            
            // prepare result
            var _cHeight = 0;

            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':
                    Y.each( this.contents, function( v, k ) {
                        if ( v.layoutDesignerPlaces ) {
                            _cHeight += v.layoutDesignerPlaces.getPlacesHeight();
                        } else {
                            _cHeight += v.layoutDesignerContent.getContentHeight();
                        }
                    } );
                    break;

                case 'horizontal':
                    Y.each( this.contents, function( v, k ) {
                        var _h = 0;
                        if ( v.layoutDesignerPlaces ) {
                            _h = v.layoutDesignerPlaces.getPlacesHeight();
                        } else {
                            _h = v.layoutDesignerContent.getContentHeight();
                        }
                        if ( _h > _cHeight ) { _cHeight = _h; }
                    } );
                    // specific for horizontal
                    _cHeight = ( _cHeight === 0 ) ? this.get( 'contentHeight' ) : _cHeight;
                    break;
            }
            // return it
            return _cHeight;
        },

        /**
         *
         */
        refresh : function ( noParentRefresh ) {

            // get the target node
            var _placesType     = this.get( 'placesType' ),
                _placesHeight   = this.getPlacesHeight(),
                _placesWidth    = this.getPlacesWidth(),
                _parentNode     = this.get( 'parentNode' );

            _placesHeight = _placesHeight === 0 ? this.get( 'contentHeight' ) : _placesHeight;
            _placesWidth  = _placesWidth  === 0 ? this.getAvailablePlace()    : _placesWidth;

            this.placesNode.setStyle( 'height', _placesHeight );
            this.placesNode.setStyle( 'width' , _placesWidth  );

            // update target style
            switch( _placesType ) {

                case 'vertical':
                    //
                    Y.each( this.contents, function( v, k ) {
                        var _n = null;
                        if ( v.layoutDesignerPlaces ) {
                            _n = v.layoutDesignerPlaces.placesNode;
                            _n.setStyle( 'width' , _placesWidth  );
                        }
                    } );
                    break;

                case 'horizontal':
                    //
                    Y.each( this.contents, function( v, k ) {
                        var _n = null;
                        if ( v.layoutDesignerPlaces ) {
                            _n = v.layoutDesignerPlaces.placesNode;
                        } else {
                            _n = v.layoutDesignerContent.get( 'host' );
                        }
                        _n.ancestor( 'td' ).setStyle( 'height' , _placesHeight );
                        _n.ancestor( 'td' ).setStyle( 'vertical-align', 'top' );
                    } );
                    break;
            }

            // and refresh parent
            if ( !noParentRefresh ) {
                if ( _parentNode ) {
                    _parentNode.layoutDesignerTarget.refresh();
                } else {
                    this.placesNode.ancestor( 'div' ).setStyle( 'height', _placesHeight );
                }
            }

            // ...
            return [ _placesHeight, _placesWidth ];
        },

        /**
         *
         */
        cleanContentOver : function () {
            // hide all
            Y.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerContent ) {
                    v.layoutDesignerContent._q.stop();
                    v.layoutDesignerContent.hideClone();
                }
            } );
        },

        /**
         *
         */
        addDestNode : function () {

            // little check
            if ( !this.hasPlace() ) { return null; }

            var _destNode   = null,
                _tr         = this.placesNode.one('tr');

            // add
            switch( this.get( 'placesType' ) ) {

                case 'horizontal':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.H_DEST_TEMPLATE, {
                        designerClass : this.get( 'designerClass' )
                    } ) );

                    // dom add
                    _tr.append( _destNode );
                    break;

                case 'vertical':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.V_DEST_TEMPLATE, {
                        designerClass : this.get( 'designerClass' )
                    } ) );

                    // dom add
                    this.placesNode.append( _destNode );
                    break;
            }

            // return it
            return _destNode.one('div');
        },

        /**
         *
         */
        registerContent : function ( content ) {

            // add to contents
            this.contents.push( content );
        },

        /**
         *
         */
        unRegisterContent : function ( content ) {

            // get content position
            var _i = this.contents.indexOf( content );

            // little check
            if ( _i != -1 ) {
                // do remove
                this.contents.splice( _i, 1 );
            }
        },

        /**
         *
         */
        addContent : function ( contentType ) {

            // little check
            if ( !this.hasPlace() ) { return null; }

            // add dest node
            var _destNode    = this.addDestNode(),
                _pluginClass = null,
                _config     = this.getAttrs();

            // prepare config
            _config.contentType  = contentType;
            _config.parentNode   = this.get( 'host' );
            // set max available width
            _config.contentWidth = this.getAvailablePlace();

            // content type factory
            switch( contentType ) {
                case 'text':
                    _pluginClass = Y.Bewype.LayoutDesignerContentText;
                    break;
                case 'image':
                    _pluginClass = Y.Bewype.LayoutDesignerContentImage;
                    break;
                default:
                    return;
            }

            // plug node
            _destNode.plug( _pluginClass, _config );
        },

        /**
         *
         */
        removeContent: function ( contentNode ) {

            // get dest node        
            var _destNode   = null,
                _host       = this.get( 'host' );

            switch( this.get( 'placesType' ) ) {

                case 'horizontal':
                    // get parent td
                    _destNode = contentNode.ancestor( 'td' );
                    break;

                case 'vertical':
                    // get parent tr
                    _destNode = contentNode.ancestor( 'tr' );
                    break;
            }

            // unregister
            this.unRegisterContent( contentNode );

            // then remove dest node
            _destNode.remove();

            // and refresh
            _host.layoutDesignerTarget.refresh();
        },

        getContents : function () {

            // result list
            var _contents = [];                          
            
            // get all contents
            Y.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerPlaces ) {
                    _contents = _contents.concat( v.layoutDesignerPlaces.getContents() );
                } else {
                    _contents.push( v );
                }
            } );

            // return all
            return _contents;
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerPlaces = LayoutDesignerPlaces;

