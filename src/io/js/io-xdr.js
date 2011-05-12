   /**
    * Extends the IO base class to provide an alternate, Flash transport, for making
    * cross-domain requests.
    * @module io
    * @submodule io-xdr
    */

   /**
    * @event io:xdrReady
    * @description This event is fired by YUI.io when the specified transport is
    * ready for use.
    * @type Event Custom
    */
    var E_XDR_READY = Y.publish('io:xdrReady', { fireOnce: true }),

   /**
    * @description Object that stores callback handlers for cross-domain requests
    * when using Flash as the transport.
    *
    * @property _cB
    * @private
    * @static
    * @type object
    */
    _cB = {},

   /**
    * @description Map of transaction readyState values used when
    * XDomainRequest is the XDR transport.
    *
    * @property _rS
    * @private
    * @static
    * @type object
    */
    _rS = {},

    // Document reference
    d = Y.config.doc,
    // Window reference
    w = Y.config.win,
	// IE8 cross-origin request detection
    ie = w && w.XDomainRequest;

   /**
    * @description Method that creates the Flash transport swf.
    *
    * @method _swf
    * @private
    * @static
    * @param {string} uri - location of io.swf.
    * @param {string} yid - YUI instance id.
    * @return void
    */
    function _swf(uri, yid) {
        var o = '<object id="yuiIoSwf" type="application/x-shockwave-flash" data="' +
                uri + '" width="0" height="0">' +
                '<param name="movie" value="' + uri + '">' +
                '<param name="FlashVars" value="yid=' + yid + '">' +
                '<param name="allowScriptAccess" value="always">' +
                '</object>',
            c = d.createElement('div');

        d.body.appendChild(c);
        c.innerHTML = o;
    }

   /**
    * @description Sets event handlers for XDomainRequest transactions.
    *
    * @method _evt
    * @private
    * @static
    * @param {object} o - Transaction object generated by _create() in io-base.
    * @param {object} c - configuration object for the transaction.
    * @return void
    */
    function _evt(o, c) {
        o.c.onprogress = function() { _rS[o.id] = 3; };
        o.c.onload = function() {
            _rS[o.id] = 4;
            Y.io.xdrResponse(o, c, 'success');
        };
        o.c.onerror = function() {
            _rS[o.id] = 4;
            Y.io.xdrResponse(o, c, 'failure');
        };
        if (c.timeout) {
            o.c.ontimeout = function() {
                _rS[o.id] = 4;
                Y.io.xdrResponse(o, c, 'timeout');
            };
            o.c.timeout = c.timeout;
        }
    }

   /**
    * @description Creates a response object for XDR transactions, for success
    * and failure cases.
    *
    * @method _data
    * @private
    * @static
    * @param {object} o - Transaction object generated by _create() in io-base.
    * @param {boolean} f - True if Flash was used as the transport.
    * @param {boolean} t - DataType value, as defined in the configuration.
    *
    * @return object
    */
    function _data(o, f, t) {
        var s, x;

        if (!o.e) {
            s = f ? decodeURI(o.c.responseText) : o.c.responseText;
            x = t === 'xml' ?  Y.DataType.XML.parse(s) : null;

            return { id: o.id, c: { responseText: s, responseXML: x } };
        }
        else {
            return { id: o.id, e: o.e };
        }

    }

   /**
    * @description Method for intiating an XDR transaction abort.
    *
    * @method _abort
    * @private
    * @static
    * @param {object} o - Transaction object generated by _create() in io-base.
    * @param {object} c - configuration object for the transaction.
    */
    function _abort(o, c) {
        return o.c.abort(o.id, c);
    }

   /**
    * @description Method for determining if an XDR transaction has completed
    * and all data are received.
    *
    * @method _isInProgress.
    * @private
    * @static
    * @param {object} o - Transaction object generated by _create() in io-base.
    */
    function _isInProgress(o) {
        return ie ? _rS[o.id] !== 4 : o.c.isInProgress(o.id);
    }

    Y.mix(Y.io, {

       /**
        * @description Map of io transports.
        *
        * @property _transport
        * @private
        * @static
        * @type object
        */
        _transport: {},

       /**
        * @description Method for accessing the transport's interface for making a
        * cross-domain transaction.
        *
        * @method xdr
        * @private
        * @static
        * @param {string} uri - qualified path to transaction resource.
        * @param {object} o - Transaction object generated by _create() in io-base.
        * @param {object} c - configuration object for the transaction.
        */
        xdr: function(uri, o, c) {
			if (c.xdr.use === 'flash') {
				_cB[o.id] = {
					on: c.on,
					context: c.context,
					arguments: c.arguments
				};
				// These properties cannot be serialized across Flash's
				// ExternalInterface.  Doing so will result in exceptions.
				c.context = null;
				c.form = null;

				w.setTimeout(function() {
					if (o.c && o.c.send) {
						o.c.send(uri, c, o.id);
					}
					else {
						Y.io.xdrResponse(o, c, 'transport error');
					}
				}, Y.io.xdr.delay);
			}
			else if (ie) {
				_evt(o, c);
				o.c.open(c.method || 'GET', uri);
				o.c.send(c.data);
			}
			else {
				o.c.send(uri, o, c);
			}

			return {
				id: o.id,
				abort: function() {
					return o.c ? _abort(o, c) : false;
				},
				isInProgress: function() {
					return o.c ? _isInProgress(o.id) : false;
				}
			};
        },

       /**
        * @description Response controller for cross-domain requests when using the
        * Flash transport or IE8's XDomainRequest object.
        *
        * @method xdrResponse
        * @private
        * @static
        * @param {object} o - Transaction object generated by _create() in io-base.
        * @param {object} c - configuration object for the transaction.
        * @param {string} e - Event name
        * @return object
        */
        xdrResponse: function(o, c, e) {
            var cb,
                m = ie ? _rS : _cB,
                f = c.xdr.use === 'flash' ? true : false,
                t = c.xdr.dataType;
                c.on = c.on || {};

            if (f) {
                cb = _cB[o.id] ? _cB[o.id] : null;
                if (cb) {
                    c.on = cb.on;
                    c.context = cb.context;
                    c.arguments = cb.arguments;
                }
            }

            switch (e) {
                case 'start':
                    Y.io.start(o.id, c);
                    break;
                case 'complete':
                    Y.io.complete(o, c);
                    break;
                case 'success':
                    Y.io.success(t || f ? _data(o, f, t) : o, c);
                    delete m[o.id];
                    break;
                case 'timeout':
                case 'abort':
				case 'transport error':
					o.e = e;
                case 'failure':
                    Y.io.failure(t || f ? _data(o, f, t) : o, c);
                    delete m[o.id];
                    break;
            }
        },

       /**
        * @description Fires event "io:xdrReady"
        *
        * @method xdrReady
        * @private
        * @static
        * @param {number} id - transaction id
        * @param {object} c - configuration object for the transaction.
        *
        * @return void
        */
        xdrReady: function(id) {
			Y.io.xdr.delay = 0;
            Y.fire(E_XDR_READY, id);
        },

       /**
        * @description Method to initialize the desired transport.
        *
        * @method transport
        * @public
        * @static
        * @param {object} o - object of transport configurations.
        * @return void
        */
        transport: function(o) {
            var yid = o.yid || Y.id,
				oid = o.id || 'flash',
				src = Y.UA.ie ? o.src + '?d=' + new Date().valueOf().toString() : o.src;

            if (oid === 'native' || oid === 'flash') {

				_swf(src, yid);
                this._transport.flash = d.getElementById('yuiIoSwf');
            }
            else if (oid) {
                this._transport[o.id] = o.src;
            }
        }
    });

   /**
	* @description Delay value to calling the Flash transport, in the
	* event io.swf has not finished loading.  Once the E_XDR_READY
    * event is fired, this value will be set to 0.
	*
	* @property delay
	* @public
	* @static
	* @type number
	*/
	Y.io.xdr.delay = 50;