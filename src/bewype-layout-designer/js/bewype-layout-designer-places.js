
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
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  =  '<table class="{placesClass}-horizontal">';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '<tr />';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '</table>';

    LayoutDesignerPlaces.V_PLACES_TEMPLATE  = '<table class="{placesClass}-vertical"></table>';

    LayoutDesignerPlaces.C_TEMPLATE         = '<div class="{contentClass}">{defaultContent}</div>';

    LayoutDesignerPlaces.H_DEST_TEMPLATE    = '<td class="{destClass}-horizontal"><div class="container-{destClass}" /></td>';

    LayoutDesignerPlaces.V_DEST_TEMPLATE    =  '<tr class="{destClass}-vertical">';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<div class="container-{destClass}" />';
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
            value : null
        }
    };

    Y.extend( LayoutDesignerPlaces, Y.Plugin.Base, {

        placesNode : null,

        contents   : null,
        
        sortable   : null,

        /**
         *
         */
        initializer: function( config ) {
            
            // temp var
            var _host           = this.get( 'host'       ),
                _placesType     = this.get( 'placesType' ),
                _hTmpl          = LayoutDesignerPlaces.H_PLACES_TEMPLATE;
                _vTmpl          = LayoutDesignerPlaces.V_PLACES_TEMPLATE;
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
                _parentNode.layoutDesignerPlaces.registerContent(_host);
            } else {
                Y.DD.DDM.on( 'drag:enter', this._onEnterGotcha );
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
        },

        _onEnterGotcha: function ( evt ) {

            // get drag
            var _drag           = evt.drag,
                _dragNode       = evt.drag.get( 'node' ),
                _dragChild      = _dragNode.one( 'div.content' ),
                _dropNode       = evt.drop.get( 'node' ),
                _dropParent     = _dropNode.ancestor( 'div' ),
                _parentPlaces   = null,
                _innerHtml      = null,
                _cssText        = null,
                _td             = null,
                _newContent     = null;

            if ( _dragChild && _dropParent
                    && _dragChild.layoutDesignerContent
                    && _dropParent.layoutDesignerPlaces
                    && _dropParent.layoutDesignerPlaces.get( 'placesType' ) === 'vertical'
                    && _dropParent.layoutDesignerPlaces.contents.indexOf( _dragChild ) == -1 ) {

                // get parent
                _parentPlaces = _dragChild.layoutDesignerContent.get( 'parentNode' );

                // copy value
                _innerHtml = _dragChild.get( 'innerHTML' );
                _cssText   = _dragChild.getStyle( 'cssText' );

                // get td
                _td = _dragChild.ancestor( 'td' );

                if ( _td.drop ) {

                    // unplug
                    _dragChild.unplug( Y.Bewype.LayoutDesignerContent );

                    // remove td
                    _td.drop.removeFromGroup(_parentPlaces.layoutDesignerPlaces.sortable);
                    _td.remove();

                    // restore content
                    _newContent = _parentPlaces.layoutDesignerPlaces.addContent();
                    _newContent.set( 'innerHTML', _innerHtml);
                    _newContent.setStyle( 'cssText', _cssText );
                    _parentPlaces.layoutDesignerTarget.refresh();

                    //
                    _drag.removeFromGroup(_parentPlaces.layoutDesignerPlaces.sortable);
                    _drag.stopDrag();
                    _drag.end();

                    try {
                        // ??? buggy
                        evt.stopImmediatePropagation();
                        evt.halt();
                    } catch( err ) { }
                }
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
        _getHeight : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int height
            return parseInt( node.getComputedStyle( 'height' )
                    || node.getAttribute( 'height' ), default_ );
        },

        /**
         *
         */
        _getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int width
            return parseInt( node.getComputedStyle( 'width' )
                    || node.getAttribute( 'width' ), default_ );
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
        hasPlace : function () {

            // get the target node
            var _parentNode = this.get( 'parentNode' ) || this.placesNode.ancestor( 'div' ),
                _pWidth     = null,
                _cWidth     = null;
            
            // update target style
            switch( this.get( 'placesType' ) ) {

                case 'vertical':
                    return true;

                case 'horizontal':
                    // get parent width
                    _pWidth = this._getWidth(_parentNode);
                    // get contents width
                    _cWidth = this.getPlacesWidth();
                    return _pWidth >= ( _cWidth + this.get( 'contentWidth' ) );
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
            return ( _cWidth == 0 ) ? this.get( 'contentWidth' ) : _cWidth;
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
            return ( _cHeight == 0 ) ? this.get( 'contentHeight' ) : _cHeight;
        },

        /**
         *
         */
        refresh : function () {

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
            if ( _parentNode ) {
                _parentNode.layoutDesignerTarget.refresh();
            } else {
                this.placesNode.ancestor( 'div' ).setStyle( 'height', _placesHeight );
            }

            // ...
            return [ _placesHeight, _placesWidth ]
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
            _destNode.append(_contentNode);

            // plug node
            _contentNode.plug( Y.Bewype.LayoutDesignerContent, {
                contentHeight  : this.get( 'contentHeight'  ),
                contentWidth   : this.get( 'contentWidth'   ),
                contentZIndex  : this.get( 'contentZIndex'  ),
                contentClass   : this.get( 'contentClass'   ),
                defaultContent : this.get( 'defaultContent' ),
                parentNode     : this.get( 'host'           ),
                editCallback   : this.get( 'editCallback'   ),
                removeCallback : Y.bind( this.removeContent, this )
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
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerPlaces = LayoutDesignerPlaces;

