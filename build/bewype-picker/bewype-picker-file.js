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
    PICKER_TMPL += '      <form enctype="multipart/form-data" >';
    PICKER_TMPL += '        <div>';
    PICKER_TMPL += '          <input class="{pickerClass}-input" type="file" name="file" />';
    PICKER_TMPL += '        <div>';
    PICKER_TMPL += '        <div>';
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
            value : 'http://www.bewype.org/upload',
            writeOnce : true,
            validator : function( val ) {
                return Y.Lang.isString( val );
            }                
        }
    };

    Y.extend( PickerFile, Y.Widget, {

        /**
         *
         */
        _fileInfo : null,

        /**
         *
         */
        _q : null,

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
                _pickerNode   = null;

            // create table
            _pickerNode = new Y.Node.create(
                Y.substitute( PICKER_TMPL, {
                    pickerClass : _pickerClass
                } )
            );
            _contentBox.append( _pickerNode );
        },

        bindUI : function () {
        },

        syncUI : function () {

            // vars
            var _contentBox   = this.get( 'contentBox'  ),
                _pickerClass  = this.get( 'pickerClass' ),
                _inputNode    = null;

            // avoid previous value
            this._fileInfo = null;

            // set event callback
            _inputNode = _contentBox.one( '.' + _pickerClass + '-input' );

            //
            _inputNode.on( 'yui3-picker-event|change', Y.bind( this._onInputChange, this ) );

            // init q
            this._q = new Y.AsyncQueue();
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
            return this._fileInfo;
        },

        setValue : function( _fileInfo ) {
            this._fileInfo = _fileInfo;
        },

        _hideMessage : function ( msgNode ) {
            msgNode.remove();
        },

        _showMessage : function ( msg, error ) {

            // temp vars                           
            var _contentBox    = this.get( 'contentBox' ),
                _pickerForm    = _contentBox.one( 'form' ),
                _msgInner      = null,
                _msgClass      = this.get( 'pickerClass' ) + '-message',
                _errClass      = error ? 'error' : 'info',
                _msgNode       = _contentBox.one( '.' + _msgClass );

            // little check
            if ( !_pickerForm ) {
                return;
            }

            // remove previous message
            if ( _msgNode ) {
                _msgNode.remove();
            }
            
            // prepare message inner html
            _msgInner =  '<a class="';
            _msgInner += _msgClass;
            _msgInner += ' ';
            _msgInner += _msgClass + _errClass;
            _msgInner += '">';
            _msgInner += msg;
            _msgInner += '</a>';
            // create node
            _msgNode = new Y.Node.create( _msgInner );
            // add to dom
            _pickerForm.append( _msgNode );

            // stop first ( just in case )
            this._q.stop();

            // add clean cb
            this._q.add(
                { fn: function () {}, timeout: 1000 },
                { fn: this._hideMessage, args: [ _msgNode ] }
            );

            // restart
            this._q.run();
        },

        _doUpload : function () {

            // vars
            var _contentBox     = this.get( 'contentBox' ),
                _pickerForm     = _contentBox.one( 'form' ),
                _uploadUrl      = this.get( 'uploadUrl' ),
                _handleStart    = null,
                _handleComplete = null,
                _conf           = null,
                _request        = null;

    		//A function handler to use for successful requests:
	    	_handleStart = function( transactionid, args ) {
			    this._showMessage( 'Upload started...' );
            };

    		//A function handler to use for completed requests:
	    	_handleComplete = function( transactionid, response, args ) {
                if ( response.responseText === 'error' ) {  
                    // :(
    			    this._showMessage( 'Upload failed!', true );    
                } else {
                    // parse data
                    try {
                        // server should return some info for about the file it
                        // just receive, ex. for an image:
                        //  {
                        //      'contentType' : <image/png>,
                        //      'fileName'    : 'myFile.png',
                        //      'imgHeight'   : 20,
                        //      'imgWidth'    : 20
                        //  }
                        // ... in json string
                        this._fileInfo = Y.JSON.parse( response.responseText );
                        // :)
        			    this._showMessage( 'File successfully uploaded' );
                    } catch (e) {
                        // :(
        			    this._showMessage( 'Upload failed - Invalid Data!', true );
                    }                     
                    // fire custom event on success
                    this.fire("picker:onChange");
                }
            };
 
	    	//Subscribe our handlers to IO's global custom events:
		    Y.on('io:start',    Y.bind( _handleStart, this ) );
		    Y.on('io:complete', Y.bind( _handleComplete, this ) );
 
    		// Configuration object for POST transaction
	    	_conf = {
		    	method: 'POST',
    			form: { id : _pickerForm, upload: true },
            	headers: { 'Content-Type': 'multipart/form-data' }
		    };
 
            // do request
            _request = Y.io( _uploadUrl, _conf );
    	},

        _onInputChange : function ( evt ) {

            // vars
            var _inputNode   = evt ? evt.target : null;

            if ( _inputNode ) {
                this._doUpload();
            }
        }
    } );

    // manage custom event
    Y.augment( PickerFile, Y.EventTarget );

    Y.namespace('Bewype');
    Y.Bewype.PickerFile = PickerFile;



}, '@VERSION@' ,{requires:['async-queue', 'io', 'json-parse', 'stylesheet', 'substitute', 'widget', 'yui-base']});
