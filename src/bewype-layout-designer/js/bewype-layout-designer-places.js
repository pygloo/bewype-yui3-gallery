
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
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  =  '<table class="{placesClass} {placesClass}-horizontal">';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '<tr />';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '</table>';

    LayoutDesignerPlaces.V_PLACES_TEMPLATE  = '<table class="{placesClass} {placesClass}-vertical"></table>';

    LayoutDesignerPlaces.C_TEMPLATE         = '<div class="{contentClass}">{defaultContent}</div>';

    LayoutDesignerPlaces.H_DEST_TEMPLATE    = '<td class="{destClass}-horizontal"><div class="container-{destClass}"></div></td>';

    LayoutDesignerPlaces.V_DEST_TEMPLATE    =  '<tr class="{destClass}-vertical">';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<td>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<div class="container-{destClass}"></div>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</td>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</tr>';

    /**
     *
     */
    LayoutDesignerPlaces.ATTRS = {
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
        placesType : {
            value : 'vertical',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        placesClass : {
            value : 'places',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        destClass : {
            value : 'dest',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        contentClass : {
            value : 'content',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultContent : {
            value : 'Click to change your content..',
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        parentNode : {
            value : null,
            writeOnce : false
        },
        editPanelNode : {
            value : null,
            writeOnce : true
        }
    };

    Y.extend( LayoutDesignerPlaces, Y.Plugin.Base, {

        placesNode : null,

        contents   : null,
        
        sortable   : null,

        /**
         *
         */
        initializer: function ( config ) {
            
            // temp var
            var _host           = this.get( 'host'       ),
                _placesType     = this.get( 'placesType' ),
                _hTmpl          = LayoutDesignerPlaces.H_PLACES_TEMPLATE,
                _vTmpl          = LayoutDesignerPlaces.V_PLACES_TEMPLATE,
                _placesTempl    = ( _placesType === 'horizontal' ) ? _hTmpl : _vTmpl,
                _parentNode     = this.get( 'parentNode' );

            // add places
            this.placesNode = new Y.Node.create( Y.substitute( _placesTempl, {
                placesClass : this.get( 'placesClass' )
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
            } else {
                // Y.DD.DDM.on( 'drag:enter', Y.bind( this._onEnterGotcha, this ) );
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
                _destNode           = _dragNode.one( 'div.container-' + this.get( 'destClass' ) ),
                _contentNode        = _dragNode.one( '.places' ) ? _destNode : _dragNode.one( '.content' ),
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
            var _host     = this.get( 'host' ),
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
                _parentNode.layoutDesignerPlaces.unRegisterContent(_host);
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
                _pWidth     = null,
                _cWidth     = null;
            
            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':
                    return null;

                case 'horizontal':
                    // get parent width
                    _pWidth = Y.Bewype.Utils.getWidth( _parentNode );
                    // get contents width
                    _cWidth = this.getPlacesWidth();
                    return _pWidth - _cWidth;
            }
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
            return ( _cWidth === 0 ) ? this.get( 'contentWidth' ) : _cWidth;
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
                    break;
            }
            // return it
            return ( _cHeight === 0 ) ? this.get( 'contentHeight' ) : _cHeight;
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
                        destClass : this.get( 'destClass' )
                    } ) );

                    // dom add
                    _tr.append( _destNode );
                    break;

                case 'vertical':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.V_DEST_TEMPLATE, {
                        destClass : this.get( 'destClass' )
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

            // do remove
            this.contents.splice( _i, 1 );
        },

        /**
         *
         */
        addContent : function () {

            // little check
            if ( !this.hasPlace() ) { return null; }

            // add dest node
            var _destNode       = this.addDestNode(),
                _contentNode    = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.C_TEMPLATE, {
                    contentClass : this.get( 'contentClass' )
                } ) ); // create content node

            // dom add
            _destNode.append( _contentNode );

            // plug node
            _contentNode.plug( Y.Bewype.LayoutDesignerContent, {
                contentHeight  : this.get( 'contentHeight'  ),
                contentWidth   : this.get( 'contentWidth'   ),
                contentZIndex  : this.get( 'contentZIndex'  ),
                contentClass   : this.get( 'contentClass'   ),
                defaultContent : this.get( 'defaultContent' ),
                parentNode     : this.get( 'host'           ),
                editPanelNode  : this.get( 'editPanelNode'  )
            } );

            // 
            return _contentNode;
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

