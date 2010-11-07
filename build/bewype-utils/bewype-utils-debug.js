YUI.add('bewype-utils', function(Y) {


    /**
     *
     */

    var Utils = null;

    /**
     *
     */
    Utils = {
                   
        camelize : function ( str, upperFirst, sep ) {

            // set default sep to -
            sep = sep ? sep : '-';

            // set default upperFirst to false
            upperFirst = Y.Lang.isUndefined( upperFirst ) ? false : upperFirst;

            // prepare vars
            var _values = str.split(sep),
                _result = '';

            // update result
            Y.each( _values, function( v, k ) {
                if ( k === 0 && !upperFirst ) {
                    _result += v.toLowerCase();
                } else {
                    _result += v.charAt(0).toUpperCase();
                    _result += v.substring(1, v.length).toLowerCase();
                }
            } );

            // return it
            return _result;
        },

        /**
         *
         */
        getStyleValue : function( node, name, default_ ) {

            if ( !node ) { return; }

            // ensure default
            default_ = default_ ? default_ : 0;

            var _aVal = node.getAttribute( name ),
                _cVal = node.getComputedStyle( name );

            // return int value - TODO see if useful for non int value :s
            return parseInt( _aVal || _cVal, default_ );
        },

        /**
         *
         */
        getHeight : function( node, default_ ) {
            // return int height
            return this.getStyleValue( node, 'height', default_ );
        },

        /**
         *
         */
        getWidth : function( node, default_ ) {
            // return int width
            return this.getStyleValue( node, 'width', default_ );
        },

        getCssDict : function ( node, camelize ) {

            // ...
            var _styleData  = node.getAttribute( 'style' ),
                _schema     = null,
                _results    = null,
                _cssDict    = {};

            // prepare schema
            _schema = {
                resultDelimiter : ';',
                fieldDelimiter  : ':',
                resultFields    : [ {key:'name'}, {key:'value'} ]
            };
            // apply schema
            _results = Y.DataSchema.Text.apply( _schema, _styleData ).results;

            // convert to dict
            Y.each( _results, function( v, k ) {
                var _name  = camelize ? Y.Bewype.Utils.camelize( v.name ) : v.name.trim(),
                    _value = (v.value) ? v.value.trim() : null,
                    _spVal = _value ? _value.split(' ') : null,
                    _s = null,
                    _r = null;
                if ( _name && _value ) {
                    if ( _name === 'padding' ) {
                        if ( _spVal && _spVal.length === 4 ) {

                            // prepare schema
                            _s = {
                                resultFields: [ {key:'top'}, {key:'right'}, {key:'bottom'}, {key:'left'} ]
                            };
                            // apply schema
                            _r = Y.DataSchema.Array.apply( _s, [ _spVal ] ).results[ 0 ];
                            // update css dict
                            Y.each( [ 'top', 'right', 'bottom', 'left' ], function( v, k ) {
                                // prepare name
                                var _n = camelize ? Y.Bewype.Utils.camelize( _name + '-' + v ) : _name + '-' + v;
                                // do update
                                _cssDict[ _n ] = _r[ v ] ? _r[ v ].trim() : 0;
                            } );

                        } else if ( _spVal.length === 2 ) {   

                            // prepare schema
                            _s = {
                                resultFields: [ {key:'top-bottom'}, {key:'right-left'} ]
                            };
                            // apply schema
                            _r = Y.DataSchema.Array.apply( _s, [ _spVal ] ).results[ 0 ];
                            // update css dict
                            Y.each( [ 'top', 'right', 'bottom', 'left' ], function( v, k ) {
                                // prepare name
                                var _n = camelize ? Y.Bewype.Utils.camelize( _name + '-' + v ) : _name + '-' + v;
                                // do update
                                if ( v === 'top' || v === 'bottom' ) {
                                    _cssDict[ _n ] = _r[ 'top-bottom' ] ? _r[ 'top-bottom' ].trim() : 0;
                                } else {                                                                     
                                    _cssDict[ _n ] = _r[ 'right-left' ] ? _r[ 'right-left' ].trim() : 0;
                                }
                            } );
                                    
                        } else if ( _spVal.length === 1 ) {

                            // update css dict
                            Y.each( [ 'top', 'right', 'bottom', 'left' ], function( v, k ) {
                                // prepare name
                                var _n = camelize ? Y.Bewype.Utils.camelize( _name + '-' + v ) : _name + '-' + v;
                                // do update
                                _cssDict[ _n ] = _spVal[ 0 ];
                            } );
                        }
                    } else {
                        _cssDict[ _name.trim() ] = _value;
                    }
                }
            } );
            // return dict
            return _cssDict;
        },

        setCssDict : function ( node, cssDict ) {

            var _fn = null;                         

            // first clear all
            node.setStyle( 'cssText', '' );

            // udpate loop
            _fn = function ( key, val ) {
                // udpate style
                node.setStyle( this.camelize( key ) , val );
                // always return val to continue!
                return val;
            };
                     
            // trigger update
            Y.JSON.stringify( cssDict, Y.bind( _fn, this ) );
        },

        /**
        * @private
        * @method _getWindow
        * @description Get the Window of the IFRAME
        * @return {Object}
        */
        getWindow: function( node ) {
            var _iFrame = node.one( 'iframe' );
            return _iFrame.get( 'contentWindow' );
        },
                  
        /**
        * @private
        * @method _getDoc
        * @description Get the Document of the IFRAME
        * @return {Object}
        */
        getDocument: function( node ) {
            return this.getWindow( node ).get( 'document' );
        },

        /**
        * @private
        * @method getSelection
        * @description Handles the different selection objects across the A-Grade list.
        * @return {Object} Selection Object
        */
        getSelection : function ( node ) {
            var _win = this.getWindow( node ),
                _doc = _win.get( 'document' );

            if ( _win && _win._node.getSelection ) {
            	return _win._node.getSelection();
            } else if ( _doc && _doc._node.selection ) { // should come last; Opera!
            	return _doc._node.selection.createRange();
            }
            return null;
        },

        getRange : function ( selection ) {
	        if ( selection.getRangeAt ) {
                //
        		return selection.getRangeAt(0);

            } else { // Safari!
        		var _range        = document.createRange(),
                    _anchorNode   = selection.anchorNode,
                    _anchorOffset = selection.anchorOffset,
                    _focusNode    = selection.focusNode,
                    _focusOffset  = selection.focusOffset;
                // set range
		        _range.setStart( _anchorNode, _anchorOffset );
        		_range.setEnd( _focusNode, _focusOffset );
                //
		        return _range;
        	}
        }
    };

    /**
     *
     */
    Utils.NAME = "bewypeUtils";

    Y.namespace('Bewype');
    Y.Bewype.Utils = Utils;



}, '@VERSION@' ,{requires:['json-stringify', 'yui-base']});
