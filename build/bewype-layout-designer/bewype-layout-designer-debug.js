YUI.add('bewype-layout-designer-base', function(Y) {


    /**
     *
     */
    var LayoutDesigner = function ( config ) {
        LayoutDesigner.superclass.constructor.apply( this, arguments );
    };


    /**
     *
     */
    LayoutDesigner.NODE_SRC_TEMPLATE = '<div id="{idSource}"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_DST_TEMPLATE = '<div id="{idDest}"></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    LayoutDesigner.ATTRS = {
        idSource : {
            value : 'layout-source',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        idDest : {
            value : 'layout-dest',
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
            value : 120,
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
        editCallback : {
            value : null
        },
        layoutWidth : {
            value : 600,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        }
    };

    Y.extend( LayoutDesigner, Y.Plugin.Base, {

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        initializer: function( config ) {

            // tmp vars
            var _idSource = this.get( 'idSource' ),
                _idDest   = this.get( 'idDest' ),
                _nodeSrc  = null;

            // create source node
            _nodeSrc = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                idSource : _idSource
            } ) );
            // attach src parent to widget
            this.get( 'host' ).append( _nodeSrc );
            // plug source bar
            _nodeSrc.plug( Y.Bewype.LayoutDesignerSources, {
                layoutWidth : this.get( 'layoutWidth' )
            } );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_DST_TEMPLATE, {
                idDest : _idDest
            } ) );
            // attach layout node to main node
            this.get( 'host' ).append( this.nodeLayout );
            //
            this.nodeLayout.setStyle( 'width', this.get( 'layoutWidth' ) );

            // plug target
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, {
                targetOverHeight : this.get( 'targetOverHeight' ),
                targetOverWidth  : this.get( 'targetOverWidth'  ),
                targetMinHeight  : this.get( 'targetMinHeight'  ),
                targetMinWidth   : this.get( 'targetMinWidth'   ),
                targetType       : 'start',
                targetZIndex     : this.get( 'targetZIndex'     ),
                contentHeight    : this.get( 'contentHeight'    ),
                contentWidth     : this.get( 'contentWidth'     ),
                contentZIndex    : this.get( 'contentZIndex'    ),
                contentClass     : this.get( 'contentClass'     ),
                defaultContent   : this.get( 'defaultContent'   ),
                editCallback     : this.get( 'editCallback'     ),
                idDest           : _idDest
            } );
        },

        /**
         *
         */
        destructor: function () {
        },

        /**
         *
         */
        getContents : function () {
            if (this.nodeLayout.layoutDesignerPlaces) {
                return this.nodeLayout.layoutDesignerPlaces.getContents();
            } else {
                return [];
            }
        }

        /**
         *
        refreshAll : function () {
            if (this.nodeLayout.layoutDesignerPlaces) {
                return this.nodeLayout.layoutDesignerPlaces.refreshAll();
            }
        }
         */
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesigner = LayoutDesigner;



}, '@VERSION@' ,{requires:['bewype-layout-designer-sources', 'bewype-layout-designer-target']});
YUI.add('bewype-layout-designer-content', function(Y) {


    /**
     *
     */
    var LayoutDesignerContent = function ( config ) {
        LayoutDesignerContent.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerContent.NAME  = 'layout-designer-content';

    LayoutDesignerContent.NS    = 'layoutDesignerContent';

    /**
     *
     */
    LayoutDesignerContent.ATTRS = {
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
        defaultStyle : {
            value : null
        },
        parentNode : {
            value : null
        },
        removeCallback : {
            value : null
        },
        editCallback : {
            value : null
        }
    };

    Y.extend( LayoutDesignerContent, Y.Plugin.Base, {

        /**
         *
         */
        _q : null,

        /**
         *
         */
        editing : false,

        /**
         *
         */
        initializer : function( config ) {
            
            // temp var
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' );
        
            // common default height
            _host.setStyle( 'height', this.get( 'contentHeight' ) );
            _host.setStyle( 'width',  this.get( 'contentWidth'  ) );

            // set default content
            _host.set( 'innerHTML', this.get( 'defaultContent' ) );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ) , _host );
                    
            // register it
            _parentNode.layoutDesignerPlaces.registerContent(_host);

            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ), // get parent
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' ); // get existing clone
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            Y.detach( _host );

            // and remove the clone
            if ( _clone ) {
                // clean events
                Y.Event.purgeElement( _clone, true );
                // remove
                _clone.remove();
            }

            // remove host
            _host.remove();
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _editCallback   = this.get( 'editCallback'   );
            
            // do call
            if ( _editCallback ) {
                this.editing = true;
                this.hideClone();
                _editCallback( this.get( 'host' ) );
            }
        },

        /**
         *
         */
        _onClickRemove : function ( evt ) {

            // get callback
            var _removeCallback = this.get( 'removeCallback' );

            // do call
            if ( _removeCallback ) {
                _removeCallback( this.get( 'host' ) );
            }
        },

        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            if ( !cloneNode ) {
                // temp var
                var _host           = this.get( 'host'         ),
                    _contentClass   = this.get( 'contentClass' ),
                    _parentDiv      = _host.ancestor( 'div' );
                // get existing clone
                cloneNode = _parentDiv.one( 'div.' + _contentClass + '-clone' );
            }

            if ( cloneNode ) {
                // set children visible
                Y.each( cloneNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'hidden' );
                } );
                // hide the clone
                cloneNode.setStyle( 'visibility', 'hidden' );
            }
        },

        _addCloneNode : function ( parentDiv ) {
            
            // temp var
            var _host           = this.get( 'host'           ),
                _contentClass   = this.get( 'contentClass'   ),
                _editCallback   = this.get( 'editCallback'   ),
                _removeCallback = this.get( 'removeCallback' ),
                _callbacksNode  = new Y.Node.create('<div class="' + _contentClass + '-clone-callbacks" />' ),
                _cloneNode      = null,
                _editNode       = null,
                _removeNode     = null;

            // create clone
            _cloneNode = _host.cloneNode( false );
            _cloneNode.set( 'innerHTML', '' );
            _cloneNode.set( 'className', _contentClass + '-clone');

            // add clone
            parentDiv.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'z-index',  this.get( 'contentZIndex' ));
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'bottom',   0 );

            // add to clone
            _cloneNode.append( _callbacksNode );

            // add edit div
            if ( _editCallback ) {
                // add cb div
                _editNode = new Y.Node.create(
                        '<div class="' + _contentClass + '-clone-edit" />' );
                // add to clone
                _callbacksNode.append( _editNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickEdit, this ), _editNode );
            }

            // add remove div
            if ( _removeCallback ) { 
                // add cb div
                _removeNode = new Y.Node.create(
                        '<div class="' + _contentClass + '-clone-remove" />' );
                // add to clone
                _callbacksNode.append( _removeNode );
                // manage callback on click
                Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );
            }

            //
            return _cloneNode;
        },

        /**
         *
         */
        _onMouseEnter : function ( evt ) {
            
            // do nothing when editing
            if ( this.editing ) { return; }

            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ),
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' ); // get existing clone

            // clean first
            _parentNode.layoutDesignerPlaces.cleanContentOver();

            if ( _clone ) {
                // set children visible
                Y.each( _clone.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'visible' );
                } );
                //
                _clone.setStyle( 'visibility', 'visible' );
            } else {
                _clone = this._addCloneNode( _parentDiv );
            }

            // stop first
            this._q.stop();
            // add clean cb
            this._q.add(
                    { fn: function () {},       timeout: 1000 },
                    { fn: this.hideClone, args: [ _clone ] } );
            // restart
            this._q.run();
        },

        /**
         *
         */
        _getHeight : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int height
            return parseInt( node.getComputedStyle( 'height' ) || node.getAttribute( 'height' ), default_ );
        },

        /**
         *
         */
        _getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int width
            return parseInt( node.getComputedStyle( 'width' ) || node.getAttribute( 'width' ), default_ );
        },

        getContentHeight : function () {
            
            // temp var
            var _host = this.get( 'host' );

            // return width
            return this._getHeight( _host );
        },

        getContentWidth : function () {
            
            // temp var
            var _host = this.get( 'host' );

            // return width
            return this._getWidth( _host );
        },

        refresh : function () {

            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ),
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' ), // get existing clone
                _height         = this.getContentHeight(),
                _width          = this.getContentWidth();

            // update host height & width style
            _host.setStyle( 'height', _height );
            _host.setStyle( 'width' , _width  );
            
            // update host height & width conf
            this.set( 'contentHeight', this._getHeight( _parentDiv ) );
            this.set( 'contentWidth' , this._getWidth(  _parentDiv ) );
            
            // update clone height & width style
            if ( _clone ) {
                _clone.setStyle( 'height', this.get( 'contentHeight' ) );
                _clone.setStyle( 'width' , this.get( 'contentWidth'  ) );
            }

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute']});
YUI.add('bewype-layout-designer-places', function(Y) {


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
            value : null
        },
        editCallback : {
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
                _gotcha           = true,
                _parentPlaces   = null,
                _innerHtml      = null,
                _cssText        = null,
                _td             = null,
                _newContent     = null;

            // here the gotcha test
            _gotcha &= _dragChild  && _dragChild.layoutDesignerContent;
            _gotcha &= _dropParent && _dropParent.layoutDesignerPlaces;
            _gotcha &= _gotcha     && _dropParent.layoutDesignerPlaces.get( 'placesType' ) === 'vertical';
            _gotcha &= _gotcha     && _dropParent.layoutDesignerPlaces.contents.indexOf( _dragChild ) == -1;

            if ( _gotcha ) {

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
        _getHeight : function ( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int height
            return parseInt( node.getComputedStyle( 'height' ) || node.getAttribute( 'height' ), default_ );
        },

        /**
         *
         */
        _getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int width
            return parseInt( node.getComputedStyle( 'width' ) || node.getAttribute( 'width' ), default_ );
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
                    _pWidth = this._getWidth(_parentNode);
                    // get contents width
                    _cWidth = this.getPlacesWidth();
                    return _pWidth - _cWidth;
            }
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

        /**
         *
        refreshAll : function () {
            // get all contents
            Y.each( this.contents, function( v, k ) {
                if ( v.layoutDesignerPlaces ) {
                    v.layoutDesignerPlaces.refreshAll();
                } else {
                    v.layoutDesignerContent.refresh();
                }
            } );
            // and refresh current
            this.get( 'host' ).layoutDesignerTarget.refresh( false );
        }
         */
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerPlaces = LayoutDesignerPlaces;



}, '@VERSION@' ,{requires:['sortable', 'bewype-layout-designer-content']});
YUI.add('bewype-layout-designer-sources', function(Y) {


    /**
     *
     */
    var LayoutDesignerSources = function ( config ) {
        LayoutDesignerSources.superclass.constructor.apply( this, arguments );
    };
  
    LayoutDesignerSources.NAME  = 'layout-designer-sources';

    LayoutDesignerSources.NS    = 'layoutDesignerSources';

    /**
     *
     */
    LayoutDesignerSources.ITEM_SRC_TEMPLATE = '<div id="src-{itemType}" class="{itemClass}">{itemLabel}</div>';

    /**
     *
     */
    LayoutDesignerSources.ATTRS = {
        sourceHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        sourceWidth : {
            value : 140,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        sourceClass : {
            value : 'source-item',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( LayoutDesignerSources, Y.Plugin.Base, {

        /**
         *
         */
        _groups : [ 'horizontal', 'vertical', 'content' ],

        /**
         *
         */
        _labels: [ 'Layout Horizontal', 'Layout Vertical', 'Content' ],

        /**
         *
         */
        initializer: function( config ) {

            // create table for sources and attach it
            var _tableSrc = new Y.Node.create( '<table><tr /></table>' );
            this.get( 'host' ).append( _tableSrc );

            // add sources
            Y.Object.each(this._groups, function( v, k ) {
                var _n      = null,
                    _td     = null,
                    _drag   = null;

                // create source components & attach
                _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.ITEM_SRC_TEMPLATE, {
                    itemType    : v,
                    itemClass   : this.get( 'sourceClass' ),
                    itemLabel   : this._labels[ k ]
                } ) );

                // prepare td for the source item
                _td = new Y.Node.create( "<td />" );
                _td.append( _n );
                // udpate source row
                _tableSrc.append( _td );
        
                // common default height
                _n.setStyle( 'height', this.get( 'sourceHeight' ) );
                _n.setStyle( 'width' , this.get( 'sourceWidth'  ) );

                // make it draggable
                _drag = new Y.DD.Drag( {
                    node    : _n,
                    groups  : [ v ],
                    dragMode: 'intersect'
                } );
                // additionnal drag features
                _drag.plug( Y.Plugin.DDProxy, {
                    moveOnEnd : false
                } );
                _drag.plug( Y.Plugin.DDConstrained, {
                    constrain2node  : [ this.get( 'host' ), this.get( 'host' ).next() ]
                } );
                // set drag events
                _drag.on( 'drag:start', Y.bind( this._onDragStart,   this, _drag ) );
                _drag.on( 'drag:end'  , Y.bind( this._onDragEnd  ,   this, _drag ) );

            }, this );
        },

        destructor: function () {
        },

        /**
         *
         */
        _onDragStart : function ( drag, evt ) {
            //
            var _node = drag.get( 'node' ),
                _dragNode = drag.get( 'dragNode' );
            //
            _node.setStyle( 'opacity', 0.2 );
            //
            _dragNode.set( 'innerHTML', _node.get( 'innerHTML') );
            _dragNode.setStyles( {
                backgroundColor : _node.getStyle( 'backgroundColor' ),
                color           : _node.getStyle( 'color' ),
                opacity         : 0.65
            } );
        },

        /**
         *
         */
        _onDragEnd : function ( drag, evt ) {
            drag.get( 'node' ).setStyle('opacity', 1);
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerSources = LayoutDesignerSources;



}, '@VERSION@' ,{requires:['dd', 'plugin', 'substitute']});
YUI.add('bewype-layout-designer-target', function(Y) {


    /**
     *
     */
    var LayoutDesignerTarget = function ( config ) {
        LayoutDesignerTarget.superclass.constructor.apply( this, arguments );
    };

    LayoutDesignerTarget.NAME  = 'layout-designer-target';

    LayoutDesignerTarget.NS    = 'layoutDesignerTarget';

    LayoutDesignerTarget.ATTRS = {
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
        targetClass : {
            value : 'target',
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
        placesClass : {
            value : 'places',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        parentNode : {
            value : null
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
        editCallback : {
            value : null
        },
        idDest : {
            value : 'layout-dest',
            writeOnce : true,
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
        _groups : [ 'horizontal', 'vertical', 'content' ],

        /**
         *
         */
        initializer: function( config ) {

            // temp vars
            var _host = this.get( 'host' ),
                _type = this.get( 'targetType' ),
                _layoutWidth     = this.get( 'layoutWidth'     ),
                _targetMaxHeight = this.get( 'contentHeight'   ),
                _targetMaxWidth  = this.get( 'contentWidth'    ),
                _targetMinHeight = this.get( 'targetMinHeight' ),
                _targetMinWidth  = this.get( 'targetMinWidth'  ),
                _width           = null;

            // add target
            this._targetNode = new Y.Node.create(
                    '<div class="' + this.get( 'targetClass' ) + '-' + _type + '" />' );
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
                _removeNode = this._targetNode.one( 'div' ),
                _destNode   = null;

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

                // get dest start
                _destNode = Y.one('#' + this.get( 'idDest' ) );

                // set start div size
                _destNode.setStyle( 'height' , this.get( 'targetMinHeight' ) );

                // add start target
                this._addTarget( _destNode, 'start' );
            }
        },

        /**
         *
         */
        _getHeight : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int height
            return parseInt( node.getComputedStyle( 'height' ) || node.getAttribute( 'height' ), default_ );
        },

        /**
         *
         */
        _getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            // return int width
            return parseInt( node.getComputedStyle( 'width' ) || node.getAttribute( 'width' ), default_ );
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
            var _host     = this.get( 'host' ),
                _destNode = null;
            
            // and destroy itself
            _host.unplug( Y.Bewype.LayoutDesignerTarget );

            // restore start target if necessary
            if ( !this.get( 'parentNode' ) ) {

                // get dest start
                _destNode = Y.one('#' + this.get( 'idDest' ) );

                // set start div size
                _destNode.setStyle( 'height' , this.get( 'targetMinHeight' ) );

                // add start target
                this._addTarget( _destNode, 'start' );
            }
        },

        /**
         *
         */
        _onMouseEnter: function ( evt ) {

            // temp vars
            var _targetClass = this.get( 'targetClass' ),
                _targetType  = this.get( 'targetType'  ),
                _removeNode  = this._targetNode.one( 'div' );

            // update target style
            switch( _targetType ) {

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
                        '<div class="' + _targetClass + '-' + _targetType + '-remove" />' );
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
                contentClass    : this.get( 'contentClass'    ),
                defaultContent  : this.get( 'defaultContent'  ),
                editCallback    : this.get( 'editCallback'    ),
                placesClass     : this.get( 'placesClass'     ),
                placesType      : type,
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
                contentClass     : this.get( 'contentClass'     ),
                defaultContent   : this.get( 'defaultContent'   ),
                editCallback     : this.get( 'editCallback'     ),
                targetType       : type,
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

            } else if ( _drag._groups.content ) {

                return 'content';

            } else {

                return null;

            }
        },

        _onDropHitStart : function ( evt ) {

            // get hitType
            var _hitType = this._getHitType( evt ),
                _host = this.get( 'host' );

            // specific for content .. nothing to do ..
            if ( _hitType === 'content' ) { return this._afterDropExit( evt ); }

            // destroy plugins
            _host.unplug( Y.Bewype.LayoutDesignerTarget );

            // add places and target
            this._addPlaces( _host, _hitType );
            this._addTarget( _host, _hitType );
            
            // refresh parent
            _host.layoutDesignerTarget.refresh();
        },

        _onDropHitHorizontal : function (evt) {

            // temp vars
            var _host       = this.get( 'host' ),
                _hitType    = this._getHitType( evt ),
                _destNode   = null;

            // hit factory
            switch( _hitType ) {

                case 'content':
                    // add content
                    _host.layoutDesignerPlaces.addContent();
                    break;

                case 'vertical':
                    // add dest node
                    _destNode = _host.layoutDesignerPlaces.addDestNode();
                    // add places and target
                    this._addPlaces( _destNode, _hitType );
                    this._addTarget( _destNode, _hitType );
            
                    // refresh dest node
                    _destNode.layoutDesignerTarget.refresh();
                    break;
            }
            
            // restore width
            this._afterDropExit( evt );
        },

        _onDropHitVertical : function ( evt ) {

            // temp vars
            var _host       = this.get( 'host' ),
                _hitType    = this._getHitType( evt ),
                _destNode   = null;

            // hit factory
            switch( _hitType ) {

                case 'content':
                    // add content
                    _host.layoutDesignerPlaces.addContent();
                    break;

                case 'horizontal':
                    // add dest node
                    _destNode = _host.layoutDesignerPlaces.addDestNode();
                    // add places and target
                    this._addPlaces( _destNode, _hitType );
                    this._addTarget( _destNode, _hitType );
            
                    // refresh dest node
                    _destNode.layoutDesignerTarget.refresh();
                    break;
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
                _targetType = this.get( 'targetType' ),
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
            _hHeight = this._getHeight( this._targetNode );
            _hWidth  = this._getWidth(  this._targetNode );

            // update position
            _parentNode = this._targetNode.ancestor( 'td' ) || this._targetNode.ancestor( 'div' );
            // update target style
            switch( _targetType ) {

                case 'vertical':
                    // set host position
                    _pHeight  = this._getHeight( _parentNode );
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
                    _pWidth  = this._getWidth( _parentNode );
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



}, '@VERSION@' ,{requires:['bewype-layout-designer-places']});


YUI.add('bewype-layout-designer', function(Y){}, '@VERSION@' ,{use:['bewype-layout-designer-base', 'bewype-layout-designer-content', 'bewype-layout-designer-places', 'bewype-layout-designer-sources', 'bewype-layout-designer-target']});

