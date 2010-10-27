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
        parentNode : {
            value : null,
            writeOnce : true
        },
        editPanelNode : {
            value : null,
            writeOnce : true
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
            
            // detach editor
            this._detachEditor();
                    
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
        _detachEditor : function () {

            // temp var
            var _host = this.get( 'host' );

            // detach events
            _host.detachAll( 'bewype-editor:onClose'  );
            _host.detachAll( 'bewype-editor:onChange' );

            // set editing flag to false
            this.editing = false;

            if ( _host.bewypeEditor ) {
                // diconnect
                _host.unplug( Y.Bewype.Editor );
            }
        },

        /**
         *
         */
        _attachEditor : function () {

            //
            var _host           = this.get( 'host'          ),
                _pNode          = this.get( 'parentNode'    ),
                _editPanelNode  = this.get( 'editPanelNode' ),
                _availableWidth = _pNode.layoutDesignerPlaces.getAvailablePlace(),
                _conf           = null,
                _maxWidth       = null;

            if ( _editPanelNode ) {
                // set max width or not
                if ( _availableWidth ) {

                    // compute max width
                    _maxWidth =  _availableWidth;
                    _maxWidth += this.getContentWidth();

                    // update conf
                    _conf = {
                        panelNode       : _editPanelNode,
                        spinnerMaxWidth : _maxWidth
                        };

                } else {

                    // no max
                    _conf = { panelNode : _editPanelNode };
                }

                // plug
                _host.plug( Y.Bewype.Editor, _conf );

                // set editing flag to false
                this.editing = true;
                
                // set on close event
                Y.on( 'bewype-editor:onClose',  Y.bind( this._detachEditor, this ), _host );

                // set on change event
                Y.on( 'bewype-editor:onChange', Y.bind( this.refresh, this ), _host );
            }
        },

        /**
         *
         */
        _onClickEdit : function ( evt ) {

            // get callback
            var _pNode         = this.get( 'parentNode'    ),
                _editPanelNode = this.get( 'editPanelNode' );
            
            // do call
            if ( _editPanelNode ) {

                // stop editing all
                Y.each( _pNode.layoutDesignerPlaces.getContents(), function( v, k ) {
                    // update editing flag
                    v.layoutDesignerContent._detachEditor();
                } );

                // attach
                this._attachEditor();
            }
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

            // add cb div
            _editNode = new Y.Node.create(
                    '<div class="' + _contentClass + '-clone-edit" />' );
            // add to clone
            _callbacksNode.append( _editNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickEdit, this ), _editNode );

            // add cb div
            _removeNode = new Y.Node.create(
                    '<div class="' + _contentClass + '-clone-remove" />' );
            // add to clone
            _callbacksNode.append( _removeNode );
            // manage callback on click
            Y.on( 'click', Y.bind( this._onClickRemove, this ), _removeNode );

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

        getContentHeight : function () {
            // temp var
            var _host    = this.get( 'host' ),
                _cHeight = Y.Bewype.Utils.getHeight( _host ),
                _pTop    = Y.Bewype.Utils.getStyleValue( _host, 'paddingTop' ) || 0;
            // return width
            return _cHeight + _pTop;

        },

        getContentWidth : function () {
            // temp var
            var _host   = this.get( 'host' ),
                _cWidth = Y.Bewype.Utils.getWidth( _host ),
                _pLeft  = Y.Bewype.Utils.getStyleValue( _host, 'paddingLeft' ) || 0;
            // return width
            return _cWidth + _pLeft;
        },

        refresh : function ( height, width) {

            // temp var
            var _host           = this.get( 'host'         ),
                _parentNode     = this.get( 'parentNode'   ),
                _contentClass   = this.get( 'contentClass' ),
                _parentDiv      = _host.ancestor( 'div' ),
                _clone          = _parentDiv.one( 'div.' + _contentClass + '-clone' );
            
            // update clone height & width style
            if ( _clone ) {
                _clone.setStyle( 'height', this.getContentHeight() );
                _clone.setStyle( 'width' , this.getContentWidth()  );
            }

            // refresh parent target
            _parentNode.layoutDesignerTarget.refresh();
        }
    } );

    Y.namespace('Bewype');
    Y.Bewype.LayoutDesignerContent = LayoutDesignerContent;



}, '@VERSION@' ,{requires:['async-queue', 'plugin', 'substitute']});
