
    /**
     *
     */
    var LayoutDesignerPlaces = function ( config ) {
        LayoutDesignerPlaces.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerPlaces.NAME  = 'layout-designer-places';

    LayoutDesignerPlaces.NS    = 'layoutDesignerPlaces';

    Y.extend( LayoutDesignerPlaces, Y.Bewype.LayoutDesignerConfig, {

        placesNode : null,

        contents   : null,
        
        sortable   : null,

        _initSortable: function () {
            // get type                       
            var _host             = this.get( 'host' ),
                _baseNode         = this.get( 'baseNode' ),
                _placesType       = this.get( 'placesType'    ),
                _srcNode          = _baseNode.one( '.' + this.get( 'designerClass' ) + '-sources' ),
                _srcSortable      = _srcNode.layoutDesignerSources.sortable,
                _dragContentClass = '.' + this.get( 'designerClass' ) + '-content-clone-drag',
                _dragPlacesClass  = '.' + this.get( 'designerClass' ) + '-places-grip';

            // make it sortable
            this.sortable = new Y.Sortable( {
                container   : _host,
                nodes       : 'li',
                opacity     : '.2',
                handles     : _placesType === 'horizontal' ? [ _dragContentClass ] : [ _dragPlacesClass ]
            } );
        },

        /**
         *
         */
        initializer: function ( config ) {

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host          = this.get( 'host'          ),
                _designerClass = this.get( 'designerClass' ),
                _placesType    = this.get( 'placesType'    ),
                _srcClass      = '.' + _designerClass + '-src',
                _parentNode    = this.get( 'parentNode' );

            // init content list
            this.contents = [];

            // remove source classes
            _host.removeClass( _designerClass + '-src' );
            _host.removeClass( _designerClass + '-src-' +  _placesType );

            // add content classes
            _host.addClass( _designerClass + '-places' );
            _host.addClass( _designerClass + '-places-' +  _placesType );

            //
            _host.all( _srcClass ).each( function( v, k ) {
                // prepare config
                var _config = this.getAttrs();
                _config.parentNode  = _host;
                _config.contentType = v.one( 'img' ) ? 'image' : 'text';
                // plug
                v.plug( Y.Bewype.LayoutDesignerContent, _config );
                // register
                this.contents.push(v);
            }, this );

            // make it sortable
            this._initSortable();

            // ...
            if ( _parentNode ) {
                this._addGripNode();
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

                    // unplug places
                    v.unplug( Y.Bewype.LayoutDesignerPlaces );

                } else if ( v.layoutDesignerContent ) {

                    // unplug the node
                    v.unplug( Y.Bewype.LayoutDesignerContent );

                } else {
                    // ???
                }
            }, this );

            // unregister it
            if ( _parentNode ) {
                _parentNode.layoutDesignerPlaces.unRegisterContent( _host );
            }
        },

        /**
         *
         */
        refresh : function ( forcedWidth, justAdded ) {

            // get the target node
            var _host         = this.get( 'host' ),
                _placesType   = this.get( 'placesType' ),
                _placesHeight = this.getPlacesHeight(),
                _placesWidth  = this.getPlacesWidth(),
                _parentNode   = this.get( 'parentNode' ),
                _cellWidth    = null;

            // prepare place height
            _placesHeight = _placesHeight === 0 ? this.get( 'contentHeight' ) : _placesHeight;

            // ...
            _host.setStyle( 'height', _placesHeight );
            _host.setStyle( 'width' , forcedWidth || _placesWidth );

            // update target style
            switch( _placesType ) {

                case 'vertical':
                    // set cell width
                    if ( justAdded ) {
                        _cellWidth = forcedWidth ? forcedWidth : _placesWidth;
                    } else {
                        _cellWidth = _placesWidth > forcedWidth ? forcedWidth : _placesWidth;
                        _cellWidth = _placesWidth === 0 ? this.getAvailablePlace() : _placesWidth;
                    }
                    Y.each( this.contents, function( v, k ) {
                        var _n = null;
                        if ( v.layoutDesignerPlaces ) {
                            _n = v.layoutDesignerPlaces.get( 'host' );
                            _n.setStyle( 'width' , _cellWidth );
                            if ( forcedWidth ) {
                                v.layoutDesignerPlaces.refresh( _cellWidth, justAdded );
                            }
                        } else if ( forcedWidth ) {
                            v.layoutDesignerContent.refresh( _cellWidth, justAdded );
                        }
                    } );
                    break;

                case 'horizontal':
                    // set cell width
                    _cellWidth = forcedWidth ? ( forcedWidth / this.contents.length ) : null;
                    //
                    Y.Object.each( this.contents, function( v, k ) {
                        var _n  = null,
                            _li = null;
                        if ( v.layoutDesignerContent ) {
                            _n = v.layoutDesignerContent.get( 'host' );
                            if ( _cellWidth ) {
                                v.layoutDesignerContent.refresh( _cellWidth, justAdded );
                            }
                        }
                        // get parent cell
                        _li = _n ? _n.ancestor( 'li' ) : null;
                        // update content style
                        if(_li) {
                            _li.setStyle( 'height' , _placesHeight );
                            _li.setStyle( 'vertical-align', 'top' );
                        }
                    }, this );
                    break;
            }
            // ...
            return _cellWidth;
        },

        /**
         *
         */
        _addGripNode : function () {
            
            // temp var
            var _host           = this.get( 'host' ),
                _div            = _host.ancestor( 'div' ),
                _placesClass = this.get( 'designerClass' ) + '-places',
                _gripNode       = new Y.Node.create( '<div class="' + _placesClass + '-grip" />' );

            // add clone
            _div.insertBefore( _gripNode, _host );

            // setStyle
            _gripNode.setStyle( 'bottom',   0 );
            _gripNode.setStyle( 'left',     0 );
            _gripNode.setStyle( 'position', 'absolute');
        },

        /**
         *
         */
        _getGripNode : function () {
            var _host        = this.get( 'host' ),
                _div         = _host.ancestor( 'div' ),
                _placesClass = this.get( 'designerClass' ) + '-places';

            return _div.one( 'div.' + _placesClass + '-grip' );
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
        getMaxWidth : function () {
            return Y.Bewype.Utils.getWidth( this.get( 'host' ) );
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
            var _placesType   = this.get( 'placesType' ),
                _maxWidth     = this.getMaxWidth(),
                _currentWidth = this.getPlacesWidth();

            if ( _placesType === 'vertical' ) {
                // just added or already set
                return _currentWidth === 0 ? _maxWidth : _currentWidth;

            } else {
                // simple diff
                return _maxWidth - _currentWidth - 2;
            }
        },

        getPlacesWidth : function () {

            // result
            var _cWidth     = 0,
                _parentNode = this.get( 'parentNode' ) || this.get( 'host' );

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
                        } else if ( v.layoutDesignerContent ) {
                            _w = v.layoutDesignerContent.getContentWidth();
                        }
                        if ( _w > _cWidth ) { _cWidth = _w; }
                    } );
                    break;

                case 'horizontal':
                    Y.each( this.contents, function( v, k ) {
                        if ( v.layoutDesignerPlaces ) {
                            _cWidth += v.layoutDesignerPlaces.getPlacesWidth();
                        } else if ( v.layoutDesignerContent ) {
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
                        } else if ( v.layoutDesignerContent ) {
                            _cHeight += v.layoutDesignerContent.getContentHeight();
                        }
                    } );
                    break;

                case 'horizontal':
                    Y.each( this.contents, function( v, k ) {
                        var _h = 0;
                        if ( v.layoutDesignerPlaces ) {
                            _h = v.layoutDesignerPlaces.getPlacesHeight();
                        } else if ( v.layoutDesignerContent ) {
                            _h = v.layoutDesignerContent.getContentHeight();
                        }
                        if ( _h > _cHeight ) { _cHeight = _h; }
                    } );
                    break;
            }
            return _cHeight;
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
        },

        /**
         *
         */
        removeContent: function ( contentNode, notUnplug ) {

            // get dest node        
            var _destNode      = contentNode.ancestor( 'li' ),
                _host          = this.get( 'host' ),
                _baseNode      = this.get( 'baseNode' ),
                _designerClass = this.get( 'designerClass' ),
                _nodeLayout    = _baseNode.one( '.' + _designerClass + '-layout ul' ),
                _forceWidth    = null;

            // unregister
            this.unRegisterContent( contentNode );

            // unplug the node
            contentNode.unplug( Y.Bewype.LayoutDesignerContent );

            // then remove dest node
            _destNode.remove();

            // no more content .. remove places
            if ( this.contents.length === 0 && _host != _nodeLayout ) {
                _host.unplug( Y.Bewype.LayoutDesignerPlaces );
            } else if ( _host.layoutDesignerPlaces ) {
                // get max width
                _forceWidth = this.getMaxWidth();
                // refresh
                this.refresh( _forceWidth );
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerPlaces = LayoutDesignerPlaces;

