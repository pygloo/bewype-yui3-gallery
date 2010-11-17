
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
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  =  '<table class="{designerClass}-places ';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '{designerClass}-places-horizontal ';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '{designerClass}-places-{placesLevel}">';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '<tr />';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '</table>';

    LayoutDesignerPlaces.V_PLACES_TEMPLATE  = '<ul class="{designerClass}-places ';
    LayoutDesignerPlaces.V_PLACES_TEMPLATE  += '{designerClass}-places-vertical ';
    LayoutDesignerPlaces.V_PLACES_TEMPLATE  += '{designerClass}-places-{placesLevel}"></ul>';

    LayoutDesignerPlaces.H_DEST_TEMPLATE    =  '<td class="{designerClass}-cell ';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '{designerClass}-cell-horizontal ';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '{designerClass}-cell-{placesLevel}">';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '<div class="{designerClass}-container"></div>';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '</td>';

    LayoutDesignerPlaces.V_DEST_TEMPLATE    =  '<li class="{designerClass}-cell ';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '{designerClass}-cell-vertical ';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '{designerClass}-cell-{placesLevel}">';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<div class="{designerClass}-container"></div>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</li>';

    Y.extend( LayoutDesignerPlaces, Y.Bewype.LayoutDesignerConfig, {

        placesNode : null,

        contents   : null,

        level      : null,
    
        /**
         *
         */
        initializer: function ( config ) {

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host            = this.get( 'host' ),
                _hostChildren    = _host.get( 'children' ),
                _placesType      = this.get( 'placesType' ),
                _designerClass   = this.get( 'designerClass' ),
                _hTmpl           = LayoutDesignerPlaces.H_PLACES_TEMPLATE,
                _vTmpl           = LayoutDesignerPlaces.V_PLACES_TEMPLATE,
                _placesTempl     = _placesType === 'horizontal' ? _hTmpl : _vTmpl,
                _parentNode      = this.get( 'parentNode' ),
                _config          = null,
                _placesChildren  = null,
                _childType       = null;

            // init content list
            this.contents = [];

            // init places level
            this.level = this._getPlacesLevel();

            // mount previous
            this.placesNode = _hostChildren ? _hostChildren.item( 0 ) : null;
            // create new
            if ( this.placesNode ) {
                // ...
                if ( this.placesNode.hasClass( _designerClass + '-places-vertical' ) ) {
                    // replace table with ul for places
                    this._tableToUl();
                    // set contentype
                    _placesType = 'vertical';
                    _childType  = 'horizontal';
                } else {
                    // set contentype
                    _placesType = 'horizontal';
                    _childType  = 'vertical';
                }

                // prepare config
                _config = this.getAttrs();
                _config.parentNode = _host;

                // populate ul
                if ( _placesType === 'horizontal' ) {
                    _placesChildren = this.placesNode.one( 'tr' ).get( 'children' );
                } else {
                    _placesChildren = this.placesNode.get( 'children' );
                }
                _placesChildren.each( function ( v, k ) {
                    // loop vars
                    var _cHost    = v.get( 'children' ).item( '0' ),
                        _cContent = _cHost.get( 'children' ).item( '0' );

                    // mount
                    if ( _cContent.get( 'tagName' ).toLowerCase() === 'table' ) {
                        // ...
                        _config.targetType = _childType;
                        _cHost.plug( Y.Bewype.LayoutDesignerTarget, _config );
                        // ...
                        _config.targetType = null;
                        _config.placesType = _childType;
                        _cHost.plug( Y.Bewype.LayoutDesignerPlaces, _config );
                    } else {
                        _config.contentType = _cContent.hasClass( _designerClass + '-content-text' ) ? 'text' : 'image';
                        _cHost.plug( Y.Bewype.LayoutDesignerContent, _config );
                    }
                    // register
                    this.registerContent( _cHost );
                }, this );

            } else {            
                // add places
                this.placesNode = new Y.Node.create( Y.substitute( _placesTempl, {
                    designerClass : _designerClass,
                    placesLevel   : this.level
                } ) );

                // set place content
                _host.append( this.placesNode );

                // common default height/width
                this.placesNode.setStyle( 'height', this.get( 'contentHeight' ) );
                this.placesNode.setStyle( 'width' , this.get( 'contentWidth'  ) );
            }

            // make it sortable
            this._initSortable();
        },

        _getPlacesLevel: function () {
            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _parentNode    = _host.ancestor( '.' + _designerClass + '-places' ),
                _level = 0;

            while ( _parentNode ) {
                _parentNode = _parentNode.ancestor( '.' + _designerClass + '-places' );
                _level += 1;
            }
            return 'level' + _level;
        },

        _initSortable: function () {
            // get type                       
            var _host               = this.get( 'host' ),
                _placesType         = this.get( 'placesType' ),
                _designerClass      = this.get( 'designerClass' ),
                _sortTag            = _placesType === 'horizontal' ? 'td'    : 'li',
                _sortableTag        = _placesType === 'horizontal' ? 'table' : 'ul',
                _layoutClass        = '.' + _designerClass + '-layout',
                _dragContentClass   = '.' + _designerClass + '-content-clone-drag',
                _sortable           = Y.Sortable.getSortable( this.placesNode ),
                _baseSortableNode   = _host.ancestor( _layoutClass ),
                _allSortableNodes   = _baseSortableNode ? _baseSortableNode.all( _sortableTag ) : null,
                _contentLevelClass  = _designerClass + '-cell-' + this.level,
                _sortableLevelClass = _designerClass + '-places-' + this.level;

            if ( _sortable ) {
                Y.Sortable.unreg( _sortable );
            }

            // make it sortable
            _sortable = new Y.Sortable( {
                container   : this.placesNode,
                nodes       : _sortTag + '.' + _contentLevelClass,
                opacity     : '.2',
                handles     : [ _dragContentClass ]
            } );

            if ( !_allSortableNodes ) { return; }

            // wise join
            _allSortableNodes.each( function ( v, k ) {
                if ( this.placesNode != v && v.hasClass( _sortableLevelClass ) ) {
                    var _s = Y.Sortable.getSortable( v );
                    // little check
                    if ( _s ) {
                        _s.join( _sortable, 'full' );
                    }
                }
            }, this );
        },

        _tableToUl : function () {
            // create ul
            var _ul            = Y.Node.create( '<ul />' ),
                _designerClass = this.get( 'designerClass' );
            // ...
            _ul.addClass( _designerClass + '-places' );
            _ul.addClass( _designerClass + '-places-vertical' );
            _ul.addClass( _designerClass + '-places' + this.level );
            // populate ul
            this.placesNode.all( 'td.' + _designerClass + '-cell-vertical' ).each( function ( v, k ) {
                var _li = Y.Node.create( '<li />' );
                // update class
                _li.addClass( _designerClass + '-cell' );
                _li.addClass( _designerClass + '-cell-vertical' );
                _li.addClass( _designerClass + '-cell-' + this.level );
                // set inner
                _li.set( 'innerHTML', v.get( 'innerHTML' ) );
                // update places
                _ul.append( _li );
            }, this );
            // replace table for places
            this.placesNode.replace( _ul );
            this.placesNode = _ul;
        },

        _ulToTable : function () {
            // create table
            var _table         = Y.Node.create( '<table />' ),
                _designerClass = this.get( 'designerClass' );
            // ...
            _table.addClass( _designerClass + '-places' );
            _table.addClass( _designerClass + '-places-vertical' );
            _table.addClass( _designerClass + '-places-' + this.level );
            // populate table
            this.placesNode.all( 'li' ).each( function ( v, k ) {
                var _row = Y.Node.create( '<tr />' ),
                    _cell = Y.Node.create( '<td />' );
                // update class
                _cell.addClass( _designerClass + '-cell' );
                _cell.addClass( _designerClass + '-cell-vertical' );
                _cell.addClass( _designerClass + '-cell-' + this.level );
                // set inner
                _cell.set( 'innerHTML', v.get( 'innerHTML' ) );
                // update table
                _row.append( _cell );
                _table.append( _row );
            }, this );
            // replace list
            this.placesNode.replace( _table );
            this.placesNode = _table;
        },

        /**
         *
         */
        destructor: function () {

            // copy contents
            var _sortable   = Y.Sortable.getSortable( this.placesNode ),
                _placesType = this.get( 'placesType' );
            
            // first remove all the children
            Y.Object.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerTarget ) {

                    // unplug places
                    v.unplug( Y.Bewype.LayoutDesignerTarget );

                } else if ( v.layoutDesignerContent ) {
                
                    // unplug the node
                    v.unplug( Y.Bewype.LayoutDesignerContent );

                } else {
                    // ???
                }
            }, this );

            // destroy sortable
            Y.Sortable.unreg( _sortable );

            // .. serialize ul to table
            if ( _placesType === 'vertical' ) {
                this._ulToTable();
            }
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
        getMaxWidth : function () {
            return Y.Bewype.Utils.getWidth( this.get( 'host' ) );
        },

        /**
         *
         */
        getAvailablePlace : function () {

            // get the target node
            var _placesType   = this.get( 'placesType' ),
                _maxWidth     = this.getMaxWidth(),
                _currentWidth = this.getPlacesWidth();

            if ( _placesType === 'vertical' ) {
                // just added or already set
                return _currentWidth === 0 ? _maxWidth : _currentWidth;

            } else {
                // simple diff
                return _maxWidth - _currentWidth;
            }
        },

        /**
         *
         */
        hasPlace : function ( contentWidth ) {

            // get the target node
            var _availablePlace = this.getAvailablePlace(),
                _placesType     = this.get( 'placesType' );

            // ensure content width
            contentWidth = contentWidth ? contentWidth : this.get( 'contentWidth' );
            
            // so ??
            return _placesType === 'vertical' || _availablePlace >= contentWidth;
        },

        getPlacesWidth : function () {

            // result
            var _cWidth     = 0,
                _parentNode = this.get( 'parentNode' ) || this.placesNode.ancestor( 'div' );

            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':

                    if ( !this.get( 'parentNode' ) ) {
                        return Y.Bewype.Utils.getWidth( _parentNode );
                    }

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
                    _cHeight = ( _cHeight === 0 ) ? this.get( 'contentHeight' ) : _cHeight;
                    break;
            }
            return _cHeight;
        },

        /**
         *
         */
        refresh : function ( forcedWidth ) {

            // get the target node
            var _placesType     = this.get( 'placesType' ),
                _placesHeight   = this.getPlacesHeight(),
                _placesWidth    = forcedWidth ? forcedWidth : this.getPlacesWidth(),
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
                            if ( forcedWidth ) {
                                v.layoutDesignerTarget.refresh( forcedWidth );
                            }
                        } else if ( forcedWidth ) {
                            v.layoutDesignerContent.refresh( forcedWidth );
                        }
                    } );
                    break;

                case 'horizontal':
                    //
                    Y.Object.each( this.contents, function( v, k ) {
                        var _n  = null,
                            _w  = forcedWidth ? ( forcedWidth / this.contents.length ) : null,
                            _td = null;
                        if ( v.layoutDesignerPlaces ) {
                            _n = v.layoutDesignerPlaces.placesNode;
                            if ( _w ) {
                                v.layoutDesignerTarget.refresh( _w );
                            }
                        } else if ( v.layoutDesignerContent ) {
                            _n = v.layoutDesignerContent.get( 'host' );
                            if ( _w ) {
                                v.layoutDesignerContent.refresh( _w );
                            }
                        }
                        // get parent cell
                        _td = _n ? _n.ancestor( 'td' ) : null;
                        // update content style
                        if(_td) {
                            _td.setStyle( 'height' , _placesHeight );
                            _td.setStyle( 'vertical-align', 'top' );
                        }
                    }, this );
                    break;
            }

            // and refresh parent
            if ( !_parentNode ) {
                this.placesNode.ancestor( 'div' ).setStyle( 'height', _placesHeight );
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

            var _destNode    = null;

            // add
            switch( this.get( 'placesType' ) ) {

                case 'horizontal':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.H_DEST_TEMPLATE, {
                        designerClass : this.get( 'designerClass' ),
                        placesLevel   : this.level
                    } ) );

                    // dom add
                    this.placesNode.one('tr').append( _destNode );
                    break;

                case 'vertical':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.V_DEST_TEMPLATE, {
                        designerClass : this.get( 'designerClass' ),
                        placesLevel   : this.level
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
            
            // re-init sortable
            this._initSortable();
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

            // add dest node
            var _placesType  = this.get( 'placesType' ),
                _destNode    = this.addDestNode(),
                _config      = this.getAttrs(),
                _maxWidth    = this.getMaxWidth();

            // prepare config
            _config.contentType  = contentType;
            _config.parentNode   = this.get( 'host' );
            // set max available width
            _config.contentWidth = _placesType === 'vertical' ? _maxWidth : this.getAvailablePlace();

            // plug node
            _destNode.plug( Y.Bewype.LayoutDesignerContent, _config );
            this.registerContent( _destNode );
        },

        /**
         *
         */
        removeContent: function ( contentNode, notUnplug ) {

            // get dest node        
            var _destNode     = null,
                _host         = this.get( 'host' );

            switch( this.get( 'placesType' ) ) {

                case 'horizontal':
                    // get parent td
                    _destNode = contentNode.ancestor( 'td' );
                    break;

                case 'vertical':
                    // get parent li
                    _destNode = contentNode.ancestor( 'li' );
                    break;
            }

            // unregister
            this.unRegisterContent( contentNode );

            // unplug the node
            contentNode.unplug( Y.Bewype.LayoutDesignerContent );

            // then remove dest node
            _destNode.remove( true );

            // and refresh
            if ( _host.layoutDesignerTarget ) {
                _host.layoutDesignerTarget.refresh();
            }
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

