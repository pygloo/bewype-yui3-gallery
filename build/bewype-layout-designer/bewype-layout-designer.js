YUI.add('bewype-layout-designer-config', function(Y) {


    /**
     *
     */
    var LayoutDesignerConfig = function ( config ) {
        LayoutDesignerConfig.superclass.constructor.apply( this, arguments );
    };


    LayoutDesignerConfig.NAME = 'layout-designer-config';

    LayoutDesignerConfig.ATTRS = {
        designerClass : {
            value : 'layout-designer',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetStartActions : {
            value : [ 'row', 'column' ],
            writeOnce : true
        },
        targetHorizontalActions : {
            value : [ 'column', 'text', 'image', 'remove' ],
            writeOnce : true
        },
        targetVerticalActions : {
            value : [ 'row', 'text', 'image', 'remove' ],
            writeOnce : true
        },
        contentHeight : {
            value : 40,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        contentWidth : {
            value : 40,
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
        baseNode : {
            value : null,
            writeOnce : true
        },
        parentNode : {
            value : null
        },
        layoutWidth : {
            value : 600,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        placesType : {
            value : 'start',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        targetType : {
            value : 'start',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        contentType : {
            value : 'text',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultText : {
            value : 'Text ...',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        defaultImg : {
            value : Y.config.base + 'bewype-layout-designer/assets/blank.png',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        editorTextButtons : {
            value : [
                    'height',
                    'width',
                    'bold',
                    'italic',
                    'underline',
                    'title',
                    'font-family',
                    'font-size',
                    'text-align',
                    'color',
                    'background-color',
                    'url',
                    'reset',
                    'apply'
                    ]
        },
        editorImageButtons : {
            value : [
                    'file',
                    'background-color',
                    'height',
                    'width',
                    'padding-top',
                    'padding-right',
                    'padding-bottom',
                    'padding-left',
                    'reset',
                    'apply'
                    ]
        },
        startingTargetType : {
            value: 'start', 
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        }
    };

    Y.extend( LayoutDesignerConfig, Y.Plugin.Base );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerConfig = LayoutDesignerConfig;



}, '@VERSION@' ,{requires:['plugin']});
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
    LayoutDesigner.NODE_PAN_TEMPLATE = '<div class="{designerClass}-edit-panel"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout {designerClass}-places"></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    Y.extend( LayoutDesigner, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        initializer: function( config ) {

            // ??
            this.setAttrs( config );

            // tmp vars
            var _host          = this.get( 'host' ),
                _nodePan       = null,
                _designerClass = this.get( 'designerClass' ),
                _layoutWidth   = this.get( 'layoutWidth' );

            this.nodeLayout = _host.one( 'div.' + _designerClass + '-layout' );

            if ( !this.nodeLayout ) {
                // create dest layout
                this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_LAYOUT_TEMPLATE, {
                    designerClass : _designerClass
                } ) );
                // attach layout node to main node
                _host.append( this.nodeLayout );
                //
                this.nodeLayout.setStyle( 'width', _layoutWidth );
            }

            config.baseNode   = _host;
            config.targetType = this.get( 'startingTargetType' );
            // plug target
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, config );

            // refresh at start
            this.nodeLayout.layoutDesignerTarget.refresh();

            // create edit panel node
            _nodePan = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_PAN_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( _nodePan );

            // ... 
            // Y.DD.DDM.on( 'drop:enter', Y.bind( this._dropHitGotcha, this ) ); // need some cleaning and enhancement ....
            Y.DD.DDM.on( 'drop:hit', Y.bind( this._dropHitGotcha, this ) );
        },

        /**
         *
         */
        destructor: function () { 

            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _panNode       = _host.one( '.' + _designerClass + '-edit-panel' );

            // unplug all
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerTarget );

            // remove our designer specific nodes
            _panNode.remove();
        },

        /**
         *
         */
        _dropHitGotcha : function ( evt ) {
            //
            var _dragNode       = evt.drag.get( 'node' ),
                _dragTagName    = _dragNode.get( 'tagName' ).toLowerCase(),
                _placesClass    = '.' + this.get( 'designerClass' ) + '-places',
                _containerClass = '.' + this.get( 'designerClass' ) + '-container',
                _destNode       = _dragNode.one( _containerClass ),
                _contentNode    = _dragNode.one( _placesClass ) ? _destNode : _dragNode.one( _containerClass ),
                _parentHost     = null,
                _dropTagName    = _dragTagName === 'li' ? 'ul' : 'table',
                _dropSortNode   = _destNode ? _destNode.ancestor( _dropTagName ) : null,
                _dropNode       = _dropSortNode ? _dropSortNode.ancestor( 'div' ) : null,
                _forceWidth     = null;

            if ( !_contentNode || !_dropNode.layoutDesignerPlaces ) {
                return;
            } else if ( _contentNode.layoutDesignerContent ) {
                _parentHost = _contentNode.layoutDesignerContent.get( 'parentNode' );
            } else if ( _contentNode.layoutDesignerPlaces  ) {
                _parentHost = _contentNode.layoutDesignerPlaces.get( 'parentNode' );
            } else {
                return;
            }

            if ( _parentHost != _dropNode ) {

                // and register it
                _parentHost.layoutDesignerPlaces.unRegisterContent( _contentNode );
                _dropNode.layoutDesignerPlaces.registerContent( _contentNode );

                // udpate parent node propertie
                _contentNode.layoutDesignerContent.set( 'parentNode', _dropNode );

                // refresh new parent
                _forceWidth  = _dropNode.layoutDesignerPlaces.getMaxWidth();
                _dropNode.layoutDesignerTarget.refresh( _forceWidth );
            }
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

    /**
     *
     */
    LayoutDesignerContent.C_TEXT_TEMPLATE =  '<div class="{designerClass}-content ';
    LayoutDesignerContent.C_TEXT_TEMPLATE += '{designerClass}-content-{contentType}">';
    LayoutDesignerContent.C_TEXT_TEMPLATE += '{defaultContent}</div>';

    /**
     *
     */
    LayoutDesignerContent.C_IMG_TEMPLATE =  '<img class="{designerClass}-content ';
    LayoutDesignerContent.C_IMG_TEMPLATE += '{designerClass}-content-{contentType}" ';
    LayoutDesignerContent.C_IMG_TEMPLATE += 'src="{defaultContent}" />';

    /**
     *
     */
    LayoutDesignerContent.NAME = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContent.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContent, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        initializer : function( config ) {
            // ??
            this.setAttrs( config );
            
            // temp var
            var _host          = this.get( 'host' ),
                _parentNode    = this.get( 'parentNode' ),
                _contentType   = this.get( 'contentType' ),
                _designerClass = this.get( 'designerClass' ),
                _contentNode   = _contentType === 'text' ? _host.one( 'div' ) : _host.one( 'img' ),
                _template      = _contentType === 'text' ? LayoutDesignerContent.C_TEXT_TEMPLATE : LayoutDesignerContent.C_IMG_TEMPLATE;

            if ( !_contentNode ) {
                // add dest node
                _contentNode = new Y.Node.create( Y.substitute( _template, {
                    designerClass  : _designerClass,
                    contentType    : _contentType,
                    defaultContent : _contentType === 'text' ?  this.get( 'defaultText' ) : this.get( 'defaultImg' )
                } ) ); // create content node
                // dom add
                _host.append( _contentNode );
                // common default height
                _contentNode.setStyle( 'height', this.get( 'contentHeight' ) );
                _contentNode.setStyle( 'width',  this.get( 'contentWidth'  ) );
            }

            // add clone
            this._addCloneNode();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host'          ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneNode       = _host.one( '.' + _contentClass + '-clone' );

            // and remove the clone
            if ( _cloneNode ) {
                // detach events
                _cloneNode.one( '.' + _contentClass + '-clone-edit'   ).detachAll( 'click' );
                _cloneNode.one( '.' + _contentClass + '-clone-remove' ).detachAll( 'click' );
                // remove clone node
                _cloneNode.remove();
            }
        },

        /**
         *
         */
        _detachEditor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _bNode           = this.get( 'baseNode'      ),
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _contentNode     = this.getContentNode(),
                _cloneNode       = this.getCloneNode();

            if ( _editPanNode && _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );
                _contentNode.unplug( _editorObj );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }
                
            // hide edit panel
            if ( _editPanNode ) {
                _editPanNode.setStyle( 'display', 'none' );
            }

            // show clone
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'display', 'block' );
            }

            // refresh clone
            this._refreshCloneNode();

            return true;
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _bNode           = this.get( 'baseNode'      ),
                _pNode           = this.get( 'parentNode'    ),
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _pl              = _pNode.layoutDesignerPlaces,
                _placesType      = _pl.get( 'placesType' ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _activeButtons   = this.get( 'contentType' ) === 'image' ? 'editorImageButtons' : 'editorTextButtons',
                _contentNode     = this.getContentNode(),
                _cloneNode       = this.getCloneNode(),
                _conf            = null,
                _maxWidth        = null,
                _pPn             = ( _placesType === 'vertical' ) ? _pl.get( 'parentNode' ) : null,
                _pPl             = _pPn ? _pPn.layoutDesignerPlaces : null;

            // hide sources and clone
            _cloneNode.setStyle(   'display', 'none'  );
            _editPanNode.setStyle( 'display', 'block' );

            // compute max width
            if (  _placesType === 'vertical' ) {
                _maxWidth =  _pNode.layoutDesignerPlaces.getMaxWidth();
                _maxWidth += _pPl ? _pPl.getAvailablePlace() : 0;
            } else {
                _maxWidth = _pNode.layoutDesignerPlaces.getAvailablePlace();
                _maxWidth += this.getContentWidth();
            }

            // update conf
            _conf = {
                panelNode       : _editPanNode,
                spinnerMaxWidth : _maxWidth,
                activeButtons   : this.get( _activeButtons )
            };

            // plug
            _contentNode.plug( _editorObj, _conf );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _contentNode );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _contentNode );
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _pNode    = this.get( 'parentNode' );
            
            // stop editing all
            Y.each( _pNode.layoutDesignerPlaces.getContents(), function( v, k ) {
                // update editing flag
                v.layoutDesignerContent._detachEditor();
            } );

            // attach
            this._attachEditor();
        },

        /**
         *
         */
        _onClickRemove : function ( evt ) {
            // temp var
            var _host       = this.get( 'host'       ),
                _parentNode = this.get( 'parentNode' );

            // call parent remove content
            _parentNode.layoutDesignerPlaces.removeContent( _host );
        },

        /**
         *
         */
        _addCloneNode : function () {
            
            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _cloneNode      = null,
                _dragNode       = null,
                _editNode       = null,
                _removeNode     = null;

            // create clone
            _cloneNode = _host.cloneNode( false );
            _cloneNode.set( 'innerHTML', '' );
            _cloneNode.set( 'className', _contentClass + '-clone');

            // add clone
            _host.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'z-index',  this.get( 'contentZIndex' ));
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'bottom',   0 );

            // add to clone
            _cloneNode.append( _callbacksNode );

            // add drag div
            _dragNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-drag" />' );
            // add to clone
            _callbacksNode.append( _dragNode );

            // add cb div
            _editNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-edit" />' );
            // add to clone
            _callbacksNode.append( _editNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickEdit, this ), _editNode );

            // add cb div
            _removeNode = new Y.Node.create( '<div class="' + _contentClass + '-clone-remove" />' );
            // add to clone
            _callbacksNode.append( _removeNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );

            // refresh clone
            this._refreshCloneNode();
        },

        /**
         *
         */
        getContentHeight : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cHeight = Y.Bewype.Utils.getHeight( _contentNode ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingTop'    ) || 0,
                _pBottom = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingBottom' ) || 0;
            // return width
            return _cHeight + _pTop + _pBottom;

        },

        /**
         *
         */
        getContentWidth : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cWidth      = Y.Bewype.Utils.getWidth( _contentNode ),
                _pRight      = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingRight' ) || 0,
                _pLeft       = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingLeft'  ) || 0;
            // return width
            return _cWidth + _pLeft + _pRight;
        },

        /**
         *
         */
        getContentNode : function () {
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _contentSelector = this.get( 'contentType' ) === 'image' ? 'img.' : 'div.';

            return _host.one( _contentSelector + _contentClass );
        },

        /**
         *
         */
        getCloneNode : function () {
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneSelector   = 'div.' + _contentClass + '-clone';

            return _host.one( _cloneSelector );
        },

        /**
         *
         */
        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _cloneNode      = this.getCloneNode(),
                _h              = this.getContentHeight(),
                _w              = forcedWidth || this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h - 2 );
                _cloneNode.setStyle( 'width',  _w - 2 );
            }
        },

        /**
         *
         */
        refresh : function ( forcedWidth ) {

            // temp var
            var _parentNode  = this.get( 'parentNode' ),
                _contentNode = forcedWidth ? this.getContentNode() : null;

            // force node width
            if ( _contentNode ) {
                _contentNode.setStyle( 'width',  forcedWidth );
                _contentNode.setStyle( 'paddingLeft',  0 );
                _contentNode.setStyle( 'paddingRight', 0 );
            }

            // refresh clone
            this._refreshCloneNode( forcedWidth );

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute', 'bewype-editor']});
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
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  =  '<table class="{designerClass}-places {designerClass}-places-horizontal">';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '<tr />';
    LayoutDesignerPlaces.H_PLACES_TEMPLATE  += '</table>';

    LayoutDesignerPlaces.V_PLACES_TEMPLATE  = '<ul class="{designerClass}-places {designerClass}-places-vertical"></ul>';

    LayoutDesignerPlaces.H_DEST_TEMPLATE    =  '<td class="{designerClass}-cell {designerClass}-cell-horizontal">';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '<div class="{designerClass}-container"></div>';
    LayoutDesignerPlaces.H_DEST_TEMPLATE    += '</td>';

    LayoutDesignerPlaces.V_DEST_TEMPLATE    =  '<li class="{designerClass}-cell {designerClass}-cell-vertical">';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '<div class="{designerClass}-container"></div>';
    LayoutDesignerPlaces.V_DEST_TEMPLATE    += '</li>';

    Y.extend( LayoutDesignerPlaces, Y.Bewype.LayoutDesignerConfig, {

        placesNode : null,

        contents   : null,

        /**
         *
         */
        initializer: function ( config ) {

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host            = this.get( 'host' ),
                _children        = _host.get( 'children' ),
                _placesType      = this.get( 'placesType' ),
                _designerClass   = this.get( 'designerClass' ),
                _hTmpl           = LayoutDesignerPlaces.H_PLACES_TEMPLATE,
                _vTmpl           = LayoutDesignerPlaces.V_PLACES_TEMPLATE,
                _placesTempl     = _placesType === 'horizontal' ? _hTmpl : _vTmpl,
                _parentNode      = this.get( 'parentNode' ),
                _containerTag    = null,
                _config          = null,
                _placesChildType = null,
                _contentType     = null;

            // init content list
            this.contents = [];

            // mount previous
            this.placesNode = _children ? _children.item( 0 ) : null;
            // create new
            if ( this.placesNode ) {
                // ...
                if ( this.placesNode.hasClass( '.' + _designerClass + '-places-vertical' ) ) {
                    // replace table with ul for places
                    this._tableToUl();
                    // set container tag
                    _containerTag = 'li';
                    // set contentype
                    _placesChildType = 'horizontal';
                } else {
                    // horizontal container tag
                    _containerTag = 'td';
                    // set contentype
                    _placesChildType = 'vertical';
                }

                // prepare config
                _config = this.getAttrs();
                _config.parentNode = _host;

                // populate ul
                this.placesNode.all( _containerTag ).each( function ( v, k ) {
                    var _c = v.get( 'children' ).item( 0 );
                    if ( _c.get( 'tagName' ).toLowerCase() === 'table' ) {
                        // ...
                        _config.targetType = _placesChildType;
                        _c.plug( Y.Bewype.LayoutDesignerTarget, _config );
                        // ...
                        _config.targetType = null;
                        _config.placesType = _placesChildType;
                        _c.plug( Y.Bewype.LayoutDesignerPlaces, _config );
                    } else {
                        _config.contentType = _c.one( '.' + _designerClass + '-content-text' ) ? 'text' : 'image';
                        _c.plug( Y.Bewype.LayoutDesignerContent, _config );
                    }
                    // register
                    this.registerContent( _c );
                }, this );

            } else {            
                // add places
                this.placesNode = new Y.Node.create( Y.substitute( _placesTempl, {
                    designerClass : _designerClass
                } ) );

                // set place content
                _host.append(this.placesNode);

                // common default height/width
                this.placesNode.setStyle( 'height', this.get( 'contentHeight' ) );
                this.placesNode.setStyle( 'width' , this.get( 'contentWidth'  ) );
            }

            // make it sortable
            this._initSortable();

            // register it
            if ( _parentNode && _parentNode.layoutDesignerPlaces ) {
                _parentNode.layoutDesignerPlaces.registerContent( _host );
            }
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
                _allSortableNodes   = _baseSortableNode ? _baseSortableNode.all( _sortableTag ) : null;

            if ( _sortable ) {
                _sortable.destroy();
            }

            // make it sortable
            _sortable = new Y.Sortable( {
                container   : this.placesNode,
                nodes       : _sortTag,
                opacity     : '.2',
                handles     : [ _dragContentClass ]
            } );

            if ( !_allSortableNodes ) { return; }

            _allSortableNodes.each( function ( v, k ) {
                if ( this.placesNode != v ) {
                    var _s = Y.Sortable.getSortable( v );
                    _s.join( _sortable, 'full' );
                }
            }, this );
        },

        _tableToUl : function () {
            // create ul
            var _ul            = Y.Node.create( '<ul />' ),
                _designerClass = this.get( 'designerClass' );
            // populate ul
            this.placesNode.all( 'td' ).each( function ( v, k ) {
                var _li = Y.Node.create( '<li />' );
                // update class
                _li.addClass( _designerClass + '-cell' );
                _li.addClass( _designerClass + '-cell-vertical' );
                // set inner
                _li.set( 'innerHTML', v.get( 'innerHTML' ) );
                // update places
                _ul.append( _li );
            } );
            // replace table for places
            this.placesNode.replace( _ul );
        },

        _ulToTable : function () {
            // create table
            var _table         = Y.Node.create( '<table />' ),
                _designerClass = this.get( 'designerClass' );
            // ...
            _table.addClass( _designerClass + '-places' );
            _table.addClass( _designerClass + '-places-vertical' );
            // populate table
            this.placesNode.all( 'li' ).each( function ( v, k ) {
                var _row = Y.Node.create( '<tr />' ),
                    _cell = Y.Node.create( '<td />' );
                // update class
                _cell.addClass( _designerClass + '-cell' );
                _cell.addClass( _designerClass + '-cell-vertical' );
                // set inner
                _cell.set( 'innerHTML', v.get( 'innerHTML' ) );
                // update table
                _row.append( _cell );
                _table.append( _row );
            } );
            // replace list
            this.placesNode.replace( _table );
        },

        /**
         *
         */
        destructor: function () {

            // copy contents
            var _sortable       = Y.Sortable.getSortable( this.placesNode );
            
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
            _sortable.destroy();

            // .. serialize ul to table
            this._ulToTable();
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

            var _destNode   = null;

            // add
            switch( this.get( 'placesType' ) ) {

                case 'horizontal':
                    // create dest node
                    _destNode = new Y.Node.create( Y.substitute( LayoutDesignerPlaces.H_DEST_TEMPLATE, {
                        designerClass : this.get( 'designerClass' )
                    } ) );

                    // dom add
                    this.placesNode.one('tr').append( _destNode );
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

            // ..
            return _maxWidth;
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



}, '@VERSION@' ,{requires:['sortable', 'dd-constrain', 'bewype-layout-designer-content']});
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
        _groups : [ 'horizontal', 'vertical', 'text', 'image' ],

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
                config.parentNode = _host;
                // on start load found type
                if ( _placesNode ) {
                    if ( _placesNode.hasClass( '.' + _designerClass + '-places-vertical' ) ) {                    
                        config.placesType = 'vertical';
                    } else {
                        config.placesType = 'horizontal';
                    }
                // use passed type
                } else {
                    config.placesType = _type;
                }
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
            _config.parentNode = _host;

            // plug target
            _destNode.plug( Y.Bewype.LayoutDesignerTarget, _config );
            
            // register
            if ( _parentNode && _parentNode.layoutDesignerPlaces ) {
                _parentNode.layoutDesignerPlaces.registerContent( _destNode );
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
            
            switch( _placesType ) {

                case 'horizontal':
                    _host.one( 'table' ).remove();
                    break;

                case 'vertical':
                    _host.one( 'ul' ).remove();
                    break;
            }
            
            // destroy plugins
            _host.unplug( Y.Bewype.LayoutDesignerTarget );
            _host.unplug( Y.Bewype.LayoutDesignerPlaces );

            // restore start target if necessary
            if ( _parentNode && _parentNode.layoutDesignerPlaces ) {

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


YUI.add('bewype-layout-designer', function(Y){}, '@VERSION@' ,{use:['bewype-layout-designer-config', 'bewype-layout-designer-base', 'bewype-layout-designer-content', 'bewype-layout-designer-places', 'bewype-layout-designer-target']});

