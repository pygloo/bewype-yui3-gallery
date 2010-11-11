
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

