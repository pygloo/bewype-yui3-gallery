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
        sourceGroups: {
            value : [ 'horizontal', 'text', 'image' ], // not used: vertical
            writeOnce : true
        },
        sourceLabels: {
            value : [ 'Layout Horizontal', 'Text', 'Image' ], // not used: Layout Vertical
            writeOnce : true
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
            value : 40,
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
            value : 'vertical',
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
        useBorder : {
            value: true, 
            writeOnce : true
        },
        boderStyle : {
            value: '1px dashed grey', 
            writeOnce : true
        },
        startingType : {
            value: 'vertical', 
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        cloneZIndex : {
            value : 2,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
            }
        },
        gripZIndex : {
            value : 4,
            validator : function( val ) {
                return Y.Lang.isNumber( val );
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
    LayoutDesigner.NODE_SRC_TEMPLATE = '<div class="{designerClass}-sources"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_PAN_TEMPLATE = '<div class="{designerClass}-edit-panel"></div>';

    /**
     *
     */
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout"><ul /></div>';


    LayoutDesigner.NAME = 'layout-designer';

    LayoutDesigner.NS = 'layoutDesigner';

    Y.extend( LayoutDesigner, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        nodeSource : null,

        /**
         *
         */
        nodeLayout : null,

        /**
         *
         */
        _dropHitGotcha : function ( evt ) {
            //
            var _host           = this.get( 'host' ),
                _dragNode       = evt.target.get( 'node' ), 
                _designerClass  = this.get( 'designerClass' ),
                _contentClass   = '.' + _designerClass + '-content',
                _srcClass       = '.' + _designerClass + '-src',
                _contentNode    = _dragNode.one( _contentClass ) || _dragNode.one( _srcClass ),
                _contentTag     = _contentNode.get( 'tagName' ).toLowerCase(),
                _dropNode       = _dragNode.ancestor( 'ul' ),
                _parentHost     = null,
                _config         = null,
                _forceWidth     = null,
                _cellWidth      = null,
                _ulNode         = null,
                _liList         = null;

            if ( !_dropNode.layoutDesignerPlaces ) {
                return;
            } else if ( _contentNode.layoutDesignerContent ) {
                _parentHost = _contentNode.layoutDesignerContent.get( 'parentNode' );
            } else if ( _contentNode.layoutDesignerPlaces  ) {
                _parentHost = _contentNode.layoutDesignerPlaces.get( 'parentNode' );
            } else {
                // prepare content list for new row
                _liList = [];
                // restaure source
                if ( _contentTag === 'div' ) {
                    // ...
                    _liList.push( _contentNode.cloneNode( true ) );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addTextSource();
                } else if ( _contentTag === 'img' ) {
                    // ...
                    _liList.push( _contentNode.cloneNode( true ) );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addImageSource();
                } else if ( _contentTag === 'table' ) {
                    // create ul on fly to avoid conflict
                    _contentNode.all( 'td' ).each( function( v, k ) {
                        // prepare config
                        var _clone  = v.one( 'div' ) || v.one( 'img' );
                        // ...
                        _liList.push( _clone.cloneNode( true ) );
                    }, this );
                    // restore src
                    this.nodeSource.layoutDesignerSources.addRowSource();
                } else {
                    return; // ??
                }
            }

            if ( _liList ) {

                // ...
                _ulNode = Y.Node.create( '<ul/>' );

                // ...
                Y.each( _liList, function ( v, k ) {
                    var _li = Y.Node.create( '<li />' );
                    _li.append( v );
                    _ulNode.append( _li );
                } );

                // replace table by ul
                _contentNode.replace( _ulNode );
                // update the node var
                _contentNode = _ulNode;

                // prepare config
                _config = this.getAttrs();
                _config.baseNode = _host;
                _config.parentNode = _host;

                // plug it
                _config.placesType = this.get( 'startingType' ) === 'horizontal' ? 'vertical' : 'horizontal';
                _contentNode.plug( Y.Bewype.LayoutDesignerPlaces, _config );

                // register
                _dropNode.layoutDesignerPlaces.registerContent( _contentNode );

                // update parent node propertie
                _contentNode.layoutDesignerPlaces.set( 'parentNode', _dropNode );

                // refresh new parent
                _forceWidth = _dropNode.layoutDesignerPlaces.getMaxWidth();
                _cellWidth  = _dropNode.layoutDesignerPlaces.refresh( _forceWidth );

                // start width max width
                _contentNode.layoutDesignerPlaces.refresh( _forceWidth, true );

                // get base
                if ( _placesType === 'vertical' ) {
                    _srcSortable.join( this.sortable, 'outer' );
                }

                this.nodeLayout.one( 'ul' ).all( 'ul' ).each( function ( v, k) {
                    if ( v != _contentNode ) {
                        v.layoutDesignerPlaces.sortable.join(
                            _contentNode.layoutDesignerPlaces.sortable, 'full' );
                    }
                }, this );

            }
        },

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

            // update config for children
            config.baseNode   = _host;
            config.placesType = this.get( 'startingType' );

            // create source node
            this.nodeSource = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( this.nodeSource );
            // plug source bar
            this.nodeSource.plug( Y.Bewype.LayoutDesignerSources, config );

            // create edit panel node
            _nodePan = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_PAN_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach src parent to widget
            _host.append( _nodePan );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_LAYOUT_TEMPLATE, {
                designerClass : _designerClass
            } ) );
            // attach layout node to main node
            _host.append( this.nodeLayout );
            //
            this.nodeLayout.setStyle( 'width', _layoutWidth );

            // plug places
            this.nodeLayout.one( 'ul' ).plug( Y.Bewype.LayoutDesignerPlaces, config );

            // refresh at start
            this.nodeLayout.one( 'ul' ).layoutDesignerPlaces.refresh();

            
            // join main sortables
            this.nodeSource.layoutDesignerSources.sortable.join(
                    this.nodeLayout.one( 'ul' ).layoutDesignerPlaces.sortable, 'outer' );

            // ... 
            Y.DD.DDM.on( 'drag:end', Y.bind( this._dropHitGotcha, this ) );
        },

        /**
         *
         */
        destructor: function () { 

            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _srcNode       = _host.one( '.' + _designerClass + '-sources' ),
                _panNode       = _host.one( '.' + _designerClass + '-edit-panel' ),
                _tableOrUl     = this.nodeLayout.one( 'table' ) || this.nodeLayout.one( 'ul' );

            // remove our designer specific nodes
            _srcNode.remove();
            _panNode.remove();

            // unplug all
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerPlaces );

            // move layout table to top
            if ( _tableOrUl ) {
                this.nodeLayout.replace( _tableOrUl );
            } else {
                this.nodeLayout.remove();
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
    LayoutDesignerContent.NAME = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContent.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContent, Y.Bewype.LayoutDesignerConfig, {

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

            // ??
            this.setAttrs( config );
            
            // temp var
            var _host          = this.get( 'host' ),
                _designerClass = this.get( 'designerClass' ),
                _contentType   = this.get( 'contentType' );

            // remove source classes
            _host.removeClass( _designerClass + '-src' );

            // add content classes
            _host.addClass( _designerClass + '-content' );
            _host.addClass( _designerClass + '-content-' +  _contentType );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ), _host );

            // init async queue
            this._q = new Y.AsyncQueue();
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _parentNode      = this.get( 'parentNode' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _cloneNode       = this.getCloneNode();
            
            // detach editor
            if ( this.editing === true ) {
                this._detachEditor();
            }
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            _host.detachAll( 'mouseenter' );

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
        getCloneNode : function () {
            var _host         = this.get( 'host' ),
                _div          = _host.ancestor( 'div' ),
                _contentClass = this.get( 'designerClass' ) + '-content';

            return _div.one( 'div.' + _contentClass + '-clone' );
        },

        /**
         *
         */
        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            cloneNode = cloneNode || this.getCloneNode();

            // re-check
            if ( cloneNode ) {
                // set children visible
                Y.each( cloneNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'hidden' );
                } );
                // hide the clone
                cloneNode.setStyle( 'visibility', 'hidden' );
            }
        },

        /**
         *
         */
        _addCloneNode : function () {
            
            // temp var
            var _host           = this.get( 'host' ),
                _div            = _host.ancestor( 'div' ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _cloneNode      = new Y.Node.create( '<div class="' + _contentClass + '-clone" />' ),
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _dragNode       = null,
                _dragNodeClass  = _contentClass + '-clone-drag',
                _editNode       = null,
                _removeNode     = null;

            // add clone
            _div.append( _cloneNode );

            // setStyle
            _cloneNode.setStyle( 'bottom',   0 );
            _cloneNode.setStyle( 'left',     1 );
            _cloneNode.setStyle( 'position', 'absolute');
            _cloneNode.setStyle( 'z-index',  this.get( 'cloneZIndex' ));

            // add to clone
            _cloneNode.append( _callbacksNode );

            // add cb div
            _dragNode = new Y.Node.create( '<div class="' + _dragNodeClass + '" />' );
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

            //
            return _cloneNode;
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _host            = this.get( 'host'          ),
                _bNode           = this.get( 'baseNode'      ),
                _pNode           = this.get( 'parentNode'    ),
                _sourcesClass    = this.get( 'designerClass' ) + '-sources',
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _sourcesNode     = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _pl              = _pNode.layoutDesignerPlaces,
                _placesType      = _pl.get( 'placesType' ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _activeButtons   = this.get( 'contentType' ) === 'image' ? 'editorImageButtons' : 'editorTextButtons',
                _conf            = null,
                _maxWidth        = null,
                _pPn             = ( _placesType === 'vertical' ) ? _pl.get( 'parentNode' ) : null,
                _pPl             = _pPn ? _pPn.layoutDesignerPlaces : null;

            // hide sources
            _sourcesNode.setStyle( 'display', 'none'  );
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
            _host.plug( _editorObj, _conf );
            // _host.ancestor( 'li' ).setStyle( 'border-width', '0' );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _host );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _host );

            // set editing flag to false
            this.editing = true;
        },

        /**
         *
         */
        _detachEditor : function () {

            // temp var
            var _host            = this.get( 'host' ),
                _bNode           = this.get( 'baseNode'      ),
                _sourcesClass    = this.get( 'designerClass' ) + '-sources',
                _editPanClass    = this.get( 'designerClass' ) + '-edit-panel',
                _sourcesNode     = _bNode.one( 'div.' + _sourcesClass ),
                _editPanNode     = _bNode.one( 'div.' + _editPanClass ),
                _editorObj       = this.get( 'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText;

            // set editing flag to false
            this.editing = false;

            if ( _editPanNode && _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );
                _host.unplug( _editorObj );
                // _host.ancestor( 'li' ).setStyle( 'border-width', '1px' );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }
                
            // show sources
            if ( _editPanNode ) {
                _editPanNode.setStyle( 'display', 'none'  );
            }

            if ( _sourcesNode ) {
                _sourcesNode.setStyle( 'display', 'block' );
            }                

            // refresh clone
            this._refreshCloneNode();

            return true;
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
        _onMouseEnter : function ( evt ) {
            
            // do nothing when editing
            if ( this.editing ) { return; }

            // temp var
            var _parentNode   = this.get( 'parentNode' ),
                _cloneNode    = this.getCloneNode();

            // clean first
            _parentNode.layoutDesignerPlaces.cleanContentOver();

            if ( _cloneNode ) {
                // set children visible
                Y.each( _cloneNode.all( 'div' ), function( v, k ) {
                    v.setStyle( 'visibility', 'visible' );
                } );
                //
                _cloneNode.setStyle( 'visibility', 'visible' );
            } else {
                _cloneNode = this._addCloneNode();
            }

            // stop first
            this._q.stop();
            // add clean cb
            this._q.add(
                    { fn: function () {}, timeout: 1000 },
                    { fn: this.hideClone, args: [ _cloneNode ] } );
            // restart
            this._q.run();
        },

        /**
         *
         */
        getContentHeight : function () {
            // temp var
            var _host    = this.get( 'host' ),
                _cHeight = Y.Bewype.Utils.getHeight( _host ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _host, 'paddingTop'    ) || 0,
                _pBottom = Y.Bewype.Utils.getStyleValue( _host, 'paddingBottom' ) || 0;
            // return width
            return _cHeight + _pTop + _pBottom + 2;

        },

        /**
         *
         */
        getContentWidth : function () {
            // temp var
            var _host   = this.get( 'host' ),
                _cWidth = Y.Bewype.Utils.getWidth( _host ),
                _pRight = Y.Bewype.Utils.getStyleValue( _host, 'paddingRight' ) || 0,
                _pLeft  = Y.Bewype.Utils.getStyleValue( _host, 'paddingLeft'  ) || 0;
            // return width
            return _cWidth + _pLeft + _pRight + 2;
        },

        /**
         *
         */
        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _cloneNode    = this.getCloneNode(),
                _h            = this.getContentHeight(),
                _w            = forcedWidth || this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h - 2 );
                _cloneNode.setStyle( 'width',  _w - 2 );
            }
        },

        /**
         *
         */
        refresh : function ( forcedWidth, justAdded ) {

            // temp var
            var _parentNode   = this.get( 'parentNode' ),
                _host         = this.get( 'host'       ),
                _contentWidth = null;

            // force node width
            if ( forcedWidth ) {

                // prepare content width
                _contentWidth = this.getContentWidth();
                //
                if ( justAdded ) {
                    _contentWidth = forcedWidth;
                } else if ( forcedWidth ) {
                    _contentWidth = _contentWidth > forcedWidth ? forcedWidth : _contentWidth;
                }
                _contentWidth -= 2;

                _host.setStyle( 'width',  _contentWidth );
                _host.setStyle( 'paddingLeft',  0 );
                _host.setStyle( 'paddingRight', 0 );

                // refresh clone
                this._refreshCloneNode( _contentWidth );

            } else {

                // refresh clone
                this._refreshCloneNode();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute', 'bewype-layout-designer-config', 'bewype-editor']});
YUI.add('bewype-layout-designer-places', function(Y) {


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



}, '@VERSION@' ,{requires:['sortable', 'dd-constrain', 'bewype-layout-designer-content-text']});
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
    LayoutDesignerSources.TXT_SRC_TEMPLATE =  '<div class="{designerClass}-src" ';
    LayoutDesignerSources.TXT_SRC_TEMPLATE += 'style="width: 80px; height: 40px">Text</div>';

    /**
     *
     */
    LayoutDesignerSources.IMG_SRC_TEMPLATE =  '<img class="{designerClass}-src" ';
    LayoutDesignerSources.IMG_SRC_TEMPLATE += 'style="width: 80px; height: 40px" src="{defaultImg}"/>';

    /**
     *
     */
    LayoutDesignerSources.ROW_SRC_TEMPLATE =  '<table class="{designerClass}-src {designerClass}-src-horizontal"><tr>';
    LayoutDesignerSources.ROW_SRC_TEMPLATE += '<td><div>' + LayoutDesignerSources.TXT_SRC_TEMPLATE + '</div></td>';
    LayoutDesignerSources.ROW_SRC_TEMPLATE += '<td><div>' + LayoutDesignerSources.TXT_SRC_TEMPLATE + '</div></td>';
    LayoutDesignerSources.ROW_SRC_TEMPLATE += '</tr></table>';


    Y.extend( LayoutDesignerSources, Y.Bewype.LayoutDesignerConfig, {

        sortable : null,

        /**
         *
         */
        _addSourceItem : function ( srcNode ) {
            var _host = this.get( 'host' ),
                _ul   = _host.one( 'ul' ),
                _li   = new Y.Node.create( "<li><div /></li>" ),
                _div  = _li.one( 'div' );

            // prepare div 
            _div.setStyle( 'position', 'relative' );
            _div.append( srcNode );

            // udpate source list
            _ul.append( _li );
        },

        /**
         *
         */
        addRowSource : function () {

            // create source components & attach
            var _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.ROW_SRC_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );

            // update list
            this._addSourceItem( _n );
        },

        /**
         *
         */
        addTextSource : function () {

            // create source components & attach
            var _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.TXT_SRC_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );

            // update list
            this._addSourceItem( _n );
        },

        /**
         *
         */
        addImageSource : function () {

            // create source components & attach
            var _n = new Y.Node.create( Y.substitute( LayoutDesignerSources.IMG_SRC_TEMPLATE, {
                designerClass : this.get( 'designerClass' ),
                defaultImg    : this.get( 'defaultImg'    )
            } ) );

            // update list
            this._addSourceItem( _n );
        },

        /**
         *
         */
        initializer: function ( config ) {

            // ??
            this.setAttrs( config );

            // create table for sources and attach it
            var _host     = this.get( 'host' ),
                _groups   = this.get( 'sourceGroups' ),
                _labels   = this.get( 'sourceLabels' ),
                _ulSrc    = new Y.Node.create( '<ul />' );

            //
            _host.append( _ulSrc );

            this.addRowSource();
            this.addTextSource();
            this.addImageSource();

            this.sortable = new Y.Sortable( {
                container   : _ulSrc,
                nodes       : 'li',
                opacity     : '.2'
            } );
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


YUI.add('bewype-layout-designer', function(Y){}, '@VERSION@' ,{use:['bewype-layout-designer-config', 'bewype-layout-designer-base', 'bewype-layout-designer-content', 'bewype-layout-designer-places', 'bewype-layout-designer-sources']});

