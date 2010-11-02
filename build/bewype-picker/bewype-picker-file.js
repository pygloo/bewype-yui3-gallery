YUI.add('bewype-picker-file', function(Y) {


    /**
     *
     */
    var PICKER_TMPL = '',
        PickerFile  = function(config) {
        PickerFile.superclass.constructor.apply(this, arguments);
    };
    
    /**
     *
     */
    PICKER_TMPL += '<div class="{pickerClass}"><table>';
    PICKER_TMPL += '  <tr>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <div class="{pickerClass}-label">File</div>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '    <td>';
    PICKER_TMPL += '      <form>';
    PICKER_TMPL += '        <input class="{pickerClass}-input" type="file" />';
    PICKER_TMPL += '      </form>';
    PICKER_TMPL += '    </td>';
    PICKER_TMPL += '  </tr>';
    PICKER_TMPL += '</table></div>';

    /**
     */
    PickerFile.NAME = "pickerFile";

    /**
     *
     */
    PickerFile.ATTRS = {
        pickerClass : {
            value : 'bewype-picker-file',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }
        },
        uploadUrl : {
            value : null,
            writeOnce : true
        }
    };

    Y.extend( PickerFile, Y.Widget, {

        _fileName : null,

        /**
         *
         */
        initializer : function( config ) {

            // our custom event
            this.publish( 'picker:onChange' );
        },

        renderUI : function () {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerClass  = this.get( 'pickerClass' ),
                _pickerNode   = null,
                _inputNode    = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass
                } )
            );
            _contentBox.append( _pickerNode );

            // set event callback
            _inputNode = _contentBox.one( '.' + _pickerClass + '-input' );
            // set value
            if ( this._fileName ) {
                _inputNode.set( 'value', this._fileName );
            }
            //
            _inputNode.on( 'yui3-picker-event|change', Y.bind( this._onInputChange, this ) );
        },

        bindUI : function () {
        },

        syncUI : function () {
        },

        /**
         *
         */
        destructor : function() {

            // tmp vars
            var _contentBox  = this.get( 'contentBox' ),
                _pickerNode  = _contentBox.one( '.' + this.get( 'pickerClass' ) );

            // little check
            if ( _pickerNode ) {

                // remove events
                Y.detach('yui3-picker-event|change');
                
                // remove main div
                _pickerNode.remove();
            }
        },

        getValue : function() {
            return this._fileName;
        },

        setValue : function( _fileName ) {
            this._fileName = _fileName;
        },

        _doUpload : function () {

            // vars
            var _contentBox    = this.get( 'contentBox' ),
                _pickerForm    = _contentBox.one( 'form' ),
                _handleSuccess = null,
                _handleFailure = null,
                _conf          = null,
                _request       = null;
 
    		//A function handler to use for successful requests:
	    	var _handleSuccess = function(ioId, o){
                this._fileName = null;
            };
 
    		//A function handler to use for failed requests:
	    	var _handleFailure = function(ioId, o){
    		};
 
	    	//Subscribe our handlers to IO's global custom events:
		    Y.on('io:success', _handleSuccess);
    		Y.on('io:failure', _handleFailure);
 
 
    		/* Configuration object for POST transaction */
	    	_conf = {
		    	method: 'POST',
    			form: { id : _pickerForm },
	    		headers: { 'Content-Type': 'multipart/form-data' }
		    };
 
            _request = Y.io( this.get( 'uploadUrl' ), _conf );

    	},

        _onInputChange : function ( evt ) {

            // vars
            var _inputNode   = evt ? evt.target : null,
                _contentBox  = this.get( 'contentBox' ),
                _pickerForm  = _contentBox.one( 'form' );

            if ( _inputNode ) {

                // TODO - may be check the url first ???
                this._fileName = _inputNode.get( 'value' );

                this._doUpload()

                // fire custom event
                this.fire("picker:onChange");
            }
        }
    } );

    // manage custom event
    Y.augment( PickerFile, Y.EventTarget );

    Y.namespace('Bewype');
    Y.Bewype.PickerFile = PickerFile;



}, '@VERSION@' ,{requires:['io', 'stylesheet', 'substitute', 'widget', 'yui-base']});
