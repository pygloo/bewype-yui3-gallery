
    /**
     *
     */
    var BTN_TEMPLATE = null,
        EntrySpinner = null;

    BTN_TEMPLATE = '<button type="button"></button>';

    /**
     *
     */
    EntrySpinner = function (config) {
        EntrySpinner.superclass.constructor.apply(this, arguments);
    };

    /**
     */
    EntrySpinner.NAME = 'entry-spinner';

    /**
     * 
     */
    EntrySpinner.NS = 'entrySpinner';

    /**
     *
     */
    EntrySpinner.ATTRS = {

        // The minimum value for the spinner.
        min : {
            value: 0
        },

        // The maximum value for the spinner.
        max : {
            value: 100
        },

        // The current value of the spinner.
        value : {
            value: 0,
            validator: function(val) {
                return this._validateValue(val);
            }
        },

        // Amount to increment/decrement the spinner when the buttons or arrow up/down keys are pressed.
        minorStep : {
            value: 1
        },

        // Amount to increment/decrement the spinner when the page up/down keys are pressed.
        majorStep : {
            value: 10
        },

        // The strings for the spinner UI. This attribute is 
        // defined by the base Widget class but has an empty value. The
        // spinner is simply providing a default value for the attribute.
        strings: {
            value: {
                tooltip: 'Press the arrow up/down keys for minor increments, page up/down for major increments.',
                increment: 'Increment',
                decrement: 'Decrement'
            }
        }
    };

    /* Static constant used to identify the classname applied to the spinners value field */
    EntrySpinner.INPUT_CLASS = Y.ClassNameManager.getClassName(EntrySpinner.NAME, 'value');

    /* Static constants used to define the markup templates used to create Spinner DOM elements */
    EntrySpinner.INPUT_TEMPLATE = '<input type="text" class="' + EntrySpinner.INPUT_CLASS + '">';
    EntrySpinner.BTN_TEMPLATE   = '<button type="button"></button>';

    /* 
     * The HTML_PARSER static constant is used by the Widget base class to populate 
     * the configuration for the spinner instance from markup already on the page.
     *
     * The Spinner class attempts to set the value of the spinner widget if it
     * finds the appropriate input element on the page.
     */
    EntrySpinner.HTML_PARSER = {
        value: function ( srcNode ) {
            var val = parseInt( srcNode.get( 'value' ), 10 ); 
            return Y.Lang.isNumber( val ) ? val : null;
        }
    };

    Y.extend( EntrySpinner, Y.Widget, {

        /*
         * initializer is part of the lifecycle introduced by 
         * the Widget class. It is invoked during construction,
         * and can be used to setup instance specific state.
         * 
         * The Spinner class does not need to perform anything
         * specific in this method, but it is left in as an example.
         */
        initializer: function () {
            // our custom event
            this.publish( 'entry:onChange' );
        },

        /*
         * destructor is part of the lifecycle introduced by 
         * the Widget class. It is invoked during destruction,
         * and can be used to cleanup instance specific state.
         * 
         * The spinner cleans up any node references it's holding
         * onto. The Widget classes destructor will purge the 
         * widget's bounding box of event listeners, so spinner 
         * only needs to clean up listeners it attaches outside of 
         * the bounding box.
         */
        destructor : function () {

            this._keyUpHandle.detach();
            this._mouseUpHandle.detach();

            this.inputNode = null;
            this.incrementNode = null;
            this.decrementNode = null;
        },

        /*
         * renderUI is part of the lifecycle introduced by the
         * Widget class. Widget's renderer method invokes:
         *
         *     renderUI()
         *     bindUI()
         *     syncUI()
         *
         * renderUI is intended to be used by the Widget subclass
         * to create or insert new elements into the DOM. 
         *
         * For spinner the method adds the input (if it's not already 
         * present in the markup), and creates the inc/dec buttons
         */
        renderUI : function () {
            this._renderInput();
            this._renderButtons();
        },

        /*
         * bindUI is intended to be used by the Widget subclass 
         * to bind any event listeners which will drive the Widget UI.
         * 
         * It will generally bind event listeners for attribute change
         * events, to update the state of the rendered UI in response 
         * to attribute value changes, and also attach any DOM events,
         * to activate the UI.
         * 
         * For spinner, the method:
         *
         * - Sets up the attribute change listener for the 'value' attribute
         *
         * - Binds key listeners for the arrow/page keys
         * - Binds mouseup/down listeners on the boundingBox, document respectively.
         * - Binds a simple change listener on the input box.
         */
        bindUI : function () {

            this.after( 'valueChange', this._afterValueChange );

            var boundingBox      = this.get( 'boundingBox' ),
                onKeyDownFn      = Y.bind( this._onKeyDown, this ),
                onKeyUpFn        = Y.bind( this._onKeyUp, this ),
                onMouseDownFn    = Y.bind( this._onMouseDown, this ),
                onMouseUpFn      = Y.bind( this._onMouseUp, this ),
                onwerDoc         = boundingBox.get( 'ownerDocument' ),
                keyEventSpec     = (!Y.UA.opera) ? 'down:' : 'press:';

            // Looking for a key event which will fire continously across browsers
            // while the key is held down. 38, 40 = arrow up/down, 33, 34 = page up/down
            keyEventSpec += '38, 40, 33, 34';

            Y.on( 'keydown', onKeyDownFn, boundingBox, keyEventSpec );
            this._keyUpHandle = Y.on( 'keyup', onKeyUpFn, onwerDoc );
            //
            Y.on( 'mousedown', onMouseDownFn, boundingBox );
            this._mouseUpHandle = Y.on( 'mouseup', onMouseUpFn, onwerDoc );

            //
            Y.on('change', Y.bind( this._onInputChange, this ), this.inputNode );
        },

        /*
         * syncUI is intended to be used by the Widget subclass to
         * update the UI to reflect the current state of the widget.
         * 
         * For spinner, the method sets the value of the input field,
         * to match the current state of the value attribute.
         */
        syncUI : function () {
            this._uiSetValue( this.get( 'value' ) );
        },

        /*
         * Creates the input control for the spinner and adds it to
         * the widget's content box, if not already in the markup.
         */
        _renderInput : function () {
                   
            var contentBox = this.get( 'contentBox' ),
            input = contentBox.one( '.' + EntrySpinner.INPUT_CLASS ),
            strings = this.get( 'strings' );

            if (!input) {
                input = Y.Node.create( EntrySpinner.INPUT_TEMPLATE );
                contentBox.appendChild( input );
            }

            input.set( 'title', strings.tooltip );
            this.inputNode = input;
        },

        /*
         * Creates the button controls for the spinner and add them to
         * the widget's content box, if not already in the markup.
         */
        _renderButtons : function () {
            var contentBox  = this.get( 'contentBox' ),
                strings     = this.get( 'strings' ),
                inc         = this._createButton( strings.increment, this.getClassName( 'increment' ) ),
                dec         = this._createButton( strings.decrement, this.getClassName( 'decrement' ) );

            this.incrementNode = contentBox.appendChild( inc );
            this.decrementNode = contentBox.appendChild( dec );
        },

        /*
         * Utility method, to create a spinner button
         */
        _createButton : function ( text, className ) {

            var btn = Y.Node.create( EntrySpinner.BTN_TEMPLATE );
            btn.set( 'innerHTML', text );
            btn.set( 'title', text );
            btn.addClass( className );

            return btn;
        },

        /*
         * Bounding box mouse down handler. Will determine if the mouse down
         * is on one of the spinner buttons, and increment/decrement the value
         * accordingly.
         * 
         * The method also sets up a timer, to support the user holding the mouse
         * down on the spinner buttons. The timer is cleared when a mouse up event
         * is detected.
         */
        _onMouseDown : function ( e ) {
            var node = e.target,
                dir = null,
                handled = false,
                currVal = this.get( 'value' ),
                minorStep = this.get( 'minorStep' );

            if (node.hasClass( this.getClassName( 'increment' ) ) ) {
                this.set( 'value', currVal + minorStep );
                dir = 1;
                handled = true;
            } else if ( node.hasClass( this.getClassName( 'decrement' ) ) ) {
                this.set( 'value', currVal - minorStep );
                dir = -1;
                handled = true;
            }

            if ( handled ) {
                this._setMouseDownTimers( dir, minorStep );
            }
        },

        /*
         * Override the default content box value, since we don't want the srcNode
         * to be the content box for spinner.
         */
        _defaultCB : function () {
            return null;
        },

        /*
         * Document key up handler. Clears the timers supporting
         * the 'key held down' behavior.
         */
        _onKeyUp : function (e) {
            this._clearKeyDownTimers();
        },

        /*
         * Document mouse up handler. Clears the timers supporting
         * the 'mouse held down' behavior.
         */
        _onMouseUp : function (e) {
            this._clearMouseDownTimers();
        },

        /*
         * Bounding box Arrow up/down, Page up/down key listener.
         *
         * Increments/Decrement the spinner value, based on the key pressed.
         */
        _onKeyDown : function ( e ) {

            var currVal = this.get( 'value' ),
                newVal  = currVal,
                handled = false,
                step = null,
                dir = null,
                minorStep = this.get( 'minorStep' ),
                majorStep = this.get( 'majorStep' );

            switch (e.charCode) {
                case 38:
                    newVal += minorStep;
                    handled = true;
                    step = minorStep;
                    dir = 1;
                    break;
                case 40:
                    newVal -= minorStep;
                    handled = true;
                    step = minorStep;
                    dir = -1;
                    break;
                case 33:
                    newVal += majorStep;
                    newVal = Math.min( newVal, this.get( 'max' ) );
                    handled = true;
                    step = majorStep;
                    dir = 1;
                    break;
                case 34:
                    newVal -= majorStep;
                    newVal = Math.max( newVal, this.get( 'min' ) );
                    handled = true;
                    step = majorStep;
                    dir = -1;
                    break;
            }

            if ( newVal !== currVal ) {
                this.set( 'value', newVal );
            }

            if ( handled ) {
                this._setKeyDownTimers( dir, step );
            }
        },

        /*
         * Simple change handler, to make sure user does not input an invalid value
         */
        _onInputChange : function ( e ) {
            var _value = parseInt( this.inputNode.get( 'value' ), 10 );
            // check valid
            if ( this._validateValue( _value ) ) {
                // update
                this.set( 'value', _value );
            } else {
                // restore old value
                this.inputNode.set( 'value', this.get( 'value' ) );
            }
        },

        /*
         * Initiates key down timers, to increment slider, while key button
         * is held down
         */
        _setKeyDownTimers : function ( dir, step ) {
            this._keyDownTimer = Y.later( 500, this, function() {
                this._keyPressTimer = Y.later( 100, this, function() {
                    this.set( 'value', this.get( 'value' ) + ( dir * step ) );
                }, null, true );
            } );
        },

        /*
         * Initiates mouse down timers, to increment slider, while mouse button
         * is held down
         */
        _setMouseDownTimers : function ( dir, step ) {
            this._mouseDownTimer = Y.later( 500, this, function() {
                this._mousePressTimer = Y.later( 100, this, function() {
                    this.set( 'value', this.get( 'value' ) + ( dir * step ) );
                }, null, true );
            } );
        },

        /*
         * Clears timers used to support the 'mouse held down' behavior
         */
        _clearKeyDownTimers : function () {
            if ( this._keyDownTimer ) {
                this._keyDownTimer.cancel();
                this._keyDownTimer = null;
            }
            if ( this._keyPressTimer ) {
                this._keyPressTimer.cancel();
                this._keyPressTimer = null;
            }
        },

        /*
         * Clears timers used to support the 'mouse held down' behavior
         */
        _clearMouseDownTimers : function () {
            if ( this._mouseDownTimer ) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
            if ( this._mousePressTimer ) {
                this._mousePressTimer.cancel();
                this._mousePressTimer = null;
            }
        },

        /*
         * value attribute change listener. Updates the 
         * value in the rendered input box, whenever the 
         * attribute value changes.
         */
        _afterValueChange : function ( e ) {
            //
            this._uiSetValue( e.newVal );
            // fire custom event
            this.fire("entry:onChange");
        },

        /*
         * Updates the value of the input box to reflect 
         * the value passed in
         */
        _uiSetValue : function ( val ) {
            //
            this.inputNode.set('value', val);
        },

        /*
         * value attribute default validator. Verifies that
         * the value being set lies between the min/max value
         */
        _validateValue: function ( val ) {
            var min = this.get('min'),
                max = this.get('max');
            return ( Y.Lang.isNumber( val ) && val >= min && val <= max );
        },

        getValue : function () {
            return this.get( 'value' );
        },

        setValue : function ( value ) {
           this.set( 'value', value );
        }

    } );

    Y.namespace('Bewype');
    Y.Bewype.EntrySpinner = EntrySpinner;

