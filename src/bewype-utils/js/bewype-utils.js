
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
        getHeight : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            var _aVal = node.getAttribute( 'height' ),
                _cVal = node.getComputedStyle( 'height' );

            // return int height
            return parseInt( _aVal || _cVal, default_ );
        },

        /**
         *
         */
        getWidth : function( node, default_ ) {

            // ensure default
            default_ = default_ ? default_ : 0;

            var _aVal = node.getAttribute( 'width' ),
                _cVal = node.getComputedStyle( 'width' );

            // return int width
            return parseInt( _aVal || _cVal, default_ );
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
                    _value = v.value.trim(),
                    _s = null,
                    _r = null;
                if ( _name && _value ) {
                    if ( _name === 'padding' ) {    
                        // prepare schema
                        _s = {
                            resultFields: [ {key:'top'}, {key:'right'}, {key:'bottom'}, {key:'left'} ]
                        };
                        // apply schema
                        _r = Y.DataSchema.Array.apply( _s, [_value.split(' ')] ).results[ 0 ];
                        // update css dict
                        Y.each( [ 'top', 'left' ], function( v, k ) {
                            // prepare name
                            var _n = camelize ? Y.Bewype.Utils.camelize( _name + '-' + v ) : _name + '-' + v;
                            if ( _r[ v ] ) {
                                // do update
                                _cssDict[ _n ] = _r[ v ].trim();
                            } else {
                                // do update
                                _cssDict[ _n ] = 0;
                            }
                        } );
                    } else {
                        _cssDict[ _name.trim() ] = _value;
                    }
                }
            } );

            // return dict
            return _cssDict;
        }
    };

    /**
     *
     */
    Utils.NAME = "bewypeUtils";

    Y.namespace('Bewype');
    Y.Bewype.Utils = Utils;

