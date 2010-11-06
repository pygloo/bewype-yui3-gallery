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
    LayoutDesigner.NODE_LAYOUT_TEMPLATE = '<div class="{designerClass}-layout"></div>';


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
            var _host     = this.get( 'host' ),
                _nodeSrc  = null,
                _nodePan  = null;

            // create source node
            _nodeSrc = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_SRC_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach src parent to widget
            _host.append( _nodeSrc );
            // plug source bar
            _nodeSrc.plug( Y.Bewype.LayoutDesignerSources, {
                layoutWidth : this.get( 'layoutWidth' )
            } );

            // create edit panel node
            _nodePan = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_PAN_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach src parent to widget
            _host.append( _nodePan );

            // create dest layout
            this.nodeLayout = new Y.Node.create( Y.substitute( LayoutDesigner.NODE_LAYOUT_TEMPLATE, {
                designerClass : this.get( 'designerClass' )
            } ) );
            // attach layout node to main node
            _host.append( this.nodeLayout );
            //
            this.nodeLayout.setStyle( 'width', this.get( 'layoutWidth' ) );

            // plug target
            config.baseNode   = _host;
            config.targetType = 'start';
            this.nodeLayout.plug( Y.Bewype.LayoutDesignerTarget, config );
        },

        /**
         *
         */
        destructor: function () { 
            this.nodeLayout.unplug( Y.Bewype.LayoutDesignerTarget );
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
YUI.add('bewype-layout-designer-content-base', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentBase = function ( config ) {
        LayoutDesignerContentBase.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentBase.NAME = 'layout-designer-content';

    /**
     *
     */
    LayoutDesignerContentBase.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContentBase, Y.Bewype.LayoutDesignerConfig, {

        /**
         *
         */
        _q : null,

        /**
         *
         */
        editing : false,

        _init: function ( template ) {
            
            // temp var
            var _host        = this.get( 'host' ),
                _parentNode  = this.get( 'parentNode' ),
                _contentNode = null;

            // add dest node
            _contentNode = new Y.Node.create( Y.substitute( template, {
                designerClass : this.get( 'designerClass' ),
                contentType   : this.get( 'contentType' )
            } ) ); // create content node
            // dom add
            _host.append( _contentNode );
        
            // common default height
            _contentNode.setStyle( 'height', this.get( 'contentHeight' ) );
            _contentNode.setStyle( 'width',  this.get( 'contentWidth'  ) );

            // set event management
            Y.on( 'mouseenter', Y.bind( this._onMouseEnter, this ) , _host );
                    
            // register it
            _parentNode.layoutDesignerPlaces.registerContent( _host );

            //
            this._q = new Y.AsyncQueue();

            // return the new content node
            return _contentNode;
        },

        /**
         *
         */
        initializer : function( config ) {
            // ??
            this.setAttrs( config );
        },

        /**
         *
         */
        destructor : function () {

            // temp var
            var _host            = this.get( 'host'          ),
                _parentNode      = this.get( 'parentNode'    ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _contentSelector = this.get( 'contentType' ) === 'image' ? 'img.' : 'div.',
                _contentNode     = _host.one( _contentSelector + _contentClass ),
                _cloneNode       = _host.one( 'div.' + _contentClass + '-clone' );
            
            // detach editor
            this._detachEditor();
                    
            // unregister it
            _parentNode.layoutDesignerPlaces.unRegisterContent( _host );

            // clean events
            Y.detach( _host );

            // remove content node
            _contentNode.remove();

            // and remove the clone
            if ( _cloneNode ) {
                // clean events
                Y.Event.purgeElement( _cloneNode, true );
                // remove
                _cloneNode.remove();
            }

            // remove host
            _host.remove();
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
                _editPanNode     = _bNode.one( 'div.' + _editPanClass );

            if ( _editPanNode.bewypeEditorPanel ) {

                // diconnect
                _editPanNode.unplug( Y.Bewype.EditorPanel );

                // detach events
                _host.detachAll( 'bewype-editor:onClose'  );
                _host.detachAll( 'bewype-editor:onChange' );

                // just in case
                this.refresh();
            }

            // set editing flag to false
            this.editing = false;
                
            // show sources
            _editPanNode.setStyle( 'display', 'none'  );
            _sourcesNode.setStyle( 'display', 'block' );

            // refresh clone
            this._refreshCloneNode();

            return true;
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
                _availableWidth  = _pNode.layoutDesignerPlaces.getAvailablePlace(),
                _editorClass     = this.get(  'contentType' ) === 'image' ? Y.Bewype.EditorTag : Y.Bewype.EditorText,
                _activeButtons   = this.get(  'contentType' ) === 'image' ? 'editorImageButtons' : 'editorTextButtons',
                _contentNode     = this.getContentNode(),
                _conf            = null,
                _maxWidth        = null;

            // hide sources
            _sourcesNode.setStyle( 'display', 'none'  );
            _editPanNode.setStyle( 'display', 'block' );

            // compute max width
            _maxWidth =  _availableWidth ? _availableWidth : 0;
            _maxWidth += this.getContentWidth();

            // update conf
            _conf = {
                panelNode       : _editPanNode,
                spinnerMaxWidth : _maxWidth,
                activeButtons   : this.get( _activeButtons )
            };

            // plug
            _contentNode.plug( _editorClass, _conf );
            
            // set on close event
            Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _contentNode );

            // set on change event
            Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _contentNode );

            // set editing flag to false
            this.editing = true;
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

        hideClone : function ( cloneNode ) {

            // ensure cloneNode
            if ( !cloneNode ) {
                // temp var
                var _host           = this.get( 'host'          ),
                    _contentClass   = this.get( 'designerClass' ) + '-content';
                // get existing clone
                cloneNode = _host.one( 'div.' + _contentClass + '-clone' );
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

        _addCloneNode : function () {
            
            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _callbacksNode  = new Y.Node.create( '<div class="' + _contentClass + '-clone-callbacks" />' ),
                _cloneNode      = null,
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
        _onMouseEnter : function ( evt ) {
            
            // do nothing when editing
            if ( this.editing ) { return; }

            // temp var
            var _host         = this.get( 'host'          ),
                _parentNode   = this.get( 'parentNode'    ),
                _contentClass = this.get( 'designerClass' ) + '-content',
                _cloneNode    = _host.one( 'div.' + _contentClass + '-clone' ); // get existing clone

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

        getContentHeight : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cHeight = Y.Bewype.Utils.getHeight( _contentNode ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingTop'    ) || 0,
                _pBottom = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingBottom' ) || 0;
            // return width
            return _cHeight + _pTop + _pBottom;

        },

        getContentWidth : function () {
            // temp var
            var _contentNode = this.getContentNode(),
                _cWidth      = Y.Bewype.Utils.getWidth( _contentNode ),
                _pRight      = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingRight' ) || 0,
                _pLeft       = Y.Bewype.Utils.getStyleValue( _contentNode, 'paddingLeft'  ) || 0;
            // return width
            return _cWidth + _pLeft + _pRight;
        },

        getContentNode : function () {
            var _host            = this.get( 'host' ),
                _contentClass    = this.get( 'designerClass' ) + '-content',
                _contentSelector = this.get( 'contentType' ) === 'image' ? 'img.' : 'div.';

            return _host.one( _contentSelector + _contentClass );
        },

        _refreshCloneNode : function ( forcedWidth ) {

            // temp var
            var _host           = this.get( 'host'          ),
                _contentClass   = this.get( 'designerClass' ) + '-content',
                _cloneNode      = _host.one( 'div.' + _contentClass + '-clone' ),
                _h              = this.getContentHeight(),
                _w              = forcedWidth || this.getContentWidth();
            
            // update clone height & width style
            if ( _cloneNode ) {
                _cloneNode.setStyle( 'height', _h );
                _cloneNode.setStyle( 'width',  _w );
            }
        },

        refresh : function ( forcedWidth ) {

            // temp var
            var _parentNode  = this.get( 'parentNode' ),
                _contentNode = this.getContentNode();

            // force node width
            if ( _contentNode ) {

            }

            // refresh clone
            this._refreshCloneNode( forcedWidth );

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentBase = LayoutDesignerContentBase;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute']});
YUI.add('bewype-layout-designer-content-image', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentImage = function ( config ) {
        LayoutDesignerContentImage.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentImage.C_TEMPLATE =  '<image class="{designerClass}-content ';
    LayoutDesignerContentImage.C_TEMPLATE += '{designerClass}-content-{contentType}" ';
    LayoutDesignerContentImage.C_TEMPLATE += 'src="{defaultImg}" />';
    /**
     *
     */
    LayoutDesignerContentImage.NAME  = 'layout-designer-content-image';

    /**
     *
     */
    LayoutDesignerContentImage.NS    = 'layoutDesignerContent';

    /**
     *
     */
    Y.extend( LayoutDesignerContentImage, Y.Bewype.LayoutDesignerContentBase, {

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

            // init content  node and plugin content base
            var _template = Y.substitute( LayoutDesignerContentImage.C_TEMPLATE, {
                    defaultImg : this.get( 'defaultImg' )
                } );

            // do init
            this._init( _template );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentImage = LayoutDesignerContentImage;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
YUI.add('bewype-layout-designer-content-text', function(Y) {


    /**
     *
     */
    var LayoutDesignerContentText = function ( config ) {
        LayoutDesignerContentText.superclass.constructor.apply( this, arguments );
    };

    /**
     *
     */
    LayoutDesignerContentText.C_TEMPLATE =  '<div class="{designerClass}-content ';
    LayoutDesignerContentText.C_TEMPLATE += '{designerClass}-content-{contentType}">';
    LayoutDesignerContentText.C_TEMPLATE += '</div>';

    /**
     *
     */
    LayoutDesignerContentText.NAME = 'layout-designer-content-text';

    /**
     *
     */
    LayoutDesignerContentText.NS   = 'layoutDesignerContent';

    Y.extend( LayoutDesignerContentText, Y.Bewype.LayoutDesignerContentBase, {

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

            // init content  node and plugin content base
            var _contentNode = this._init( LayoutDesignerContentText.C_TEMPLATE );

            // set default content
            _contentNode.set( 'innerHTML', this.get( 'defaultText' ) );
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContentText = LayoutDesignerContentText;



}, '@VERSION@' ,{requires:['bewype-editor', 'bewype-layout-designer-content-base']});
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
                _nodes = ( _placesType === 'horizontal' ) ? 'td' : 'li';

            if ( this.sortable ) {
                this.sortable.destroy();
            }

            // make it sortable
            this.sortable = new Y.Sortable( {
                container   : this.placesNode,
                nodes       : _nodes,
                opacity     : '.2'
            } );

            /*
            this.sortable.delegate.dd.plug( Y.Plugin.DDConstrained, {
                constrain2node: this.get( 'host' )
            } );
            */

            // ... 
            Y.DD.DDM.on( 'drop:hit', Y.bind( this._dropHitGotcha, this ), this.placesNode );
        },

        /**
         *
         */
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
                // _finalPlaces = _dropPlaces.hasPlace( _contentWidth ) ? _dropPlaces : _parentHost.layoutDesignerPlaces;
                _finalPlaces = _parentHost.layoutDesignerPlaces;
                
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
                _placesType = this.get( 'placesType' ),
                _pPlaces    = this.get( 'parentNode' ) ? _parentNode.layoutDesignerPlaces : null,
                _pNodeWidth = Y.Bewype.Utils.getWidth( _parentNode ),
                _pWidth     = _pPlaces ? _pPlaces.getAvailablePlace() : _pNodeWidth,
                _cWidth     = this.getPlacesWidth();

            if ( _placesType === 'vertical' ) {
                // just added or already set
                return _cWidth === 0 ? _pWidth : _cWidth;

            } else {
                // simple diff
                return _pWidth - _cWidth;
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
                    // get parent li
                    _destNode = contentNode.ancestor( 'li' );
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
    LayoutDesignerSources.ITEM_SRC_TEMPLATE = '<div class="{designerClass}-src {designerClass}-src-{itemType}">{itemLabel}</div>';

    /**
     *
     */
    LayoutDesignerSources.ATTRS = {
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
        }
    };

    Y.extend( LayoutDesignerSources, Y.Plugin.Base, {

        /**
         *
         */
        _groups : [ 'horizontal', 'vertical', 'text', 'image' ],

        /**
         *
         */
        _labels: [ 'Layout Horizontal', 'Layout Vertical', 'Text', 'Image' ],

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
                    itemType      : v,
                    designerClass : this.get( 'designerClass' ),
                    itemLabel     : this._labels[ k ]
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
            this.refresh();
        },

        _onClickRemove: function ( evt ) {

            // temp vars
            var _host     = this.get( 'host' );
            
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
                _destNode   = _targetType === 'start' ? _host : _host.layoutDesignerPlaces.addDestNode();

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
                // add places and target
                this._addPlaces( _destNode, _hitType );
                this._addTarget( _destNode, _hitType );
                // refresh dest node
                if ( _hitType !== 'start' ) {
                    _destNode.layoutDesignerTarget.refresh();
                }
            } else {
                // default: add content text or image
                _host.layoutDesignerPlaces.addContent( _hitType );
            }

            // restore width
            this._afterDropExit( evt );
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
                    // this._targetNode.setY( _parentNode.getY() + _pHeight - _hHeight );

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
                    // etbi way
                    // _host.setX( _parentNode.getX() + _pWidth );
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

            if ( _parentNode != _host ) {
                _parentNode.layoutDesignerTarget.refresh();
            }
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerTarget = LayoutDesignerTarget;



}, '@VERSION@' ,{requires:['bewype-layout-designer-places']});


YUI.add('bewype-layout-designer', function(Y){}, '@VERSION@' ,{use:['bewype-layout-designer-config', 'bewype-layout-designer-base', 'bewype-layout-designer-content-base', 'bewype-layout-designer-content-image', 'bewype-layout-designer-content-text', 'bewype-layout-designer-places', 'bewype-layout-designer-sources', 'bewype-layout-designer-target']});

